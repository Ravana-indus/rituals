import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { formatPriceCents } from '../types/database';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const relatedProducts = [
  {
    id: 'rel-1',
    brand: 'Augustinus Bader',
    title: 'The Rich Cream',
    priceValue: 4250000,
    originalPriceValue: 5800000,
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUztodxfQ_LpuN66Bm8gzFT_R5y1GeOBKnIuvDmrg1oEdPO6duxr_zXUeobN0NwrKmuPEPhwJSA8TYgzZXB7ClxdnN6DOkcFqhJgy3o9NxALquMET-lR6QtQbkjRlrwqbKEgvqQXgrfh4jpdsi2D6XaVNXl83akpiQKv22Hl8pHaaaMa6Dyuep384fjZ3v1ZZa5-o-rTdnQHtzfR_UuujUwbXvO77a6DH1xFsoWa5iRpiKM4hkaH0N0ggJSK7yvvpLioKvgwZG9g4W',
    badge: { label: 'Clearance', type: 'clearance' as const },
    size: '15ml',
  },
  {
    id: 'rel-2',
    brand: 'Byredo',
    title: 'Gypsy Water Eau de Parfum',
    priceValue: 6420000,
    originalPriceValue: 7500000,
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTuihDShNn5Y_kEc_WCIZsoPRDYgtTHYIqJPPqXjGQlz5NlLqvfSlctfq5vKqHkitUYuR7Y7YGLTiwFhwl684i6RCtwV5fsESb0zCT79_ewy5Q0miA7QWBzT6RBbf7ggkBM4pvprxuVn3F0Tb1t_5VXurYgqRqIbcKRooa-g_NQ9Rah2fTgFoce8IJjDQnaQKtyZj-3_wTWHAo7W2o7bqbCTK3v-LNFd2w1bBQKpfJNo8wMMyM-pfNid7fUqLY1GRt8--5pqzhRXYP',
    badge: { label: 'Bargain Find', type: 'bargain' as const },
    size: '50ml',
  },
  {
    id: 'rel-3',
    brand: 'Elemis',
    title: 'Pro-Collagen Cleansing Balm',
    priceValue: 1850000,
    originalPriceValue: 2400000,
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBokzsii9l84M_WtPD_g19fpU3PNDNnBfGx5UKMQb2MtagshJ5swYncaleUHsQ6amVmxSooSySQr5vg8YdhMACAu1jptgmBp425MftRC5XRmaigrbpB4wXTNMt8wRS-g1F7BGZ4Ir9aQFcjnRQxTQFWr8HTOSYiD0dnfV8799d4vkbL7Sfl-SlopdKuHIlrcSQG7cLDBAj_Hsn_Ogo6In9eETH807gib8XKC4RyNfjsrshBW84gFl9vqd38MDs7EXnXbsXBnExPpWuX',
    badge: { label: 'Clearance', type: 'clearance' as const },
    size: '100g',
  },
];

