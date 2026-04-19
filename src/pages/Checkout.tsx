import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Truck,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Info,
  Banknote,
  Building2,
} from 'lucide-react';
import BrandedLayout from '../components/BrandedLayout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import { formatPriceCents } from '../types/database';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/checkout');
    }
    window.scrollTo(0, 0);
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
    
    try {
      const shippingValue = deliveryMethod === 'express' ? 75000 : 45000;
      const discountValue = promoApplied ? Math.round(subtotal * 0.1) : 0;
      const totalValue = subtotal + shippingValue - discountValue;
      const totalAmount = (totalValue / 100).toFixed(2);

      if (!user) throw new Error('Please log in to place an order');
      if (items.length === 0) throw new Error('Your cart is empty');

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

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          email: user.email ?? '',
          subtotal_cents: subtotal,
          shipping_address_id: shippingAddress.id,
          billing_address_id: shippingAddress.id,
          shipping_cents: shippingValue,
          discount_cents: discountValue,
          total_cents: totalValue,
          payment_method: paymentMethod,
          payment_status: 'pending',
          status: 'pending',
        })
        .select()
        .single();
      
      if (orderError) throw orderError;

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

      if (paymentMethod === 'payhere') {
        const phoneFormatted = formData.phone.replace(/\D/g, '').replace(/^0/, '94');

        // Call the payhere-initiate edge function to get the server-generated hash
        const initiateRes = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payhere-initiate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            order_id: order.id,
            amount: totalAmount,
            currency: 'LKR',
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: user.email,
            phone: phoneFormatted,
            address: formData.address,
            city: formData.city,
            country: 'Sri Lanka',
            items: `${items.length} item(s) - Rituals.lk`,
            return_url: `${window.location.origin}/order-confirmed?order_id=${order.id}`,
            notify_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payhere-webhook`,
          }),
        });

        const initiateData = await initiateRes.json();
        if (!initiateRes.ok || !initiateData?.signature) {
          throw new Error(initiateData?.error || 'Failed to initiate payment');
        }

        // Build PayHere form params using server-returned hash + client details
        const payHereUrl = initiateData.payhereUrl;
        const params = {
          merchant_id: initiateData.merchant_id,
          return_url: `${window.location.origin}/order-confirmed?order_id=${order.id}`,
          cancel_url: `${window.location.origin}/checkout`,
          notify_url: initiateData.notify_url,
          order_id: initiateData.order_id,
          items: `${items.length} item(s) - Rituals.lk`,
          currency: initiateData.currency,
          amount: initiateData.amount,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: user.email,
          phone: phoneFormatted,
          address: formData.address,
          city: formData.city,
          country: 'Sri Lanka',
          hash: initiateData.signature,
        };

        setPayHereParams(params);
        localStorage.setItem('pending_order_id', order.id);
        
        // Submit the hidden form with hash-authenticated params
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.action = payHereUrl;
            formRef.current.submit();
          }
        }, 100);
      } else {
        navigate(`/order-confirmed?order_id=${order.id}`);
      }
      
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setPayHereError(err?.message || 'Failed to place order. Please try again.');
      setPlacingOrder(false);
    }
  };

  const shipping = deliveryMethod === 'express' ? 75000 : 45000;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  return (
    <BrandedLayout>
      <div className="px-[var(--dd-space-4)] py-[var(--dd-space-4)] md:px-[var(--dd-space-6)]">
        <Link to="/cart" className="inline-flex items-center gap-2 text-[14px] font-bold opacity-40 hover:opacity-100 transition mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8">
            {/* Steps Progress */}
            <div className="mb-12 flex items-center justify-between max-w-md">
              <StepItem num={1} label="Shipping" active={step >= 1} done={step > 1} />
              <div className={`h-[2px] flex-1 mx-4 ${step > 1 ? 'bg-[var(--dd-surface-base)]' : 'bg-[var(--dd-surface-strong)]'}`} />
              <StepItem num={2} label="Delivery" active={step >= 2} done={step > 2} />
              <div className={`h-[2px] flex-1 mx-4 ${step > 2 ? 'bg-[var(--dd-surface-base)]' : 'bg-[var(--dd-surface-strong)]'}`} />
              <StepItem num={3} label="Payment" active={step >= 3} done={step > 3} />
            </div>

            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-[28px] font-bold tracking-tight">Shipping Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. Arjuna" />
                  <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Wijesinghe" />
                  <div className="md:col-span-2">
                    <Input label="Street Address" name="address" value={formData.address} onChange={handleChange} placeholder="Street name and house number" />
                  </div>
                  <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Colombo" />
                  <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="00100" />
                  <div className="md:col-span-2">
                    <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="77 123 4567" prefix="+94" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-[28px] font-bold tracking-tight">Delivery Method</h2>
                <div className="space-y-3">
                  <SelectionCard 
                    icon={Truck}
                    title="Standard Shipping"
                    sub="3-5 business days"
                    price={formatPriceCents(45000)}
                    selected={deliveryMethod === 'standard'}
                    onClick={() => setDeliveryMethod('standard')}
                  />
                  <SelectionCard 
                    icon={Truck}
                    title="Express Delivery"
                    sub="1-2 business days"
                    price={formatPriceCents(75000)}
                    selected={deliveryMethod === 'express'}
                    onClick={() => setDeliveryMethod('express')}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-[28px] font-bold tracking-tight">Payment Method</h2>
                <div className="space-y-3">
                  <SelectionCard 
                    icon={CreditCard}
                    title="Credit / Debit Card"
                    sub="Secure payment via PayHere"
                    selected={paymentMethod === 'payhere'}
                    onClick={() => setPaymentMethod('payhere')}
                    badge={<img src="https://www.payhere.lk/images/logo.png" alt="PayHere" className="h-4" />}
                  />
                  <SelectionCard 
                    icon={Banknote}
                    title="Cash on Delivery"
                    sub="Pay with cash upon delivery"
                    selected={paymentMethod === 'cod'}
                    onClick={() => setPaymentMethod('cod')}
                  />
                  <SelectionCard 
                    icon={Building2}
                    title="Bank Transfer"
                    sub="Direct deposit to our account"
                    selected={paymentMethod === 'bank_transfer'}
                    onClick={() => setPaymentMethod('bank_transfer')}
                  />
                </div>

                {payHereError && (
                  <div className="p-4 bg-[#AF8F6F]/5 border-[#AF8F6F]/10 rounded-[var(--dd-radius-xs)] text-[#AF8F6F] text-[13px] font-medium flex gap-3">
                    <Info className="h-4 w-4 flex-shrink-0" />
                    {payHereError}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-12 pt-8 border-t border-[var(--dd-surface-strong)]">
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="text-[14px] font-bold opacity-60 hover:opacity-100 transition">
                  Back
                </button>
              ) : <div />}
              
              <button
                onClick={() => step < 3 ? setStep(s => s + 1) : handlePlaceOrder()}
                disabled={!canProceed() || placingOrder}
                className="rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] px-12 py-4 text-[16px] font-bold text-white shadow-lg transition hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
              >
                {placingOrder ? 'Processing...' : step === 3 ? 'Place Order' : 'Continue'}
              </button>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-[100px] space-y-6">
              <div className="p-8 bg-white rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] shadow-sm">
                <h2 className="text-[20px] font-bold tracking-tight mb-6">Your Order</h2>
                
                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="h-16 w-16 rounded-sm bg-[#f8f9fa] border border-[var(--dd-surface-strong)] flex-shrink-0 overflow-hidden">
                        <img src={item.imgSrc} alt={item.title} className="h-full w-full object-contain mix-blend-multiply p-1" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-[13px] font-bold truncate">{item.title}</h4>
                        <p className="text-[12px] opacity-40">{item.quantity} × {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-[var(--dd-surface-strong)]">
                  <div className="flex justify-between text-[14px]">
                    <span className="opacity-60">Subtotal</span>
                    <span className="font-bold">{formatPriceCents(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="opacity-60">Shipping</span>
                    <span className="font-bold">{formatPriceCents(shipping)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-[14px] text-green-600">
                      <span>Discount (10%)</span>
                      <span className="font-bold">-{formatPriceCents(discount)}</span>
                    </div>
                  )}
                  <div className="pt-4 flex justify-between items-center text-[18px] font-bold">
                    <span>Total</span>
                    <span>{formatPriceCents(total)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] space-y-4">
                 <div className="flex items-center gap-3 text-[13px] font-medium opacity-60">
                   <ShieldCheck className="h-5 w-5 text-green-600" />
                   Secure Checkout Guaranteed
                 </div>
                 <div className="flex items-center gap-3 text-[13px] font-medium opacity-60">
                   <Info className="h-5 w-5 text-[var(--dd-surface-base)]" />
                   100% Authentic Heritage Items
                 </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {payHereParams && (
        <form ref={formRef} action="https://sandbox.payhere.lk/pay/checkout" method="POST" style={{ display: 'none' }}>
          {Object.entries(payHereParams).map(([key, val]) => (
            <input key={key} type="hidden" name={key} value={String(val)} />
          ))}
        </form>
      )}
    </BrandedLayout>
  );
}

function StepItem({ num, label, active, done }: { num: number, label: string, active: boolean, done: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-[12px] font-bold transition-all ${
        done ? 'bg-[#50623A] border-[#50623A] text-white' : 
        active ? 'border-[#50623A] text-[#50623A]' : 
        'border-[var(--dd-surface-strong)] text-[var(--dd-text-tertiary)] opacity-30'
      }`}>
        {done ? <Check className="h-4 w-4" /> : num}
      </div>
      <span className={`text-[14px] font-bold tracking-tight ${active ? 'opacity-100' : 'opacity-30'}`}>{label}</span>
    </div>
  );
}

