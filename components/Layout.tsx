
import React from 'react';
import { Clock, User, Bell } from 'lucide-react';
import { COMPANY_NAME, NAV_ITEMS, APP_VERSION } from '../constants';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setView: (view: ViewType) => void;
  timerActive: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, timerActive }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-white/5 flex-col fixed h-full z-30">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-12 h-12 rounded-xl border-2 border-amber-400 overflow-hidden shrink-0 bg-slate-800 shadow-lg shadow-amber-400/10">
            <img 
              src="https://images.mirror-media.xyz/publication-images/79f53e1a-8e2b-4b1a-8c5e-8d8d8d8d8d8d.jpg" 
              alt="Craik Electrical Logo" 
              className="w-full h-full object-cover scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/400x400/fbbf24/020617?text=CE";
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-sm text-white tracking-tighter leading-none">{COMPANY_NAME}</span>
            <span className="text-[10px] text-amber-400/80 font-bold mt-1 tracking-widest">{APP_VERSION}</span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs tracking-widest transition-all ${
                activeView === item.id 
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50 group cursor-pointer hover:bg-slate-800 transition-all border border-transparent hover:border-white/5">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-white/10">
               <img 
                src="https://images.mirror-media.xyz/publication-images/79f53e1a-8e2b-4b1a-8c5e-8d8d8d8d8d8d.jpg" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                alt="S. Craik" 
               />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white">S. CRAIK</span>
              <span className="text-[8px] font-bold text-emerald-400 tracking-widest uppercase">MASTER ADMIN</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
        {/* Top App Bar */}
        <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
          <div className="md:hidden flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg border border-amber-400 overflow-hidden bg-slate-800">
                <img 
                  src="https://images.mirror-media.xyz/publication-images/79f53e1a-8e2b-4b1a-8c5e-8d8d8d8d8d8d.jpg" 
                  alt="Logo" 
                  className="w-full h-full object-cover" 
                />
             </div>
             <span className="font-heading font-black text-xs text-white uppercase tracking-tighter">CRAIK OP-CENTER</span>
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
            {timerActive && (
              <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-amber-400 rounded-full safety-pulse"></div>
                <span className="text-[10px] font-black text-amber-400 tracking-widest">RECORDING TIME</span>
              </div>
            )}
            <button className="text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border-2 border-slate-950"></span>
            </button>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-white/10 flex justify-around p-3 z-30 pb-safe">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeView === item.id ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[8px] font-black tracking-widest uppercase">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
