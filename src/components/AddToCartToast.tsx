import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ToastItem {
  title: string;
  imgSrc: string;
  price: string;
}

interface AddToCartToastProps {
  item: ToastItem | null;
  visible: boolean;
  onClose: () => void;
}

const Icon = ({ name, filled = false, className = "" }: { name: string; filled?: boolean; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function AddToCartToast({ item, visible, onClose }: AddToCartToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible || !item) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right">
      <div className="bg-surface-container text-on-surface rounded-xl shadow-2xl border border-outline-variant/20 p-4 max-w-sm w-[340px] flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <Icon name="check_circle" filled className="text-lg text-green-600" />
            Added to Cart
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-0.5"
            aria-label="Close"
          >
            <Icon name="close" className="text-lg" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {item.imgSrc && (
            <img
              src={item.imgSrc}
              alt={item.title}
              className="w-14 h-14 object-cover rounded-lg bg-surface-container-high flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-noto-serif font-bold text-sm text-on-surface truncate">{item.title}</p>
            <p className="text-secondary font-bold text-sm mt-0.5">{item.price}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-bold uppercase tracking-widest border border-outline-variant/30 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Continue Shopping
          </button>
          <Link
            to="/cart"
            onClick={onClose}
            className="flex-1 py-2 text-xs font-bold uppercase tracking-widest bg-primary text-on-primary rounded-lg text-center hover:opacity-90 transition-opacity"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
