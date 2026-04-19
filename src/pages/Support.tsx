import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  LifeBuoy,
  Truck,
  RotateCcw,
  ShieldCheck,
  Mail,
  MessageSquare,
  MapPin,
  ArrowRight,
  HelpCircle,
  Package,
} from 'lucide-react';
import BrandedLayout from '../components/BrandedLayout';

export default function Support() {
  return (
    <BrandedLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--dd-surface-base)] py-20 text-white">
        <div className="absolute inset-0 opacity-10">
           {/* Abstract pattern or texture could go here */}
        </div>
        <div className="relative mx-auto max-w-[1600px] px-[var(--dd-space-4)] md:px-[var(--dd-space-6)] text-center">
          <span className="text-[12px] font-bold uppercase tracking-[0.3em] opacity-60">Concierge & Care</span>
          <h1 className="mt-4 text-[40px] font-bold leading-tight tracking-tight md:text-[64px]">
            How can we guide your ritual today?
          </h1>
          
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="relative flex items-center rounded-[var(--dd-radius-sm)] bg-white px-6 py-4 shadow-2xl">
              <Search className="h-6 w-6 text-black opacity-40" />
              <input 
                type="text" 
                placeholder="Search for apothecary guidance, order rituals..." 
                className="ml-4 w-full bg-transparent text-[18px] text-black outline-none placeholder:opacity-40 font-medium"
              />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-[13px] font-bold">
              <span className="opacity-40">SUGGESTED:</span>
              <button className="underline hover:opacity-80 transition">Shipping Times</button>
              <button className="underline hover:opacity-80 transition">Herb Sourcing</button>
              <button className="underline hover:opacity-80 transition">Return Policy</button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-[var(--dd-space-4)] py-[var(--dd-space-8)] md:px-[var(--dd-space-6)]">
        {/* Help Categories Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Main Help Block */}
          <div className="group relative overflow-hidden rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] bg-white p-10 md:col-span-8 flex flex-col justify-between transition hover:shadow-md">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[var(--dd-surface-strong)] rounded-full">
                  <LifeBuoy className="h-8 w-8 text-black" />
                </div>
                <h2 className="text-[32px] font-bold tracking-tight">Apothecary Guidance</h2>
              </div>
              <p className="max-w-md text-[16px] leading-relaxed opacity-60 mb-8">
                Expert advice on our botanical blends, ingredient sourcing, and personalized wellness consultations to honor your body's heritage.
              </p>
              <ul className="space-y-4">
                <SupportLink label="Understanding Botanical Potency" />
                <SupportLink label="Personalized Skin Rituals" />
                <SupportLink label="The Heritage Sourcing Map" />
              </ul>
            </div>
            <Package className="absolute bottom-[-20px] right-[-20px] h-64 w-64 opacity-[0.03] transition-transform group-hover:scale-110" />
          </div>

          {/* Side Blocks */}
          <div className="rounded-[var(--dd-radius-xs)] bg-black p-10 text-white md:col-span-4 flex flex-col justify-between transition hover:shadow-lg">
            <div>
              <Truck className="h-10 w-10 mb-6 opacity-60" />
              <h2 className="text-[24px] font-bold tracking-tight mb-4">Order & Delivery</h2>
              <p className="text-[14px] leading-relaxed opacity-60">
                From our hands to yours. Track your package's journey across the world.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              <Link to="/track-order" className="flex w-full items-center justify-center rounded-[var(--dd-radius-sm)] bg-white py-3 text-[14px] font-bold text-black transition hover:opacity-90">
                Track Your Order
              </Link>
              <button className="w-full text-center text-[13px] font-bold opacity-60 hover:opacity-100 transition">
                Shipping Information
              </button>
            </div>
          </div>

          <div className="rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] bg-white p-10 md:col-span-4 flex flex-col justify-between transition hover:shadow-md">
            <div>
              <ShieldCheck className="h-10 w-10 mb-6 text-green-600" />
              <h2 className="text-[24px] font-bold tracking-tight mb-4">Authentic Products</h2>
              <p className="text-[14px] leading-relaxed opacity-60">
                We guarantee 100% authenticity on all international brands in our catalog.
              </p>
            </div>
            <button className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-[var(--dd-text-secondary)] hover:underline">
              View Our Guarantee
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* FAQ Block */}
          <div className="rounded-[var(--dd-radius-xs)] border border-[var(--dd-surface-strong)] bg-white p-10 md:col-span-8 transition hover:shadow-md">
            <h2 className="text-[24px] font-bold tracking-tight mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <FAQItem label="How do I return a product?" />
              <FAQItem label="What is the shelf-life of these products?" />
              <FAQItem label="International duties and local taxes?" />
              <FAQItem label="How do I cancel my order?" />
              <FAQItem label="Do you offer wholesale discounts?" />
              <FAQItem label="Are your products authentic?" />
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold tracking-tight">Contact Our Team</h2>
            <p className="mt-2 text-[16px] opacity-60 italic">We are here to help you find your balance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ContactCard 
              icon={Mail}
              title="Send an Inquiry"
              desc="For questions regarding products or existing orders."
              action="Compose Email"
              link="/contact"
            />
            <ContactCard 
              icon={MessageSquare}
              title="Live Chat"
              desc="Connect with our team in real-time. Available 9am - 6pm SLT."
              action="Start Conversation"
              link="/consult"
              featured
            />
            <ContactCard 
              icon={MapPin}
              title="Visit Our Store"
              desc="Find your favorite personal care products at our flagship location."
              action="Find Location"
              link="#"
            />
          </div>
        </section>
      </div>
    </BrandedLayout>
  );
}

function SupportLink({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 text-[15px] font-bold opacity-80 hover:opacity-100 hover:text-[var(--dd-text-secondary)] transition cursor-pointer">
      <div className="h-1.5 w-1.5 rounded-full bg-black" />
      {label}
    </li>
  );
}

function FAQItem({ label }: { label: string }) {
  return (
    <div className="group flex items-center justify-between border-b border-[var(--dd-surface-strong)] pb-4 cursor-pointer hover:border-black transition-colors">
      <h3 className="text-[14px] font-bold opacity-80 group-hover:opacity-100">{label}</h3>
      <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-100" />
    </div>
  );
}

function ContactCard({ icon: Icon, title, desc, action, link, featured }: any) {
  return (
    <div className={`flex flex-col items-center text-center p-10 rounded-[var(--dd-radius-xs)] border transition shadow-sm hover:shadow-md ${
      featured ? 'border-black bg-white ring-1 ring-black' : 'border-[var(--dd-surface-strong)] bg-white'
    }`}>
      <div className={`p-4 rounded-full mb-6 ${featured ? 'bg-black text-white' : 'bg-[var(--dd-surface-strong)]'}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-[20px] font-bold tracking-tight mb-3">{title}</h3>
      <p className="text-[14px] opacity-60 leading-relaxed mb-8">{desc}</p>
      <Link 
        to={link}
        className={`mt-auto w-full py-4 rounded-[var(--dd-radius-sm)] text-[13px] font-bold uppercase tracking-widest transition ${
          featured ? 'bg-black text-white hover:opacity-90' : 'border border-black hover:bg-black hover:text-white'
        }`}
      >
        {action}
      </Link>
      {featured && <span className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#76885B]">Active Now</span>}
    </div>
  );
}

