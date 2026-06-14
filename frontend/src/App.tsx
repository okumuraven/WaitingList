import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, 
  Loader2, Flame, Star, Target, Zap, Building2, 
  Wallet, ChefHat, Crown, Globe, Store, Bike, BadgeCheck, 
  LayoutDashboard, ShoppingCart, UserCog, Key, 
  MessageCircle, Mail, ExternalLink 
} from 'lucide-react';
import TractionDashboard from './TractionDashboard';

// --- Custom Icons ---
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

// --- Constants ---
const USER_ROLES = [
  { id: 'Buyer', label: 'Buyer', icon: ShoppingCart, desc: 'I want to shop from elite student stores.' },
  { id: 'Seller', label: 'Seller', icon: Store, desc: 'I want to build my professional campus hustle.' },
  { id: 'Courier', label: 'Courier', icon: Bike, desc: 'I want to bid on and deliver student orders.' },
  { id: 'Hotel Owner', label: 'Hotel Owner', icon: ChefHat, desc: 'I own a hostel/hotel for student stays.' },
  { id: 'Rental Owner', label: 'Rental Owner', icon: Key, desc: 'I have verified student rentals available.' },
  { id: 'Admin', label: 'Regional Admin', icon: UserCog, desc: 'I want to moderate and lead my campus.' },
];

const SOCIAL_LINKS = [
  { id: 'facebook', icon: FacebookIcon, url: 'https://www.facebook.com/profile.php?id=61590715984640', label: 'Facebook' },
  { id: 'tiktok', icon: TikTokIcon, url: 'https://www.tiktok.com/@comrademarketkeny?_r=1&_t=ZS-97DBpiVnsKf', label: 'TikTok' },
  { id: 'x', icon: XIcon, url: 'https://x.com/comrademarketke', label: 'X' },
  { id: 'instagram', icon: InstagramIcon, url: 'https://www.instagram.com/comrademarketkenya?igsh=cmM0b2hqbndqdGVv', label: 'Instagram' },
];

