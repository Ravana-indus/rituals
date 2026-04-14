import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Icon = ({ name, filled = false, className = "" }: { name: string, filled?: boolean, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

export default function Support() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-secondary-fixed min-h-screen flex flex-col relative">
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.03]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqe1wcZJKuTGsNvvSewiOjDImllPfigsQ3VpquGkn1bNnte7BSXpfulK-emw8H5UYRFXnJ4XOo9lJq9767-ChNfk79uj_1d4BpznrFV2u6z9UdvJfSozdKyb1IsUZpUUM7OBKSPvUnskNafL2a6fvBnZqQiDXhXvQRNOy3kK0sPdy6eciY1DAJDTNXY59uvACjP5Wi4qMTQ9Ijw0P_vLaznIlywx_cMwH_7psutibAPCcvHZ4h0ni-0imZiScL2wzALPOey3QMwNys')" }}></div>
      
      <Header />

      <main className="pt-8 flex-grow w-full">
        {/* Hero Search Section */}
        <section className="relative py-24 px-8 flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl w-full relative z-10">
            <span className="font-manrope text-secondary uppercase tracking-[0.3em] text-xs mb-4 block">Concierge & Care</span>
            <h1 className="font-noto-serif text-5xl md:text-6xl text-primary mb-8 leading-tight">How may we guide your ritual today?</h1>
            <div className="relative group">
              <input className="w-full bg-surface-container-lowest border-none py-6 px-8 pl-16 rounded-xl shadow-[0_10px_30px_rgba(28,28,23,0.04)] focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 font-body italic text-lg" placeholder="Search for apothecary guidance, order rituals..." type="text" />
              <Icon name="search" className="absolute left-6 top-1/2 -translate-y-1/2 text-primary text-2xl" />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="text-on-surface-variant text-sm font-manrope uppercase tracking-wider">Suggested:</span>
              <button className="text-xs font-manrope uppercase tracking-widest text-primary hover:underline underline-offset-4">Shipping Times</button>
              <button className="text-xs font-manrope uppercase tracking-widest text-primary hover:underline underline-offset-4">Herb Sourcing</button>
              <button className="text-xs font-manrope uppercase tracking-widest text-primary hover:underline underline-offset-4">Return Policy</button>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary-container/20 via-surface to-surface z-0 pointer-events-none"></div>
        </section>

        {/* Help Categories Bento Grid */}
        <section className="max-w-7xl mx-auto px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Apothecary Guidance */}
            <div className="md:col-span-8 group relative overflow-hidden bg-surface-container-low rounded-xl p-10 flex flex-col justify-between min-h-[250px] md:min-h-[400px] transition-all hover:bg-surface-container">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <Icon name="medical_services" filled className="text-4xl text-primary-container" />
                  <h2 className="font-noto-serif text-3xl text-primary">Apothecary Guidance</h2>
                </div>
                <p className="text-on-surface-variant leading-relaxed max-w-md mb-8">Expert advice on our botanical blends, ingredient sourcing, and personalized wellness consultations to honor your body's heritage.</p>
                <ul className="space-y-4 font-manrope text-sm tracking-wide text-on-surface">
                  <li className="flex items-center gap-3 group/item cursor-pointer">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span className="group-hover/item:text-secondary transition-colors">Understanding Botanical Potency</span>
                  </li>
                  <li className="flex items-center gap-3 group/item cursor-pointer">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span className="group-hover/item:text-secondary transition-colors">Personalized Skin Rituals</span>
                  </li>
                  <li className="flex items-center gap-3 group/item cursor-pointer">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span className="group-hover/item:text-secondary transition-colors">The Heritage Sourcing Map</span>
                  </li>
                </ul>
              </div>
              <img className="absolute right-[-10%] bottom-[-5%] w-1/2 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none grayscale" alt="Close-up of dried organic herbs" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZkTFo2mNJoBdA-wgpB2MZ-HZAuUDlUmunGNlg6Pi8wDsQgcQYnPgD6ZrcheQUAksqxJFeUVu6jSzbsqq3vcDI-pYPjK3hqVsxr9UsbAeiByjp8SPbomq3PCzAqHEXth6sxQdp6YIpDQegxIlODjUIGqsVGAhRI91Rh_yxK3V_O9nLOykvQV3-0FUojCGi8OirR5sqsmK3xUdQPCBluY-ZHTxXVG1-oEkCjE-mWOGE0Es2e2a_UODdtYKlkzu9heZuZOknNCB41SYR" />
            </div>

            {/* Order & Delivery Rituals */}
            <div className="md:col-span-4 bg-primary text-on-primary rounded-xl p-10 flex flex-col justify-between transition-all hover:translate-y-[-4px]">
              <div>
                <Icon name="local_shipping" filled className="text-4xl mb-6 text-on-primary-container" />
                <h2 className="font-noto-serif text-2xl mb-4">Order & Delivery Rituals</h2>
                <p className="text-on-primary-container/80 text-sm leading-relaxed mb-6">From our hands to yours. Track your package's journey across the world.</p>
              </div>
              <div className="space-y-4">
                <Link to="/track-order" className="block w-full text-center py-4 rounded-lg bg-surface/10 hover:bg-surface/20 transition-all font-manrope text-xs uppercase tracking-widest border border-on-primary-container/20">Track Your Order</Link>
                <Link to="/support" className="block w-full text-center py-4 rounded-lg font-manrope text-xs uppercase tracking-widest text-on-primary-container hover:text-on-primary">Shipping Information</Link>
              </div>
            </div>

            {/* Authenticity & Heritage */}
            <div className="md:col-span-4 bg-tertiary-container text-on-tertiary rounded-xl p-10 flex flex-col gap-6 relative overflow-hidden group">
              <h2 className="font-noto-serif text-2xl relative z-10">Authenticity & Heritage</h2>
              <p className="text-on-tertiary-container/90 text-sm leading-relaxed relative z-10">Verification of our traditional Sri Lankan formulations and ethical trade certifications.</p>
              <div className="relative z-10 mt-auto">
                <span className="inline-flex items-center gap-2 font-manrope text-xs uppercase tracking-widest border-b border-on-tertiary-container pb-1 cursor-pointer">View Certifications</span>
              </div>
              {/* Custom Stamp Badge */}
              <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full border-4 border-dashed border-on-tertiary-container/30 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                <span className="font-noto-serif italic text-on-tertiary-container/30 text-center text-xs">CERTIFIED<br/>HERITAGE</span>
              </div>
            </div>

            {/* Common Questions */}
            <div className="md:col-span-8 bg-surface-container-highest rounded-xl p-10">
              <h2 className="font-noto-serif text-2xl text-primary mb-8">Frequently Consulted</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="border-b border-outline-variant/30 pb-4 group cursor-pointer">
                  <h3 className="font-manrope text-sm font-semibold text-on-surface group-hover:text-secondary transition-colors">How do I return a fragile botanical vessel?</h3>
                </div>
                <div className="border-b border-outline-variant/30 pb-4 group cursor-pointer">
                  <h3 className="font-manrope text-sm font-semibold text-on-surface group-hover:text-secondary transition-colors">What is the shelf-life of fresh blends?</h3>
                </div>
                <div className="border-b border-outline-variant/30 pb-4 group cursor-pointer">
                  <h3 className="font-manrope text-sm font-semibold text-on-surface group-hover:text-secondary transition-colors">International duties and local taxes?</h3>
                </div>
                <div className="border-b border-outline-variant/30 pb-4 group cursor-pointer">
                  <h3 className="font-manrope text-sm font-semibold text-on-surface group-hover:text-secondary transition-colors">Canceling a subscription ritual?</h3>
                </div>
                <div className="border-b border-outline-variant/30 pb-4 group cursor-pointer">
                  <h3 className="font-manrope text-sm font-semibold text-on-surface group-hover:text-secondary transition-colors">Wholesale inquiries for boutique hotels?</h3>
                </div>
                <div className="border-b border-outline-variant/30 pb-4 group cursor-pointer">
                  <h3 className="font-manrope text-sm font-semibold text-on-surface group-hover:text-secondary transition-colors">Sourcing transparency reports?</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="bg-surface-container-low py-24 px-8 mt-16 relative z-10">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h2 className="font-noto-serif text-4xl text-primary mb-4">The Concierge Desk</h2>
            <p className="text-on-surface-variant italic font-noto-serif">A personal touch for your heritage journey.</p>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Option 1 */}
            <div className="bg-surface p-10 rounded-xl shadow-[0_20px_40px_rgba(28,28,23,0.04)] text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-6 text-primary">
                <Icon name="mail" className="text-3xl" />
              </div>
              <h3 className="font-noto-serif text-xl mb-3">Send an Inquiry</h3>
              <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">For detailed questions regarding formulations or existing orders.</p>
              <Link to="/contact" className="mt-auto w-full py-4 bg-gradient-to-br from-[#003a3a] to-[#1c5151] text-on-primary rounded-lg font-manrope text-xs uppercase tracking-widest">Compose Email</Link>
            </div>
            {/* Option 2 */}
            <div className="bg-surface p-10 rounded-xl shadow-[0_20px_40px_rgba(28,28,23,0.04)] text-center flex flex-col items-center border-t-4 border-secondary">
              <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center mb-6 text-secondary">
                <Icon name="chat_bubble" className="text-3xl" />
              </div>
              <h3 className="font-noto-serif text-xl mb-3">Live Concierge Chat</h3>
              <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">Connect with our consultants in real-time. Available 9am - 6pm SLT.</p>
              <Link to="/consult" className="mt-auto w-full py-4 bg-secondary text-on-secondary rounded-lg font-manrope text-xs uppercase tracking-widest">Start Conversation</Link>
              <span className="mt-4 text-xs uppercase tracking-widest text-secondary font-bold">Active Now</span>
            </div>
            {/* Option 3 */}
            <div className="bg-surface p-10 rounded-xl shadow-[0_20px_40px_rgba(28,28,23,0.04)] text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-6 text-primary">
                <Icon name="location_on" className="text-3xl" />
              </div>
              <h3 className="font-noto-serif text-xl mb-3">Visit Our Apothecary</h3>
              <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">Experience our scents and textures in our flagship Colombo flagship.</p>
              <button className="mt-auto w-full py-4 border border-outline-variant text-primary rounded-lg font-manrope text-xs uppercase tracking-widest hover:bg-surface-container transition-colors">Find Location</button>
            </div>
          </div>
        </section>

        {/* Newsletter / Trust Section */}
        <section className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="relative">
            <div className="aspect-[4/5] bg-surface-container-low rounded-xl overflow-hidden">
              <img className="w-full h-full object-cover mix-blend-multiply opacity-80" alt="Artistic composition of a vintage brass scale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs6DkXEf3r77qKbOojGQp2qWYOdUAvI0k_18zdoTf128PuGzzQIjHvUvJasOJqQKE-VDPQWX39QbfpNLa-4EnLeNtmW-EOgD0_SNKfP7nLLLP79p4CnoLG4Zs7k6dcv39eAobyRNu3Wq95pEeP7bwMR2fkHDnzhEaimTPn3faY2QEkXu861xgj-L5gmLIzFyiyHWyviKoMp4Q83RQTrqzhAKkq-4FMVFmcctwOxDNHcqMbUaukqPTMRKi1BvAu3z8h1THgZUYmP_Ux" />
            </div>
            <div className="absolute -bottom-8 -right-8 p-8 bg-surface-bright shadow-xl rounded-lg max-w-xs">
              <p className="font-noto-serif italic text-primary text-lg">"Preserving the integrity of the ritual is our first priority."</p>
              <p className="font-manrope text-xs uppercase tracking-[0.2em] text-secondary mt-4">— The Chief Curator</p>
            </div>
          </div>
          <div>
            <h2 className="font-noto-serif text-4xl text-primary mb-6">Heritage Chronicles</h2>
            <p className="text-on-surface-variant leading-relaxed mb-8">Join our inner circle for ancestral beauty wisdom, early access to rare harvests, and invitations to our private curator events.</p>
            <form className="flex flex-col gap-4">
              <input className="bg-surface-container-low border-none border-b border-primary p-4 focus:ring-0 placeholder:text-outline/40" placeholder="Your email address" type="email" />
              <button className="bg-gradient-to-br from-[#003a3a] to-[#1c5151] text-on-primary py-4 px-8 font-manrope text-xs uppercase tracking-widest w-fit">Join the Circle</button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/15 bg-surface-container  relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8 max-w-screen-2xl mx-auto">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="font-noto-serif text-lg font-bold text-primary">The Heritage Curator</div>
            <p className="font-manrope text-sm uppercase tracking-widest text-on-surface/60 ">© 2024 The Heritage Curator. Crafted with Intent.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/support" className="font-manrope text-sm uppercase tracking-widest text-on-surface/60  hover:text-primary transition-colors duration-300">Privacy Policy</Link>
            <Link to="/support" className="font-manrope text-sm uppercase tracking-widest text-on-surface/60  hover:text-primary transition-colors duration-300">Terms of Service</Link>
            <Link to="/support" className="font-manrope text-sm uppercase tracking-widest text-on-surface/60  hover:text-primary transition-colors duration-300">Shipping & Returns</Link>
            <Link to="/support" className="font-manrope text-sm uppercase tracking-widest text-on-surface/60  hover:text-primary transition-colors duration-300">Wholesale</Link>
            <Link to="/contact" className="font-manrope text-sm uppercase tracking-widest text-on-surface/60  hover:text-primary transition-colors duration-300">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
