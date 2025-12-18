
import React, { useEffect, useRef, useState } from 'react';
import { 
  Maximize, 
  Mic, 
  Scan, 
  ShieldCheck, 
  Activity, 
  Battery, 
  Wifi, 
  Crosshair,
  Package,
  Zap,
  AlertCircle
} from 'lucide-react';

const VisionLink: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(true);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied for Vision Link", err);
      }
    }
    setupCamera();
  }, []);

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanned("MK Logic 2-Gang Socket (Unit Cost: £4.20)");
    }, 1500);
  };

  return (
    <div className="relative h-[calc(100vh-140px)] w-full bg-black rounded-[2rem] overflow-hidden border-4 border-slate-900 shadow-2xl">
      {/* Real Camera Feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale brightness-125"
      />

      {/* AR HUD OVERLAY */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
        
        {/* Top Telemetry */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-black text-[10px] tracking-[0.2em]">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              VISION-SYNC v1.1 ACTIVE
            </div>
            <div className="text-white/40 text-[8px] font-bold tracking-widest">USER: S_CRAIK_01</div>
          </div>
          
          <div className="flex gap-4 text-amber-400/60">
            <Wifi size={16} />
            <Battery size={16} />
          </div>
        </div>

        {/* Center Scanner HUD */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64 border border-amber-400/20 rounded-lg">
            {/* Corner Brackets */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-amber-400" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Crosshair size={32} className={`text-amber-400/40 ${isScanning ? 'animate-spin' : ''}`} />
            </div>

            {isScanning && (
              <div className="absolute inset-0 bg-amber-400/10 animate-pulse" />
            )}
            
            {/* Scanning Line */}
            <div className="absolute left-0 right-0 h-[2px] bg-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-[scan-line_3s_infinite]" />
          </div>
        </div>

        {/* Bottom Data & Control */}
        <div className="flex justify-between items-end gap-6 pointer-events-auto">
          {/* Left: Material Data Card */}
          <div className="bg-slate-950/80 backdrop-blur-xl border-l-4 border-amber-400 p-6 rounded-r-2xl max-w-xs animate-in slide-in-from-left duration-500">
             <div className="flex items-center gap-3 mb-3">
               <Package className="text-amber-400" size={20} />
               <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Part Recognition</span>
             </div>
             {lastScanned ? (
               <div className="space-y-2">
                 <p className="text-sm font-bold text-amber-400 leading-tight uppercase">{lastScanned}</p>
                 <p className="text-[10px] text-slate-400 font-bold">MATCH FOUND IN INVENTORY</p>
                 <button className="mt-4 w-full bg-amber-400 text-slate-950 text-[10px] font-black py-2 rounded-lg uppercase tracking-widest">
                   Confirm Log
                 </button>
               </div>
             ) : (
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Point glasses at barcode to identify</p>
             )}
          </div>

          {/* Right: Voice Command Console */}
          <div className="flex flex-col items-end gap-4">
             <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-6 py-4 rounded-3xl border border-amber-400/30">
                <div className="flex gap-1 h-6 items-center">
                   {[...Array(5)].map((_, i) => (
                     <div 
                      key={i} 
                      className={`w-1 bg-amber-400 rounded-full animate-bounce`} 
                      style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
                     />
                   ))}
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-white tracking-widest uppercase">Voice Input Active</p>
                   <p className="text-[8px] font-bold text-amber-400 uppercase tracking-widest">"Log 10m 2.5mm T+E..."</p>
                </div>
                <div className="bg-amber-400 p-2 rounded-full text-slate-950 ml-2">
                  <Mic size={18} fill="currentColor" />
                </div>
             </div>
             
             <button 
              onClick={simulateScan}
              className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-xs tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-transform"
             >
                <Scan size={20} />
                MANUAL TRIGGER
             </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default VisionLink;
