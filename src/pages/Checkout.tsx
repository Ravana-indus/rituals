import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, authLoading, navigate]);
  const [promoCode, setPromoCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('payhere');

  const [promoApplied, setPromoApplied] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [payHereParams, setPayHereParams] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [payHereError, setPayHereError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.address && formData.city && formData.phone;
    }
    return true;
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      setPromoSuccess(true);
      setTimeout(() => setPromoSuccess(false), 2000);
    }
  };

  const handlePlaceOrder = async () => {
    if (!canProceed()) return;
    setPlacingOrder(true);
    setPayHereError('');
    setPayHereParams(null);
    
    try {
      console.log('=== ORDER PLACEMENT DEBUG ===');
      console.log('Items in cart:', items.length);
      items.forEach((item, i) => {
        console.log(`Item ${i + 1}: ${item.title}, qty=${item.quantity}, priceValue=${item.priceValue}, lineTotal=${item.priceValue * item.quantity}`);
      });
      console.log('Subtotal (rupees):', subtotal);
      
      // All values in rupees (matching price_cents storage)
      const shipping = deliveryMethod === 'express' ? 750 : 450;
      const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
      const total = subtotal + shipping - discount;
      const totalAmount = total.toFixed(2);
      
      console.log('Shipping (rupees):', shipping);
      console.log('Discount (rupees):', discount);
      console.log('Total (rupees):', total);
      console.log('Total Amount:', totalAmount);
      console.log('=== END DEBUG ===');

      if (!user) {
        throw new Error('Please log in to place an order');
      }

      if (items.length === 0) {
        throw new Error('Your cart is empty');
      }

      console.log('Creating shipping address...');
      const shippingAddress = await api.addresses.create({
        user_id: user.id,
        recipient_name: `${formData.firstName} ${formData.lastName}`,
        address_line_1: formData.address,
        address_line_2: null,
        city: formData.city,
        district: '',
        postal_code: formData.postalCode ?? null,
        country: 'Sri Lanka',
        phone: formData.phone ?? null,
        is_default: false,
        address_type: null,
        label: null,
      });
      console.log('Shipping address created:', shippingAddress.id);

      // Create order directly from cart context items (no need to query DB cart)
      console.log('Creating order with items from cart context...');
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          email: user.email ?? '',
          subtotal_cents: subtotal,
          shipping_address_id: shippingAddress.id,
          billing_address_id: shippingAddress.id,
          shipping_cents: shipping,
          discount_cents: discount,
          total_cents: total,
          payment_method: paymentMethod,
          payment_status: 'pending',
          status: 'pending',
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      console.log('Order created:', order.id);

      // Create order items from cart context
      console.log('Creating order items...');
      for (const item of items) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          product_id: item.productId,
          variant_id: item.variantId ?? null,
          product_name: item.title,
          quantity: item.quantity,
          unit_price_cents: item.priceValue,
          total_cents: item.priceValue * item.quantity,
        });
      }
      console.log('Order items created');

      // Prepare PayHere params for form submission
      const phoneFormatted = `94${formData.phone.replace(/\s/g, '').replace(/^0/, '')}`;
      
      console.log('Preparing PayHere params...');
      const params = {
        merchant_id: '1224574',
        return_url: `${window.location.origin}/order-confirmed?order_id=${order.id}`,
        cancel_url: `${window.location.origin}/checkout`,
        notify_url: `https://xbnsztyfyrhrdqhbboip.supabase.co/functions/v1/payhere-webhook`,
        order_id: order.id,
        items: `${items.length} item(s) - The Heritage Curator`,
        currency: 'LKR',
        amount: totalAmount,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: user.email,
        phone: phoneFormatted,
        address: formData.address,
        city: formData.city,
        country: 'Sri Lanka',
      };
      
      console.log('PayHere params prepared:', params);
      setPayHereParams(params);
      
      // Store order ID for return
      localStorage.setItem('pending_order_id', order.id);
      
      // Submit form after a brief delay to allow React to render
      setTimeout(() => {
        if (formRef.current) {
          console.log('Submitting PayHere form...');
          formRef.current.submit();
        } else {
          console.error('Form ref not available');
          setPayHereError('Failed to initiate payment. Please try again.');
          setPlacingOrder(false);
        }
      }, 100);
      
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setPayHereError(err?.message || 'Failed to place order. Please try again.');
      setPlacingOrder(false);
    }
  };

  // All values in rupees (matching how price_cents is stored)
  const shipping = deliveryMethod === 'express' ? 750 : 450;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  const formatPrice = (price: number) => 'LKR ' + price.toLocaleString('en-US');

  const stepClass = (s: number) => {
    if (step > s) return 'bg-primary text-on-primary border-primary';
    if (step === s) return 'bg-primary text-on-primary border-primary';
    return 'border-outline-variant text-on-surface-variant';
  };

  return (
    <div className="bg-surface  selection:bg-secondary-fixed min-h-screen flex flex-col font-manrope text-on-surface">
      <Header />

      <main className="pt-8 pb-24 px-4 md:px-8 max-w-7xl mx-auto flex-grow w-full">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8">
          <Icon name="arrow_back" className="text-lg" />
          Return to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <div className="overflow-x-auto no-scrollbar mb-8 pb-2">
              <nav className="flex items-center gap-4 min-w-[360px]">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${stepClass(1)}`}>
                    {step > 1 ? <Icon name="check" className="text-sm" /> : '1'}
                  </span>
                  <span className={`text-sm tracking-tight font-medium ${step === 1 ? 'text-primary' : 'text-on-surface-variant'}`}>Shipping</span>
                </div>
                <div className="h-px w-8 bg-outline-variant/30 flex-shrink-0"></div>
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${stepClass(2)}`}>
                    {step > 2 ? <Icon name="check" className="text-sm" /> : '2'}
                  </span>
                  <span className={`text-sm tracking-tight font-medium ${step === 2 ? 'text-primary' : 'text-on-surface-variant'}`}>Delivery</span>
                </div>
                <div className="h-px w-8 bg-outline-variant/30 flex-shrink-0"></div>
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${stepClass(3)}`}>
                    {step > 3 ? <Icon name="check" className="text-sm" /> : '3'}
                  </span>
                  <span className={`text-sm tracking-tight font-medium ${step === 3 ? 'text-primary' : 'text-on-surface-variant'}`}>Payment</span>
                </div>
              </nav>
            </div>

            {step === 1 && (
              <section className="space-y-8">
                <h1 className="font-noto-serif text-3xl text-on-surface">Shipping Details</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">First Name</label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="bg-surface-container border-0 border-b border-outline-variant/30 focus:border-primary transition-colors py-3 px-0 text-on-surface placeholder:text-on-surface/30 outline-none "
                      placeholder="e.g. Arjuna"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Last Name</label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="bg-surface-container border-0 border-b border-outline-variant/30 focus:border-primary transition-colors py-3 px-0 text-on-surface placeholder:text-on-surface/30 outline-none "
                      placeholder="e.g. Wijesinghe"
                      type="text"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Shipping Address</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="bg-surface-container border-0 border-b border-outline-variant/30 focus:border-primary transition-colors py-3 px-0 text-on-surface placeholder:text-on-surface/30 outline-none "
                      placeholder="Street name and house number"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">City</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="bg-surface-container border-0 border-b border-outline-variant/30 focus:border-primary transition-colors py-3 px-0 text-on-surface placeholder:text-on-surface/30 outline-none "
                      placeholder="Colombo"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Postal Code</label>
                    <input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="bg-surface-container border-0 border-b border-outline-variant/30 focus:border-primary transition-colors py-3 px-0 text-on-surface placeholder:text-on-surface/30 outline-none "
                      placeholder="00100"
                      type="text"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Phone Number</label>
                    <div className="flex gap-2 sm:gap-4">
                      <span className="bg-surface-container border-b border-outline-variant/30 py-3 px-2 text-on-surface-variant  flex-shrink-0">+94</span>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full min-w-0 bg-surface-container border-0 border-b border-outline-variant/30 focus:border-primary transition-colors py-3 px-0 text-on-surface placeholder:text-on-surface/30 outline-none "
                        placeholder="77 123 4567"
                        type="tel"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="space-y-8">
                <h1 className="font-noto-serif text-3xl text-on-surface">Delivery Method</h1>
                <div className="space-y-4">
                  <label className={`flex items-center justify-between p-6 rounded-xl border-2 cursor-pointer transition-all ${deliveryMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'}`}>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="delivery"
                        value="standard"
                        checked={deliveryMethod === 'standard'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-bold text-on-surface">Standard Shipping</h3>
                        <p className="text-sm text-on-surface-variant">3-5 business days</p>
                      </div>
                    </div>
                    <span className="text-primary font-bold">Rs. 450.00</span>
                  </label>

                  <label className={`flex items-center justify-between p-6 rounded-xl border-2 cursor-pointer transition-all ${deliveryMethod === 'express' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'}`}>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="delivery"
                        value="express"
                        checked={deliveryMethod === 'express'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-bold text-on-surface">Express Delivery</h3>
                        <p className="text-sm text-on-surface-variant">1-2 business days</p>
                      </div>
                    </div>
                    <span className="text-primary font-bold">Rs. 750.00</span>
                  </label>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="space-y-8">
                <h1 className="font-noto-serif text-3xl text-on-surface">Payment Details</h1>
                <div className="space-y-4">
                  <label className={`flex items-center justify-between p-6 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'payhere' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'}`}>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="payhere"
                        checked={paymentMethod === 'payhere'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-bold text-on-surface">Credit / Debit Card</h3>
                        <p className="text-sm text-on-surface-variant">Secure payment via PayHere</p>
                      </div>
                    </div>
                    <img src="https://www.payhere.lk/images/logo.png" alt="PayHere" className="h-6" />
                  </label>

                  <label className={`flex items-center justify-between p-6 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'}`}>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-bold text-on-surface">Cash on Delivery</h3>
                        <p className="text-sm text-on-surface-variant">Pay with cash upon delivery</p>
                      </div>
                    </div>
                    <Icon name="payments" className="text-2xl text-on-surface-variant" />
                  </label>

                  <label className={`flex items-center justify-between p-6 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'}`}>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-bold text-on-surface">Bank Transfer</h3>
                        <p className="text-sm text-on-surface-variant">Transfer directly to our bank account</p>
                      </div>
                    </div>
                    <Icon name="account_balance" className="text-2xl text-on-surface-variant" />
                  </label>
                </div>

                {paymentMethod === 'payhere' && (
                  <div className="p-6 bg-surface-container  rounded-xl space-y-6">
                    <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <Icon name="lock" className="text-primary" />
                      <span>Your payment is processed securely by PayHere. We never store your card details.</span>
                    </div>
                    {payHereError && (
                      <div className="p-4 bg-error/10 border border-error/30 rounded-lg text-sm text-error">
                        {payHereError}
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="p-6 bg-surface-container  rounded-xl space-y-4">
                    <h4 className="font-bold text-sm">Bank Account Details</h4>
                    <div className="text-sm text-on-surface-variant space-y-1">
                      <p>Bank: Commercial Bank</p>
                      <p>Branch: Colombo 01</p>
                      <p>Account Name: The Heritage Curator</p>
                      <p>Account Number: 1234567890</p>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-4 italic">Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                  </div>
                )}
              </section>
            )}

            <div className="flex items-center justify-between pt-6">
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                  <Icon name="arrow_back" className="text-lg" />
                  Back
                </button>
              ) : (
                <div />
              )}
              {step < 3 ? (
                <button
                  onClick={() => canProceed() && setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className={`px-12 py-4 rounded-md font-bold tracking-wide transition-all text-center ${
                    canProceed()
                      ? 'bg-primary text-on-primary hover:opacity-90 shadow-lg shadow-primary/10'
                      : 'bg-outline-variant/30 text-on-surface-variant cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={!canProceed() || placingOrder}
                  className={`px-12 py-4 rounded-md font-bold tracking-wide transition-all text-center ${
                    canProceed() && !placingOrder
                      ? 'bg-secondary text-on-secondary hover:opacity-90 shadow-lg shadow-secondary/10'
                      : 'bg-outline-variant/30 text-on-surface-variant cursor-not-allowed'
                  }`}
                >
                  {placingOrder ? 'Processing...' : 'Place Order'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 border-t border-outline-variant/15">
              <div className="flex flex-col items-center text-center gap-3">
                <Icon name="workspace_premium" filled className="text-primary text-3xl" />
                <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Authentic Sourcing</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Icon name="encrypted" filled className="text-primary text-3xl" />
                <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Secure SSL Payment</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 col-span-2 md:col-span-1">
                <Icon name="eco" filled className="text-primary text-3xl" />
                <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Ethically Crafted</p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-20 md:top-32 p-8 bg-surface-container  rounded-2xl space-y-6 shadow-[0_20px_40px_rgba(28,28,23,0.04)]">
              <h2 className="font-noto-serif text-2xl text-on-surface">Order Summary</h2>

              <div className="space-y-4 max-h-64 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-sm text-on-surface-variant text-center py-4">No items in cart</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-16 md:w-20 h-16 md:h-20 bg-surface-container-low rounded overflow-hidden flex-shrink-0">
                        <img src={item.imgSrc} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-manrope font-bold text-xs truncate">{item.title}</h4>
                        <p className="text-xs text-on-surface-variant">{item.size} × {item.quantity}</p>
                        <p className="text-sm font-bold text-secondary">{item.price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo or Gift Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-grow bg-surface border border-outline-variant/20 rounded-md py-2 px-3 text-sm focus:border-primary outline-none  "
                />
                <button
                  onClick={handleApplyPromo}
                  className={`px-4 py-2 font-bold text-xs rounded-md transition-all ${
                    promoSuccess ? 'bg-green-600 text-on-surface' : 'bg-surface-container-highest text-on-surface hover:bg-outline-variant/20'
                  }`}
                >
                  {promoSuccess ? 'Applied!' : 'Apply'}
                </button>
              </div>

              <div className="space-y-3 pt-4 border-t border-outline-variant/15">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    Shipping
                    {promoApplied && <span className="bg-green-600/20 text-green-600  text-xs px-2 py-0.5 rounded-full font-bold">10% Off</span>}
                  </span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm text-green-600 ">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/15">
                  <span className="font-noto-serif text-xl font-bold text-on-surface">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold font-noto-serif text-secondary">{formatPrice(total)}</p>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Includes taxes</p>
                  </div>
                </div>
              </div>

              {promoApplied && (
                <div className="bg-secondary-fixed/20 text-on-secondary-fixed p-4 rounded-lg flex items-center gap-3 border border-secondary/10">
                  <Icon name="local_offer" filled className="text-secondary" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Heritage Benefit</p>
                    <p className="text-xs italic font-noto-serif">You've saved {formatPrice(discount)} today!</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Hidden PayHere Form */}
      {payHereParams && (
        <form
          ref={formRef}
          action="https://sandbox.payhere.lk/pay/checkout"
          method="POST"
          style={{ display: 'none' }}
        >
          <input type="hidden" name="merchant_id" value={payHereParams.merchant_id} />
          <input type="hidden" name="return_url" value={payHereParams.return_url} />
          <input type="hidden" name="cancel_url" value={payHereParams.cancel_url} />
          <input type="hidden" name="notify_url" value={payHereParams.notify_url} />
          <input type="hidden" name="order_id" value={payHereParams.order_id} />
          <input type="hidden" name="items" value={payHereParams.items} />
          <input type="hidden" name="currency" value={payHereParams.currency} />
          <input type="hidden" name="amount" value={payHereParams.amount} />
          <input type="hidden" name="first_name" value={payHereParams.first_name} />
          <input type="hidden" name="last_name" value={payHereParams.last_name} />
          <input type="hidden" name="email" value={payHereParams.email} />
          <input type="hidden" name="phone" value={payHereParams.phone} />
          <input type="hidden" name="address" value={payHereParams.address} />
          <input type="hidden" name="city" value={payHereParams.city} />
          <input type="hidden" name="country" value={payHereParams.country} />
        </form>
      )}

      <footer className="bg-surface-container border-t border-outline-variant/15 py-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="font-noto-serif italic text-xl text-on-surface">The Heritage Curator.</span>
            <p className="font-manrope text-sm tracking-wide text-on-surface-variant max-w-sm">
              © 2024 The Heritage Curator. Crafted with intention. Supporting artisan communities across Sri Lanka.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 md:justify-end">
            <Link to="/support" className="text-sm font-manrope text-on-surface-variant hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link to="/support" className="text-sm font-manrope text-on-surface-variant hover:text-secondary transition-colors">Terms of Service</Link>
            <Link to="/support" className="text-sm font-manrope text-on-surface-variant hover:text-secondary transition-colors">Authenticity Guarantee</Link>
            <Link to="/support" className="text-sm font-manrope text-on-surface-variant hover:text-secondary transition-colors">Shipping & Returns</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
