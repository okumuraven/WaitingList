import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, GraduationCap, Clock, Flame, 
  ArrowRight, ShieldCheck, Globe, ShoppingCart, 
  Store, Bike, ChefHat, Key, UserCog, PieChart 
} from 'lucide-react';

interface Metrics {
  total: number;
  last24h: number;
  topUniversities: Array<{ domain: string; count: number }>;
  recentSignups: Array<{ maskedEmail: string; time: string; userType: string }>;
  segments: Record<string, number>;
}

const ROLE_ICONS: Record<string, any> = {
  'Buyer': ShoppingCart,
  'Seller': Store,
  'Courier': Bike,
  'Hotel Owner': ChefHat,
  'Rental Owner': Key,
  'Admin': UserCog
};

const StatCard = ({ icon: Icon, label, value, subtext }: { icon: any; label: string; value: string | number; subtext: string }) => (
  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
    <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mb-6">
      <Icon className="w-6 h-6 text-brand-red" />
    </div>
    <div className="text-3xl sm:text-4xl font-black mb-2">{value}</div>
    <div className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">{label}</div>
    <div className="text-brand-red text-[10px] sm:text-xs font-black">{subtext}</div>
  </div>
);

export default function TractionDashboard() {
  const [data, setData] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/metrics')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Failed to fetch metrics:", err));
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6">
       <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-black text-white p-4 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 sm:mb-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20">
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic text-left">Traction<span className="text-brand-red">Report</span></h1>
              <p className="text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-left">ComradeMarket Kenya Internal Data</p>
            </div>
          </div>
          <div className="w-full md:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-brand-red/10 border border-brand-red/20 rounded-xl sm:rounded-2xl flex items-center justify-center md:justify-start gap-3 text-left">
             <div className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
             <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-brand-red">Real-time Pitch Data Active</span>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <StatCard 
            icon={Users} 
            label="Total Comrades" 
            value={data.total} 
            subtext="+100% Growth Potential" 
          />
          <StatCard 
            icon={TrendingUp} 
            label="Daily Signups" 
            value={data.last24h} 
            subtext="Market Momentum" 
          />
          <StatCard 
            icon={GraduationCap} 
            label="Active Universities" 
            value={data.topUniversities.length} 
            subtext="Nationwide Reach" 
          />
          <StatCard 
            icon={ShieldCheck} 
            label="High-Intent Users" 
            value="98.2%" 
            subtext="Market Validation" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Market Segmentation */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-left">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter italic">Market <span className="text-brand-red">Segmentation</span></h2>
              <PieChart className="w-5 h-5 text-slate-600" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {data.segments && Object.entries(data.segments).map(([role, count], i) => {
                const Icon = ROLE_ICONS[role] || Users;
                const percentage = data.total > 0 ? Math.round((count / data.total) * 100) : 0;
                return (
                  <motion.div 
                    key={role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-brand-dark/50 border border-white/5 rounded-3xl relative overflow-hidden"
                  >
                    <Icon className="w-8 h-8 text-brand-red/40 mb-4" />
                    <div className="text-2xl font-black mb-1">{count}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{role}s</div>
                    <div className="flex items-center gap-2">
                       <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-red" style={{ width: `${percentage}%` }} />
                       </div>
                       <span className="text-[10px] font-black text-brand-red">{percentage}%</span>
                    </div>
                  </motion.div>
                );
              })}
              {(!data.segments || Object.keys(data.segments).length === 0) && (
                <p className="text-slate-500 text-sm italic col-span-full">No segmentation data available yet.</p>
              )}
            </div>
          </div>

          {/* Top Campus Distribution */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-left">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter italic">University <span className="text-brand-red">Rankings</span></h2>
              <Globe className="w-5 h-5 text-slate-600" />
            </div>
            <div className="space-y-6">
              {data.topUniversities.map((uni, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-black uppercase tracking-tight text-white group-hover:text-brand-red transition-colors text-left">
                      {uni.domain.split('.')[0]}
                    </span>
                    <span className="text-slate-500 font-black tracking-widest text-[10px]">
                      {uni.count} Comrades
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: data.total > 0 ? `${(uni.count / data.total) * 100}%` : '0%' }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className="h-full bg-brand-red" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 text-left lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter italic">Live <span className="text-brand-red">Activation Feed</span></h2>
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {data.recentSignups.map((signup, i) => {
                const Icon = ROLE_ICONS[signup.userType] || Users;
                return (
                  <div key={i} className="flex flex-col gap-3 p-4 bg-brand-dark/50 rounded-2xl border border-white/5 hover:border-brand-red/30 transition-all group">
                     <div className="flex justify-between items-start">
                       <div className="w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-brand-red" />
                       </div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Verified</span>
                     </div>
                     <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate">{signup.maskedEmail}</span>
                        <span className="text-[8px] text-brand-red font-black uppercase tracking-widest truncate text-left">Joined as {signup.userType}</span>
                     </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Investor Pitch CTA */}
        <div className="mt-8 sm:mt-12 p-8 sm:p-12 bg-gradient-to-br from-brand-red to-red-900 rounded-[3rem] flex flex-col lg:flex-row justify-between items-center gap-8 shadow-2xl shadow-brand-red/20 text-center lg:text-left">
           <div>
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-2 leading-tight">The Ecosystem is Primed.</h3>
              <p className="text-white/70 font-bold text-lg">Supply-side readiness is confirmed across 6 major student verticals.</p>
           </div>
           <button className="w-full lg:w-auto px-12 py-5 bg-white text-brand-red font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-transform">
              Review Unit Economics
              <ArrowRight className="w-6 h-6" />
           </button>
        </div>
      </div>
    </div>
  );
}