function Input({ label, prefix, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold uppercase tracking-widest opacity-40">{label}</label>
      <div className="flex rounded-md border border-[var(--dd-surface-strong)] bg-[var(--dd-surface-muted)] focus-within:border-[var(--dd-surface-base)] transition overflow-hidden">
        {prefix && <span className="flex items-center bg-[var(--dd-surface-strong)] px-3 text-[13px] font-medium opacity-60">{prefix}</span>}
        <input {...props} className="w-full bg-transparent px-4 py-3 text-[14px] outline-none placeholder:opacity-30" />
      </div>
    </div>
  );
}

function SelectionCard({ icon: Icon, title, sub, price, selected, onClick, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 rounded-[var(--dd-radius-xs)] border-2 transition-all text-left ${
        selected ? 'border-[#50623A] bg-[#50623A]/[0.02]' : 'border-[var(--dd-surface-strong)] hover:border-[#50623A]/20'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${selected ? 'bg-[#50623A] text-white' : 'bg-[var(--dd-surface-strong)]'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold">{title}</h3>
          <p className="text-[13px] opacity-60">{sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {badge}
        {price && <span className="text-[15px] font-bold">{price}</span>}
        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#50623A]' : 'border-[var(--dd-surface-strong)]'}`}>
          {selected && <div className="h-2.5 w-2.5 rounded-full bg-[#50623A]" />}
        </div>
      </div>
    </button>
  );
}
