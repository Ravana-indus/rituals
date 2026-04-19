import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Info,
  ShieldCheck,
  Truck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import BrandedLayout from '../components/BrandedLayout';
import BrandedProductCard from '../components/BrandedProductCard';
import { useCart } from '../context/CartContext';
import { formatPriceCents } from '../types/database';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);

  const shipping = items.length > 0 ? 45000 : 0; // LKR 450.00 (in cents)
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      setPromoSuccess(true);
      setTimeout(() => setPromoSuccess(false), 2000);
    }
  };

  return (
    <BrandedLayout>
      <div className="px-[var(--dd-space-4)] py-[var(--dd-space-4)] md:px-[var(--dd-space-6)]">
        {/* Breadcrumbs */}
        <nav className="mb-[var(--dd-space-6)] flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest opacity-40">
          <Link to="/" className="hover:opacity-100 transition">Apothecary</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="opacity-100">Your Cart</span>
        </nav>

        <h1 className="text-[32px] font-bold leading-tight tracking-tight lg:text-[48px] mb-8">
          Your Cart ({items.length})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Items Column */}
          <div className="lg:col-span-8 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] text-center">
                <ShoppingBag className="h-16 w-16 opacity-10 mb-6" />
                <h2 className="text-[24px] font-bold">Your cart is empty</h2>
                <p className="mt-2 opacity-60 max-w-sm px-4">Add some rituals to your bag to begin your heritage journey.</p>
                <Link 
                  to="/" 
                  className="mt-8 rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] px-8 py-3 font-bold text-white shadow-lg transition hover:opacity-90"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 p-4 bg-white rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] transition hover:shadow-sm">
                    <div className="w-24 h-30 bg-[#f8f9fa] rounded-sm overflow-hidden flex-shrink-0 border border-[var(--dd-surface-strong)]">
                      <img src={item.imgSrc} alt={item.title} className="w-full h-full object-contain mix-blend-multiply p-2" />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold uppercase tracking-wider opacity-40">{item.brand}</p>
                          <Link to={`/product?slug=${item.id}`} className="hover:underline">
                            <h3 className="text-[16px] font-bold leading-tight">{item.title}</h3>
                          </Link>
                          {item.size && <p className="text-[13px] opacity-60">{item.size}</p>}
                        </div>
                        <button 
                          onClick={() => removeItem(item.productId)}
                          className="p-2 rounded-full hover:bg-red-50 text-[#9ca3af] hover:text-[#AF8F6F] transition"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center rounded-full border border-[var(--dd-surface-strong)] p-1 bg-[var(--dd-surface-muted)]">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white transition active:scale-90"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-[14px] font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white transition active:scale-90"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-[16px] font-bold">{item.price}</p>
                          {item.originalPrice && <p className="text-[13px] opacity-30 line-through font-medium">{item.originalPrice}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Delivery Promise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] flex items-start gap-4">
                <div className="p-2 bg-[var(--dd-surface-strong)] rounded-full text-[var(--dd-surface-base)]">
                   <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px]">100% Authentic</h4>
                  <p className="text-[13px] opacity-60 mt-1">Direct from global sources. Original batch codes guaranteed.</p>
                </div>
              </div>
              <div className="p-5 bg-white rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] flex items-start gap-4">
                <div className="p-2 bg-[var(--dd-surface-strong)] rounded-full text-[var(--dd-surface-base)]">
                   <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px]">Fast Dispatch</h4>
                  <p className="text-[13px] opacity-60 mt-1">Orders processed within 24h. Secure island-wide delivery.</p>
                </div>
              </div>
            </div>

            {/* Note Section */}
            <div className="p-5 rounded-[var(--dd-radius-xs)] bg-[#AF8F6F]/5 border border-[#AF8F6F]/10 flex items-start gap-4">
              <Info className="h-5 w-5 text-[#AF8F6F] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-[14px] text-[#8D6F56]">Limited Availability Note</h4>
                <p className="text-[13px] text-[#8D6F56] opacity-80 mt-1">
                  These items are managed in small-batch clearance runs. Items in your cart are not reserved until checkout is complete.
                </p>
              </div>
            </div>
          </div>

          {/* Summary Column */}
          {items.length > 0 && (
            <aside className="lg:col-span-4">
            <div className="sticky top-[100px] space-y-6">
              <div className="p-8 bg-white rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] shadow-sm">
                <h2 className="text-[20px] font-bold tracking-tight mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-[15px]">
                    <span className="opacity-60">Subtotal</span>
                    <span className="font-bold">{formatPriceCents(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[15px]">
                    <span className="opacity-60">Shipping</span>
                    <span className="font-bold">{formatPriceCents(shipping)}</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between text-[15px] text-green-600">
                      <span>Promo Discount (10%)</span>
                      <span className="font-bold">-{formatPriceCents(discount)}</span>
                    </div>
                  )}

                  <div className="pt-6 border-t border-[var(--dd-surface-strong)] flex justify-between items-center">
                    <span className="text-[18px] font-bold">Total</span>
                    <span className="text-[24px] font-bold">{formatPriceCents(total)}</span>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Link
                    to="/checkout"
                    className="w-full flex items-center justify-center gap-2 rounded-[var(--dd-radius-sm)] bg-[var(--dd-surface-base)] py-4 text-[16px] font-bold text-white shadow-lg transition hover:opacity-95 active:scale-[0.98]"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/"
                    className="w-full flex items-center justify-center py-3 text-[14px] font-bold opacity-60 hover:opacity-100 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Promo Input */}
                <div className="mt-8 pt-8 border-t border-[var(--dd-surface-strong)]">
                  <p className="text-[12px] font-bold uppercase tracking-widest opacity-40 mb-3">Promo Code</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-grow bg-[var(--dd-surface-muted)] border border-[var(--dd-surface-strong)] rounded-md px-4 py-2.5 text-[14px] focus:border-[var(--dd-surface-base)] outline-none transition"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim()}
                      className={`px-6 py-2.5 font-bold text-[14px] rounded-md transition-all ${
                        promoSuccess
                          ? 'bg-green-600 text-white'
                          : 'bg-[var(--dd-surface-strong)] text-[var(--dd-text-tertiary)] hover:bg-[var(--dd-surface-base)] hover:text-white disabled:opacity-50'
                      }`}
                    >
                      {promoSuccess ? 'Applied!' : 'Apply'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Secure Payment Note */}
              <div className="flex items-center justify-center gap-4 py-4 px-8 border border-[var(--dd-surface-strong)] rounded-[var(--dd-radius-xs)] bg-[var(--dd-surface-muted)]">
                 <img src="https://www.payhere.lk/images/logo.png" alt="PayHere" className="h-5 opacity-40 grayscale hover:grayscale-0 transition cursor-help" />
                 <span className="text-[11px] font-bold uppercase tracking-widest opacity-40">Secure Payments</span>
              </div>
            </div>
            </aside>
            )}
            </div>      </div>
    </BrandedLayout>
  );
}

