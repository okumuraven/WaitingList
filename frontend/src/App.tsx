import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Truck, ShieldCheck, ArrowRight, CheckCircle2, Loader2, Flame, Users2, Star, Target, Zap, Building2, Wallet, ChefHat, Crown, Globe, Store, Bike, BadgeCheck, LayoutDashboard } from 'lucide-react';

const WaitingListForm = ({ variant = 'default' }: { variant?: 'default' | 'cta' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('http://localhost:5000/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Unable to connect to the server.');
    }
  };

  const isCTA = variant === 'cta';

  return (
    <div className={`w-full ${isCTA ? 'max-w-xl' : 'max-w-lg'} mx-auto px-2 sm:px-0`}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-red/10 border border-brand-red/30 p-6 sm:p-8 rounded-3xl text-center backdrop-blur-md"
          >
            <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-brand-red mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 uppercase tracking-tight">Welcome to the Frontline!</h3>
            <p className="text-sm sm:text-base text-slate-300 mb-6">{message}</p>
            <button 
              onClick={() => { setStatus('idle'); setEmail(''); }}
              className="text-[10px] sm:text-xs font-black text-brand-red hover:text-white transition-colors uppercase tracking-[0.2em]"
            >
              Add another email
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 p-2 ${isCTA ? 'bg-white/10' : 'bg-brand-dark/50'} border border-white/10 rounded-3xl sm:rounded-[2.5rem] backdrop-blur-xl shadow-2xl transition-all group-focus-within:border-brand-red/40`}>
              <input
                type="email"
                required
                placeholder="Your University Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="flex-1 px-5 sm:px-8 py-4 sm:py-5 bg-transparent text-white placeholder:text-slate-500 outline-none text-base sm:text-lg font-medium"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 sm:px-10 py-4 sm:py-5 bg-brand-red hover:bg-red-500 text-white font-black rounded-2xl sm:rounded-[2rem] shadow-xl shadow-brand-red/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group uppercase tracking-tighter text-base sm:text-lg"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                ) : (
                  <>
                    Secure My Spot
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-7 sm:-bottom-8 left-4 sm:left-8 text-[10px] sm:text-sm font-bold text-brand-red"
              >
                {message}
              </motion.p>
            )}
          </motion.form>
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
      <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tighter leading-tight">
        {title} <span className="text-brand-red">{highlight}</span>
      </h3>
      <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
        {description}
      </p>
    </div>
  </motion.div>
);

function App() {
  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-red selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-brand-red/10 rounded-full blur-[100px] sm:blur-[150px] opacity-40" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-brand-red/5 rounded-full blur-[80px] sm:blur-[120px] opacity-20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 py-8 sm:py-12 px-6 mb-12 sm:mb-24">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red flex items-center justify-center rounded-lg sm:rounded-xl shadow-lg shadow-brand-red/20">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none">Comrade<span className="text-brand-red">Market</span></span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">The Student Standard</span>
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
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-brand-red/10 border border-brand-red/20"
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-brand-red fill-brand-red" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-brand-red">Own Your Hustle</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-7xl md:text-9xl font-black mb-8 sm:mb-10 leading-[0.9] uppercase tracking-tighter italic"
          >
            The Student <br /> <span className="text-brand-red not-italic">Economy.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl md:text-3xl text-slate-400 mb-12 sm:mb-16 max-w-4xl mx-auto font-medium leading-relaxed sm:leading-tight"
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
            <div className="flex items-center gap-2 sm:gap-3">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" />
              <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-500">Zero-Fraud Escrow</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" />
              <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-500">Regional Governance</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" />
              <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-500">M-Pesa Integrated</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Manifesto Section - THE CORE DEPTH */}
      <section className="py-24 sm:py-40 px-6 bg-brand-dark/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-red/5 skew-x-12 translate-x-32" />
        <div className="max-w-7xl mx-auto relative z-10 text-left">
          <div className="flex flex-col gap-3 mb-16 sm:mb-24">
            <span className="text-brand-red text-[10px] sm:text-sm font-black uppercase tracking-[0.4em]">The Architecture</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-tight">Why it's a <br className="sm:hidden" /> <span className="text-brand-red not-italic">Revolution.</span></h2>
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
                <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none italic">
                  Run your <span className="text-brand-red">Region.</span>
                </h3>
                <p className="text-slate-400 text-lg sm:text-xl font-medium">
                  We're looking for the first 50 Regional Admins to lead the student economy in their campus. Manage, Moderate, Lead.
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-4 border-t border-white/5">
                  <span className="px-3 sm:px-4 py-2 bg-brand-red text-white text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">Leadership Hub</span>
                  <span className="px-3 sm:px-4 py-2 bg-brand-dark text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">Governed by Comrades</span>
                </div>
              </motion.div>
            </div>
            
            <div className="flex flex-col gap-8 sm:gap-12 text-left order-1 lg:order-2">
              <div className="flex flex-col gap-3 sm:gap-4">
                <span className="text-brand-red text-[10px] sm:text-sm font-black uppercase tracking-[0.4em]">The Opportunity</span>
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-tight">Build your <br className="sm:hidden" /> <span className="text-brand-red not-italic">Legacy.</span></h2>
              </div>
              <p className="text-slate-400 text-lg sm:text-xl font-medium leading-relaxed">
                Whether you're a seller building an empire, a courier powering the campus, or a leader managing a region, ComradeMarket is your platform to grow.
              </p>
              <ul className="flex flex-col gap-4 sm:gap-6">
                {[
                  { icon: BadgeCheck, text: "Verified Student Network" },
                  { icon: LayoutDashboard, text: "Professional Seller Dashboards" },
                  { icon: Globe, text: "Nationwide Growth Potential" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 sm:gap-4 text-white font-bold uppercase tracking-widest text-[10px] sm:text-sm">
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
        <div className="max-w-6xl mx-auto bg-brand-red rounded-[3rem] sm:rounded-[5rem] p-10 sm:p-20 md:p-32 text-center relative overflow-hidden shadow-2xl shadow-brand-red/50">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-6xl md:text-9xl font-black text-white uppercase tracking-tighter mb-8 sm:mb-12 leading-[1] italic text-shadow-xl">
              Don't just join. <br /> Lead the movement.
            </h2>
            <p className="text-white/80 text-lg sm:text-2xl md:text-4xl mb-12 sm:mb-20 max-w-2xl mx-auto font-black italic tracking-tight leading-snug">
              Secure your handle, apply for Admin roles, <br className="hidden sm:block" />
              <span className="text-white underline decoration-white/30 underline-offset-4 sm:underline-offset-8">and join the student elite.</span>
            </p>
            <WaitingListForm variant="cta" />
          </div>
        </div>
      </section>

      {/* Brand Footer */}
      <footer className="py-16 sm:py-24 px-6 sm:px-8 border-t border-white/5 bg-brand-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 sm:gap-16">
          <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-red/10 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" />
              </div>
              <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic">ComradeMarket</span>
            </div>
            <p className="text-slate-500 text-[10px] sm:text-sm max-w-xs sm:max-w-sm font-medium leading-relaxed uppercase tracking-widest">
              The digital standard for student economies. Built in Nairobi, governed by Comrades.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-12 sm:gap-24 w-full md:w-auto">
            <div className="flex flex-col gap-4 sm:gap-6 text-left">
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-brand-red">Socials</span>
              {['Twitter', 'Instagram', 'Telegram'].map(link => (
                <a key={link} href="#" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">{link}</a>
              ))}
            </div>
            <div className="flex flex-col gap-4 sm:gap-6 text-left">
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-brand-red">Manifesto</span>
              {['Elite Stores', 'Bidding Delivery', 'Campus Luxe', 'Leadership'].map(link => (
                <a key={link} href="#" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-600">&copy; 2026 The Comrade Market Bureau</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-brand-red">Ecosystem Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