// --- Sub-Components ---
const WaitingListForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setStep(2);
  };

  const handleFinalSubmit = async (selectedRole: string) => {
    setUserType(selectedRole);
    setStatus('loading');
    
    try {
      const response = await fetch('http://localhost:5000/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType: selectedRole }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Unable to connect to server.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-red/10 border border-brand-red/30 p-10 sm:p-16 rounded-[3rem] text-center backdrop-blur-md shadow-2xl"
          >
            <CheckCircle2 className="w-20 h-20 text-brand-red mx-auto mb-6" />
            <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 uppercase tracking-tight text-center text-wrap">You're on the Frontline!</h3>
            <p className="text-lg text-slate-300 mb-8 max-w-md mx-auto text-center">{message}</p>
            <button 
              onClick={() => { setStatus('idle'); setStep(1); setEmail(''); }}
              className="px-8 py-4 bg-brand-red text-white font-black rounded-2xl uppercase tracking-widest hover:scale-105 transition-transform mx-auto block"
            >
              Add Another Comrade
            </button>
          </motion.div>
        ) : step === 1 ? (
          <motion.form
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleEmailSubmit}
            className="relative max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4 p-3 bg-brand-dark/50 border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl group-focus-within:border-brand-red/40 transition-all">
              <input
                type="email"
                required
                placeholder="Your University Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-8 py-5 bg-transparent text-white placeholder:text-slate-500 outline-none text-xl font-medium"
              />
              <button
                type="submit"
                className="px-10 py-5 bg-brand-red hover:bg-red-500 text-white font-black rounded-[2rem] shadow-xl shadow-brand-red/30 transition-all flex items-center justify-center gap-3 group uppercase tracking-tighter text-lg"
              >
                Next Step
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            {status === 'error' && <p className="mt-4 text-brand-red font-bold text-center">{message}</p>}
          </motion.form>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center"
          >
            <div className="mb-10 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-4">Final Step</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic text-center">Define Your <span className="text-brand-red">Impact.</span></h2>
              <p className="text-slate-400 mt-2 text-lg text-center">How will you participate in the student economy?</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {USER_ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleFinalSubmit(role.id)}
                  disabled={status === 'loading'}
                  className="flex flex-col items-start p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-brand-red/40 hover:bg-white/[0.08] transition-all group relative overflow-hidden"
                >
                  <div className="w-12 h-12 bg-brand-dark border border-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-red group-hover:border-brand-red transition-all">
                    <role.icon className="w-6 h-6 text-brand-red group-hover:text-white" />
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-brand-red transition-colors">{role.label}</h4>
                  <p className="text-slate-400 text-sm mt-1 leading-snug">{role.desc}</p>
                  
                  {status === 'loading' && userType === role.id && (
                    <div className="absolute inset-0 bg-brand-black/60 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setStep(1)}
              className="mt-10 text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors block mx-auto"
            >
              Go Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ManifestoPoint = ({ icon: Icon, title, highlight, description, delay }: { icon: any, title: string, highlight: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="flex flex-col sm:flex-row gap-6 sm:gap-8 group text-left bg-white/5 p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-white/5 hover:border-brand-red/20 hover:bg-white/[0.07] transition-all"
  >
    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-brand-dark border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-brand-red/10 group-hover:border-brand-red/30 transition-all">
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-brand-red" />
    </div>
    <div className="flex flex-col gap-2">
      <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tighter leading-tight text-left">
        {title} <span className="text-brand-red">{highlight}</span>
      </h3>
      <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-medium text-left">
        {description}
      </p>
    </div>
  </motion.div>
);

// --- Pages ---
const Landing = () => (
  <div className="min-h-screen bg-brand-black text-white selection:bg-brand-red selection:text-white">
    {/* Background Decor */}
    <div className="fixed inset-0 -z-10">
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-brand-red/10 rounded-full blur-[100px] sm:blur-[150px] opacity-40" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-brand-red/5 rounded-full blur-[80px] sm:blur-[120px] opacity-20" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
    </div>

    {/* Navigation */}
    <nav className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 py-8 sm:py-12 px-6 mb-12 sm:mb-24 text-left">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red flex items-center justify-center rounded-lg sm:rounded-xl shadow-lg shadow-brand-red/20">
          <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none text-white">Comrade<span className="text-brand-red">Market</span></span>
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-left">The Student Standard</span>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-brand-dark/50 border border-white/5 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-md">
        <div className="flex -space-x-2 sm:-space-x-3 mr-2 sm:mr-4">
          {[
            "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&q=80",
            "https://images.unsplash.com/photo-1523450001312-faa4e2e31f0f?w=100&h=100&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=100&h=100&fit=crop&q=80"
          ].map((url, i) => (
            <img key={i} src={url} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-brand-black object-cover" alt="avatar" />
          ))}
        </div>
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-300">Join 5k+ Comrades</span>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="relative pb-24 sm:pb-32 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-brand-red/10 border border-brand-red/20 mx-auto"
        >
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-brand-red fill-brand-red" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-brand-red">Own Your Hustle</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-7xl md:text-9xl font-black mb-8 sm:mb-10 leading-[0.9] uppercase tracking-tighter italic text-center text-white"
        >
          The Student <br /> <span className="text-brand-red not-italic text-center">Economy.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl md:text-3xl text-slate-400 mb-12 sm:mb-16 max-w-4xl mx-auto font-medium leading-relaxed sm:leading-tight text-center"
        >
          A full-stack ecosystem for <span className="text-white italic">Commerce</span>, <span className="text-white italic">Logistics</span>, <span className="text-white italic">Hospitality</span>, and <span className="text-white italic">Leadership</span>. <br className="hidden sm:block" />
          <span className="text-white">Stop struggling with unreliable platforms. Join the new student standard.</span>
        </motion.p>

        <WaitingListForm />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 sm:mt-20 flex flex-wrap justify-center gap-8 sm:gap-12"
        >
          <div className="flex items-center gap-2 sm:gap-3 text-left">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" />
            <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-500 text-left">Zero-Fraud Escrow</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-left">
            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" />
            <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-500 text-left">Regional Governance</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-left">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" />
            <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-500 text-left">M-Pesa Integrated</span>
          </div>
        </motion.div>
      </div>
    </section>

    {/* The Manifesto Section - THE CORE DEPTH */}
    <section className="py-24 sm:py-40 px-6 bg-brand-dark/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-red/5 skew-x-12 translate-x-32" />
      <div className="max-w-7xl mx-auto relative z-10 text-left">
        <div className="flex flex-col gap-3 mb-16 sm:mb-24 text-left">
          <span className="text-brand-red text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] text-left">The Architecture</span>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-tight text-left text-white">Why it's a <br className="sm:hidden" /> <span className="text-brand-red not-italic">Revolution.</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <ManifestoPoint 
            icon={Store}
            title="Elite"
            highlight="Student Stores"
            description="Open your professional digital storefront. Build a reputation score, earn 'Elite Comrade' status, and manage your hustle with a pro dashboard."
            delay={0.1}
          />
          <ManifestoPoint 
            icon={Bike}
            title="Uber-Style"
            highlight="Bidding Delivery"
            description="Post a delivery and let verified comrades bid. Includes real-time tracking, dynamic surge pricing, and automated distance calculation."
            delay={0.2}
          />
          <ManifestoPoint 
            icon={Building2}
            title="Campus"
            highlight="Stays & Rentals"
            description="Book verified student hostels and 'Comrade Stays' across Kenya. Verified by Regional Admins to ensure safety and quality."
            delay={0.3}
          />
          <ManifestoPoint 
            icon={Wallet}
            title="The Escrow"
            highlight="Guarantee"
            description="We hold your cash in secure escrow until you confirm delivery. If the item isn't right, you get your money back. No stories."
            delay={0.4}
          />
          <ManifestoPoint 
            icon={Target}
            title="Regional"
            highlight="Governance"
            description="Apply to be a Regional Admin. Moderate your campus, verify sellers, and lead the movement. Built for student leadership."
            delay={0.5}
          />
          <ManifestoPoint 
            icon={ChefHat}
            title="Hospitality"
            highlight="Luxe"
            description="From local Kibandaskis to Premium Student Joints. Order food, book tables, or secure event spaces with student-verified discounts."
            delay={0.6}
          />
        </div>
      </div>
    </section>

    {/* Leadership Section */}
    <section className="py-24 sm:py-40 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-auto lg:aspect-square bg-gradient-to-br from-brand-red/20 to-transparent border border-white/5 rounded-3xl sm:rounded-[4rem] p-8 sm:p-12 flex flex-col justify-end gap-6 sm:gap-8 relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute inset-0 bg-brand-red opacity-10 blur-3xl group-hover:opacity-20 transition-all" />
              <Crown className="w-16 h-16 sm:w-24 sm:h-24 text-brand-red mb-12 lg:mb-auto" />
              <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none italic text-left text-white">
                Run your <span className="text-brand-red">Region.</span>
              </h3>
              <p className="text-slate-400 text-lg sm:text-xl font-medium text-left">
                We're looking for the first 50 Regional Admins to lead the student economy in their campus. Manage, Moderate, Lead.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-4 border-t border-white/5">
                <span className="px-3 sm:px-4 py-2 bg-brand-red text-white text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-lg text-center">Leadership Hub</span>
                <span className="px-3 sm:px-4 py-2 bg-brand-dark text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-lg text-center">Governed by Comrades</span>
              </div>
            </motion.div>
          </div>
          
          <div className="flex flex-col gap-8 sm:gap-12 text-left order-1 lg:order-2">
            <div className="flex flex-col gap-3 sm:gap-4 text-left">
              <span className="text-brand-red text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] text-left">The Opportunity</span>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-tight text-left text-white">Build your <br className="sm:hidden" /> <span className="text-brand-red not-italic text-left">Legacy.</span></h2>
            </div>
            <p className="text-slate-400 text-lg sm:text-xl font-medium leading-relaxed text-left">
              Whether you're a seller building an empire, a courier powering the campus, or a leader managing a region, ComradeMarket is your platform to grow.
            </p>
            <ul className="flex flex-col gap-4 sm:gap-6 text-left">
              {[
                { icon: BadgeCheck, text: "Verified Student Network" },
                { icon: LayoutDashboard, text: "Professional Seller Dashboards" },
                { icon: Globe, text: "Nationwide Growth Potential" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 sm:gap-4 text-white font-bold uppercase tracking-widest text-[10px] sm:text-sm text-left">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* The Hustle CTA */}
    <section className="py-24 sm:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto bg-brand-red rounded-[3rem] sm:rounded-[5rem] p-10 sm:p-20 md:p-32 text-center relative overflow-hidden shadow-2xl shadow-brand-red/50 mx-auto block">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        <div className="relative z-10 text-center">
          <h2 className="text-3xl sm:text-6xl md:text-9xl font-black text-white uppercase tracking-tighter mb-8 sm:mb-12 leading-[1] italic text-shadow-xl text-center">
            Don't just join. <br /> Lead the movement.
          </h2>
          <p className="text-white/80 text-lg sm:text-2xl md:text-4xl mb-12 sm:mb-20 max-w-2xl mx-auto font-black italic tracking-tight leading-snug text-center text-wrap">
            Secure your handle, apply for Admin roles, <br className="hidden sm:block" />
            <span className="text-white underline decoration-white/30 underline-offset-4 sm:underline-offset-8">and join the student elite.</span>
          </p>
          <WaitingListForm />
        </div>
      </div>
    </section>

    {/* Brand Footer */}
    <footer className="py-24 px-6 border-t border-white/5 bg-brand-black relative overflow-hidden text-left">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-brand-red/5 blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24 text-left">
          {/* Left Side: Brand & Founder */}
          <div className="flex flex-col gap-10 text-left">
            <div className="flex flex-col gap-6 text-left">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20 text-left">
                  <Flame className="w-8 h-8 text-white fill-white" />
                </div>
                <span className="text-3xl font-black uppercase tracking-tighter italic text-left text-white">Comrade<span className="text-brand-red">Market</span></span>
              </div>
              <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed text-left">
                The Student Standard. Built in Nairobi, governed by Comrades. Scaling the student economy across Kenya.
              </p>
              <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-red">Project Hub</span>
                 <a href="mailto:comrademarketkenya@gmail.com" className="flex items-center gap-2 text-white hover:text-brand-red transition-colors font-bold text-sm">
                    <Mail className="w-4 h-4" />
                    comrademarketkenya@gmail.com
                 </a>
              </div>
            </div>

            {/* Founder Card */}
            <div className="relative group max-w-sm text-left">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red to-red-900 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex items-center gap-6 bg-brand-dark/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 text-left">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-red/30 p-1 bg-brand-black flex-shrink-0 text-left">
                  <img 
                    src="/founder-logo.jpeg" 
                    alt="Okumu Joseph" 
                    className="w-full h-full object-cover rounded-xl transition-all"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-1 text-left">Founder & CEO</span>
                  <h4 className="text-xl font-black uppercase tracking-tight text-white text-left">Okumu Joseph</h4>
                  <a href="https://okumuraven.me" target="_blank" rel="noopener noreferrer" className="text-slate-500 text-xs font-bold flex items-center gap-1 hover:text-white transition-colors text-left">
                    @okumuraven <ExternalLink className="w-3 h-3 text-left" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact & Socials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-8 w-full text-left">
            <div className="flex flex-col gap-8 text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-red text-left">Founder Direct</span>
              <div className="flex flex-col gap-6 text-left">
                <a href="https://wa.me/254794534817" className="flex items-center gap-4 group text-left">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-brand-red/10 group-hover:border-brand-red/30 transition-all text-left">
                    <MessageCircle className="w-5 h-5 text-slate-400 group-hover:text-brand-red text-left" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-left">WhatsApp</span>
                    <span className="text-sm font-bold text-white group-hover:text-brand-red transition-colors text-left">+254 794 534 817</span>
                  </div>
                </a>
                <a href="mailto:okumuraven@gmail.com" className="flex items-center gap-4 group text-left">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-brand-red/10 group-hover:border-brand-red/30 transition-all text-left">
                    <Mail className="w-5 h-5 text-slate-400 group-hover:text-brand-red text-left" />
                  </div>
                  <div className="flex flex-col text-left text-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-left">Personal Email</span>
                    <span className="text-sm font-bold text-white group-hover:text-brand-red transition-colors text-left text-wrap break-all">okumuraven@gmail.com</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-8 text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-red text-left">Social Presence</span>
              <div className="grid grid-cols-2 gap-4 text-left">
                {SOCIAL_LINKS.map((social) => (
                  <a 
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-brand-red hover:border-brand-red group transition-all text-left"
                  >
                    <social.icon className="w-5 h-5 text-slate-400 group-hover:text-white text-left" />
                    <span className="text-xs font-black uppercase tracking-tighter text-slate-300 group-hover:text-white text-left">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 text-left">&copy; 2026 The Comrade Market Bureau</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-red/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse text-left" />
              <span className="text-[8px] font-black uppercase tracking-widest text-brand-red text-left">Network Live</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-left">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors text-left">Terms</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors text-left">Privacy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors text-left">Manifesto</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

// --- Main App ---
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/traction" element={<TractionDashboard />} />
      </Routes>
    </Router>
  );
}