export default function Cart() {
  const { items, addItem, removeItem, updateQuantity, itemCount, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);

  const shipping = 450; // LKR 450 (stored in rupees)
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      setPromoSuccess(true);
      setTimeout(() => setPromoSuccess(false), 2000);
    }
  };

  // formatPrice expects value in rupees (same as price_cents storage)
  const formatPrice = (rupees: number) => {
    return 'LKR ' + rupees.toLocaleString('en-US');
  };

  return (
    <div className="bg-surface  text-on-surface font-manrope selection:bg-secondary-fixed min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-8 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Icon name="chevron_right" className="text-xs" />
          <span className="text-primary font-bold">Cart</span>
        </nav>

        <h1 className="font-noto-serif text-4xl text-on-surface mb-8">Your Ritual Collection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <Icon name="shopping_bag" className="text-6xl text-on-surface-variant/30 mx-auto" />
                <div>
                  <h2 className="font-noto-serif text-2xl mb-2">Your ritual collection is empty</h2>
                  <p className="text-on-surface-variant text-sm">Add some clearance treasures to begin your heritage journey.</p>
                </div>
                <Link to="/" className="inline-block px-8 py-4 bg-primary text-on-primary rounded-md font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all">
                  Explore Clearance
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 p-4 bg-surface-container  rounded-xl border border-outline-variant/10">
                    <div className="w-20 md:w-24 h-24 md:h-28 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.imgSrc} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-outline">{item.brand}</p>
                            <h3 className="font-noto-serif text-lg font-bold text-on-surface">{item.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {item.badge && (
                                <span className={`text-xs px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                                  item.badge.type === 'clearance' ? 'bg-red-600 text-on-surface' : 'bg-secondary text-on-secondary'
                                }`}>
                                  {item.badge.label}
                                </span>
                              )}
                              <span className="text-xs text-on-surface-variant">{item.size}</span>
                            </div>
                          </div>
                          <button onClick={() => removeItem(item.productId)} className="text-on-surface-variant hover:text-error transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2">
                            <Icon name="delete" className="text-lg" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-11 h-11 rounded-full border border-outline-variant/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                          >
                            <Icon name="remove" className="text-sm" />
                          </button>
                          <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-11 h-11 rounded-full border border-outline-variant/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                          >
                            <Icon name="add" className="text-sm" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-secondary font-black text-lg">{item.price}</p>
                          <p className="text-xs text-on-surface-variant line-through">{item.originalPrice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 bg-amber-50  border border-amber-200  rounded-xl">
              <div className="flex items-start gap-3">
                <Icon name="info" className="text-amber-600  mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-800 ">Heritage Care Note</h4>
                  <p className="text-xs text-amber-700  mt-1">
                    These clearance items are batch-limited runs. Once stock depletes, these exact formulations may not return. Store in a cool, dry place away from direct sunlight to preserve efficacy.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-primary-container text-on-primary-container rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <Icon name="verified_user" filled className="text-2xl" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider">100% Authentic Guarantee</h4>
                    <p className="text-xs opacity-80">Original batch codes on every item</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Icon name="local_shipping" filled className="text-2xl" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider">Island-wide Delivery</h4>
                    <p className="text-xs opacity-80">To your doorstep within 3-5 days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Promo or Gift Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-grow bg-surface-container border border-outline-variant/20 rounded-md py-3 px-4 text-sm focus:border-primary outline-none    dark:placeholder:text-on-surface-variant"
              />
              <button
                onClick={handleApplyPromo}
                className={`px-6 py-2 font-bold text-sm rounded-md transition-all ${
                  promoSuccess
                    ? 'bg-green-600 text-on-surface'
                    : 'bg-surface-container-highest text-on-surface hover:bg-outline-variant/20'
                }`}
              >
                {promoSuccess ? 'Code Applied!' : 'Apply'}
              </button>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-20 md:top-32 p-8 bg-surface-container  rounded-2xl space-y-6 shadow-[0_20px_40px_rgba(28,28,23,0.04)]">
              <h2 className="font-noto-serif text-2xl text-on-surface">Order Summary</h2>

              <div className="space-y-3 pt-4 border-t border-outline-variant/15">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Shipping Estimate</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between items-center text-sm text-green-600 ">
                    <span>Discount (10%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/15">
                  <span className="font-noto-serif text-xl font-bold text-on-surface">Total</span>
                  <span className="text-2xl font-bold font-noto-serif text-secondary">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full py-4 bg-primary text-on-primary rounded-md font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all text-center block"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="w-full py-3 text-center text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>

        <section className="mt-24 pt-12 border-t border-outline-variant/15">
          <div className="text-center mb-12">
            <h2 className="font-noto-serif text-3xl text-on-surface mb-2">You May Also Love</h2>
            <p className="text-on-surface-variant text-sm">Curated complementary treasures</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((product) => (
              <div key={product.id} className="group flex flex-col space-y-4">
                <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden rounded-lg">
                  <img
                    src={product.imgSrc}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className={`text-xs px-2 py-1 rounded font-black uppercase tracking-widest ${
                      product.badge.type === 'clearance' ? 'bg-red-600 text-on-surface' : 'bg-secondary text-on-secondary'
                    }`}>
                      {product.badge.label}
                    </span>
                  </div>
                  <button
                    onClick={() => addItem({ ...product, id: product.id + '-' + Date.now() })}
                    className="absolute bottom-4 right-4 bg-surface backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm hover:bg-primary hover:text-on-surface"
                  >
                    <Icon name="add_shopping_cart" className="text-primary group-hover:text-on-surface" />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-outline">{product.brand}</p>
                  <h3 className="font-noto-serif text-lg font-bold text-on-surface">{product.title}</h3>
                </div>
                <div className="flex items-center space-x-3 bg-secondary/5 p-2 rounded-md border border-secondary/10">
                  <div className="flex flex-col">
                    <span className="text-outline text-xs uppercase font-bold leading-none">Was</span>
                    <span className="text-outline text-xs line-through decoration-red-500/50">{formatPriceCents(product.originalPriceValue)}</span>
                  </div>
                  <div className="h-6 w-[1px] bg-secondary/20"></div>
                  <div className="flex flex-col">
                    <span className="text-secondary text-xs uppercase font-black leading-none">Now</span>
                    <span className="text-secondary font-black text-lg font-manrope">{formatPriceCents(product.priceValue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-surface-container border-t border-outline-variant/15 py-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="font-noto-serif italic text-xl text-on-surface">The Heritage Curator.</span>
            <p className="font-manrope text-sm tracking-wide text-on-surface-variant max-w-sm">
              Crafted with intention. Supporting artisan communities across Sri Lanka.
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
