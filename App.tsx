
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import AIAssistant from './components/AIAssistant';
import VisionLink from './components/VisionLink';
import { ViewType, Job, JobStatus, Material } from './types';
import { MOCK_JOBS, COMPANY_NAME } from './constants';
import { 
  Play, 
  Square, 
  MapPin, 
  Clock, 
  Plus, 
  ChevronRight, 
  Search, 
  AlertCircle,
  TrendingUp, 
  FileText,
  DollarSign,
  Zap,
  Settings,
  X,
  Package,
  Calculator,
  AlignLeft,
  Tag,
  Filter,
  ArrowRight,
  Layers,
  Scale,
  ClipboardList,
  Eye,
  Barcode,
  Cpu,
  Lock,
  Coins,
  ShieldCheck,
  Rocket,
  ArrowUpRight,
  Activity,
  Wifi,
  Maximize,
  CheckCircle2,
  Database,
  Users,
  HardHat,
  Gavel,
  History,
  Shield
} from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [jobFilter, setJobFilter] = useState<JobStatus | 'all'>('all');
  const [timerActive, setTimerActive] = useState(false);
  const [timerValue, setTimerValue] = useState(0);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Material Modal State
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    name: '',
    quantity: '1',
    unitQuantity: '1',
    unitPrice: '',
    unitCost: '',
    description: '',
    barcode: ''
  });

  useEffect(() => {
    let interval: any;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerValue((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartJob = (id: string) => {
    setActiveJobId(id);
    setTimerActive(true);
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'active' as JobStatus } : j));
  };

  const handleOpenMaterialModal = (id: string) => {
    setSelectedJobId(id);
    setIsMaterialModalOpen(true);
    setScanSuccess(false);
  };

  const handleCloseMaterialModal = () => {
    setIsMaterialModalOpen(false);
    setSelectedJobId(null);
    setMaterialForm({ name: '', quantity: '1', unitQuantity: '1', unitPrice: '', unitCost: '', description: '', barcode: '' });
    setScanSuccess(false);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId || !materialForm.name) return;

    const newMaterial: Material = {
      id: `M-${Date.now()}`,
      name: materialForm.name,
      quantity: parseFloat(materialForm.quantity),
      unitQuantity: parseFloat(materialForm.unitQuantity) || 1,
      unitPrice: materialForm.unitPrice ? parseFloat(materialForm.unitPrice) : 0,
      unitCost: materialForm.unitCost ? parseFloat(materialForm.unitCost) : undefined,
      description: materialForm.description.trim() || undefined,
      barcode: materialForm.barcode.trim() || undefined
    };

    setJobs(jobs.map(job => 
      job.id === selectedJobId 
        ? { ...job, materials: [...job.materials, newMaterial] }
        : job
    ));

    handleCloseMaterialModal();
  };

  const simulateBarcodeScan = () => {
    setIsScanning(true);
    setScanSuccess(false);
    
    // Simulate API/Vision latency
    setTimeout(() => {
      const randomBarcode = `50${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      setMaterialForm(prev => ({ ...prev, barcode: randomBarcode }));
      setIsScanning(false);
      setScanSuccess(true);
      
      // Clear success state after a few seconds
      setTimeout(() => setScanSuccess(false), 2000);
    }, 1200);
  };

  const marginData = useMemo(() => {
    const cost = parseFloat(materialForm.unitCost) || 0;
    const price = parseFloat(materialForm.unitPrice) || 0;
    if (cost > 0 && price > 0) {
      const profit = price - cost;
      const margin = (profit / price) * 100;
      return { profit, margin };
    }
    return null;
  }, [materialForm.unitCost, materialForm.unitPrice]);

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className={`p-8 rounded-[2rem] transition-all duration-500 border ${timerActive ? 'bg-amber-400 text-slate-950 border-amber-500' : 'bg-slate-900 text-white border-white/5'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-xs font-black tracking-[0.3em] uppercase mb-2 opacity-70">
              {timerActive ? 'ACTIVE SESSION' : 'SYSTEM READY'}
            </h2>
            <div className="text-5xl md:text-7xl font-heading font-black tracking-tighter tabular-nums leading-none">
              {formatTime(timerValue)}
            </div>
            {activeJobId && (
              <p className="mt-4 font-bold text-sm tracking-wide">
                <span className="opacity-70">ON JOB:</span> {jobs.find(j => j.id === activeJobId)?.title}
              </p>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <button 
              onClick={() => setActiveView('vision-link')}
              className="px-6 py-5 rounded-2xl font-black text-xs tracking-widest flex items-center justify-center gap-2 bg-slate-800 text-amber-400 border border-white/5 hover:bg-slate-700 transition-all"
            >
              <Eye size={18} /> VISION HUB
            </button>
            <button 
              onClick={() => setTimerActive(!timerActive)}
              className={`flex-grow md:flex-none px-10 py-5 rounded-2xl font-black text-sm tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 ${
                timerActive ? 'bg-slate-950 text-white' : 'bg-amber-400 text-slate-950 shadow-xl shadow-amber-400/20'
              }`}
            >
              {timerActive ? (
                <><Square size={20} fill="currentColor" /> STOP SESSION</>
              ) : (
                <><Play size={20} fill="currentColor" /> START SHIFT</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <TrendingUp className="text-emerald-400" size={24} />
            <span className="text-[10px] font-black text-slate-500">EARNINGS TODAY</span>
          </div>
          <div className="text-3xl font-heading font-black">£425.00</div>
          <div className="mt-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">+12% vs Average</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <Clock className="text-amber-400" size={24} />
            <span className="text-[10px] font-black text-slate-500">TOTAL HOURS</span>
          </div>
          <div className="text-3xl font-heading font-black">5.5H</div>
          <div className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target: 8.0H</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <FileText className="text-blue-400" size={24} />
            <span className="text-[10px] font-black text-slate-500">OPEN QUOTES</span>
          </div>
          <div className="text-3xl font-heading font-black">£1.2K</div>
          <div className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">3 Proposals Pending</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-heading font-black tracking-tight uppercase">UPCOMING JOBS</h3>
          <button onClick={() => setActiveView('jobs')} className="text-xs font-black text-amber-400 tracking-widest hover:underline">VIEW ALL</button>
        </div>
        <div className="space-y-4">
          {jobs.filter(j => j.status !== 'completed').slice(0, 3).map(job => (
            <div key={job.id} className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-amber-400/30 transition-all">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  job.status === 'active' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Zap size={24} fill={job.status === 'active' ? 'currentColor' : 'none'} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{job.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={10} /> {job.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                  job.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  {job.status}
                </span>
                <button 
                  onClick={() => handleStartJob(job.id)}
                  className="p-3 bg-slate-800 rounded-xl group-hover:bg-amber-400 group-hover:text-slate-950 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJobsView = () => {
    const filteredJobs = jobFilter === 'all' 
      ? jobs 
      : jobs.filter(j => j.status === jobFilter);

    const statuses: (JobStatus | 'all')[] = ['all', 'active', 'pending', 'on-hold', 'completed'];

    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight">JOB REGISTRY</h2>
          <button className="bg-amber-400 text-slate-950 px-6 py-3 rounded-2xl font-black text-xs tracking-widest flex items-center gap-2 shadow-xl shadow-amber-400/10">
            <Plus size={18} /> CREATE NEW JOB
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 p-2 rounded-[1.5rem] border border-white/5 overflow-x-auto custom-scrollbar no-scrollbar">
          <div className="px-4 py-2 flex items-center gap-2 border-r border-white/10">
            <Filter size={14} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Filter</span>
          </div>
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setJobFilter(status)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                jobFilter === status 
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/10' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {status.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH CLIENTS, ADDRESSES, OR IDS..."
            className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-widest focus:border-amber-400 outline-none"
          />
        </div>

        <div className="space-y-4">
          {filteredJobs.length > 0 ? filteredJobs.map(job => (
            <div key={job.id} className="bg-slate-900 p-6 rounded-3xl border border-white/5 group hover:border-amber-400/30 transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-amber-400 tracking-widest uppercase mb-1 block">REF: {job.id}</span>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{job.title}</h3>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase ${
                    job.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' : 
                    job.status === 'on-hold' ? 'bg-amber-400/10 text-amber-400' : 
                    job.status === 'completed' ? 'bg-blue-400/10 text-blue-400' :
                    'bg-slate-800 text-slate-500'
                  }`}>
                    {job.status}
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm text-slate-400 font-medium">
                 <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="text-white font-bold">{job.clientName}</p>
                      <p>{job.address}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <Clock size={18} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="text-white font-bold">SCHEDULED</p>
                      <p>{job.scheduledDate}</p>
                    </div>
                 </div>
               </div>

               {job.materials.length > 0 && (
                 <div className="mb-8 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 tracking-[0.2em] mb-3 uppercase">Logged Parts ({job.materials.length})</p>
                   <div className="flex flex-wrap gap-2">
                      {job.materials.map((m) => {
                        const totalQty = m.quantity * (m.unitQuantity || 1);
                        const qtyDisplay = m.unitQuantity && m.unitQuantity > 1 
                          ? `${m.quantity} x ${m.unitQuantity}`
                          : `${m.quantity}`;
                        
                        return (
                          <span key={m.id} title={`${m.description || ''}${m.barcode ? ` (Barcode: ${m.barcode})` : ''}${m.unitCost ? ` (Cost: £${m.unitCost})` : ''}`} className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-300 cursor-help border border-transparent hover:border-amber-400/30 transition-colors flex items-center gap-1.5 flex-wrap">
                            {m.name} 
                            <span className="text-amber-400 font-black ml-1">{qtyDisplay}</span>
                            {m.unitQuantity && m.unitQuantity > 1 && (
                              <span className="text-slate-500 text-[8px]">({totalQty} TOTAL)</span>
                            )}
                            {m.barcode && (
                              <span className="ml-1 px-1.5 py-0.5 bg-slate-950 rounded text-[8px] border border-white/5 text-slate-500 flex items-center gap-1 leading-none">
                                <Barcode size={8} /> {m.barcode}
                              </span>
                            )}
                          </span>
                        );
                      })}
                   </div>
                 </div>
               )}

               <div className="flex gap-4">
                 <button className="flex-grow bg-slate-800 hover:bg-slate-700 text-white font-black text-[10px] py-4 rounded-xl tracking-widest transition-all uppercase">
                    View Specs
                 </button>
                 <button 
                  onClick={() => handleOpenMaterialModal(job.id)}
                  className="flex-grow bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400 hover:text-slate-950 text-amber-400 font-black text-[10px] py-4 rounded-xl tracking-widest transition-all uppercase"
                >
                    Log Materials
                 </button>
               </div>
            </div>
          )) : (
            <div className="py-20 text-center opacity-30">
              <FileText size={48} className="mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-[0.2em]">No jobs found in this category</p>
            </div>
          )}
        </div>

        {isMaterialModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 md:p-12 animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={handleCloseMaterialModal}></div>
            <div className="relative w-full max-w-lg bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
                 <div className="flex items-center gap-4">
                   <div className="bg-amber-400 p-2 rounded-xl text-slate-950">
                      <Package size={20} />
                   </div>
                   <div>
                      <h3 className="font-heading font-black text-xl text-white uppercase tracking-tight">LOG MATERIALS</h3>
                      <p className="text-[10px] font-bold text-slate-500 tracking-widest">JOB REF: {selectedJobId}</p>
                   </div>
                 </div>
                 <button onClick={handleCloseMaterialModal} className="text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleAddMaterial} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">PART NAME / DESCRIPTION</label>
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                     <input 
                      required
                      autoFocus
                      value={materialForm.name}
                      onChange={(e) => setMaterialForm({...materialForm, name: e.target.value})}
                      type="text" 
                      placeholder="E.G. MK LOGIC 1-GANG SOCKET..."
                      className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-widest focus:border-amber-400 outline-none text-white transition-all"
                     />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">
                    BARCODE <span className="text-slate-700 opacity-60 ml-1">[OPTIONAL]</span>
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-grow">
                      <Barcode className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${scanSuccess ? 'text-emerald-400' : 'text-slate-600'}`} size={16} />
                      <input 
                        value={materialForm.barcode}
                        onChange={(e) => setMaterialForm({...materialForm, barcode: e.target.value})}
                        type="text" 
                        placeholder="SCAN OR ENTER BARCODE ID..."
                        className={`w-full bg-slate-950 border rounded-xl pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-widest outline-none text-white transition-all ${scanSuccess ? 'border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 'border-white/5 focus:border-amber-400'}`}
                      />
                      {isScanning && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Activity size={14} className="text-amber-400 animate-pulse" />
                        </div>
                      )}
                      {scanSuccess && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-in zoom-in duration-300">
                          <CheckCircle2 size={16} className="text-emerald-400" />
                        </div>
                      )}
                    </div>
                    <button 
                      type="button"
                      disabled={isScanning}
                      onClick={simulateBarcodeScan}
                      className={`p-4 rounded-xl transition-all border shrink-0 flex items-center justify-center group ${isScanning ? 'bg-amber-400/10 border-amber-400/20' : 'bg-slate-800 border-white/5 hover:bg-slate-700 hover:text-amber-400 text-slate-400'}`}
                      title="Initiate Vision Scan"
                    >
                      <Maximize size={18} className={isScanning ? 'animate-spin' : 'group-hover:scale-110 transition-transform'} />
                    </button>
                  </div>
                  <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest mt-2 ml-1 flex items-center gap-1">
                    <ShieldCheck size={10} className="text-amber-400" /> 
                    AI-Vision Scanner Compatible <span className="text-slate-800">[BETA]</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">UNITS (QTY)</label>
                    <div className="relative">
                      <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                      <input 
                        required
                        value={materialForm.quantity}
                        onChange={(e) => setMaterialForm({...materialForm, quantity: e.target.value})}
                        type="number" 
                        min="1"
                        step="any"
                        className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-widest focus:border-amber-400 outline-none text-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">QTY PER UNIT</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                      <input 
                        value={materialForm.unitQuantity}
                        onChange={(e) => setMaterialForm({...materialForm, unitQuantity: e.target.value})}
                        type="number" 
                        step="any"
                        placeholder="E.G. 100 (for 100m)"
                        className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-widest focus:border-amber-400 outline-none text-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">UNIT COST (£) <span className="text-slate-700 opacity-60 ml-1">[OPTIONAL]</span></label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                      <input 
                        value={materialForm.unitCost}
                        onChange={(e) => setMaterialForm({...materialForm, unitCost: e.target.value})}
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-widest focus:border-amber-400 outline-none text-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">TOTAL LOGGED QTY</label>
                    <div className="w-full bg-slate-950/50 border border-amber-400/20 rounded-xl px-6 py-4 text-[10px] font-black text-amber-400 tracking-widest uppercase flex items-center justify-between shadow-inner">
                       <span className="opacity-50">CALCULATED</span>
                       <span className="text-sm">{(parseFloat(materialForm.quantity) || 0) * (parseFloat(materialForm.unitQuantity) || 1)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">UNIT PRICE (£) [FOR INVOICING] <span className="text-slate-700 opacity-60 ml-1">[OPTIONAL]</span></label>
                    <div className="relative">
                      <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                      <input 
                        value={materialForm.unitPrice}
                        onChange={(e) => setMaterialForm({...materialForm, unitPrice: e.target.value})}
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-widest focus:border-amber-400 outline-none text-white transition-all"
                      />
                    </div>
                  </div>

                  {marginData && (
                    <div className="flex items-center justify-between px-2 pt-2 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={12} className="text-emerald-400" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Est. Margin</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400">£{marginData.profit.toFixed(2)} PROFIT</span>
                        <div className="h-3 w-px bg-white/10"></div>
                        <span className={`text-[10px] font-black ${marginData.margin > 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {marginData.margin.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">JOB DESCRIPTION <span className="text-slate-700 opacity-60 ml-1">[OPTIONAL]</span></label>
                  <div className="relative">
                    <ClipboardList className="absolute left-4 top-4 text-slate-600" size={16} />
                    <textarea 
                      value={materialForm.description}
                      onChange={(e) => setMaterialForm({...materialForm, description: e.target.value})}
                      placeholder="ENTER SPECIFIC INSTALLATION DETAILS, LOCATION (E.G. KITCHEN), OR FAULT NOTES..."
                      rows={4}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-widest focus:border-amber-400 outline-none text-white transition-all resize-none shadow-inner"
                    />
                  </div>
                </div>

                <div className="pt-4 sticky bottom-0 bg-slate-900 pb-2">
                  <button type="submit" className="w-full bg-amber-400 hover:bg-white text-slate-950 font-black py-5 rounded-2xl tracking-[0.2em] transition-all shadow-xl shadow-amber-400/10 active:scale-95 text-xs uppercase flex items-center justify-center gap-2 group">
                    RECORD TO JOB LEDGER
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMaterialsView = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
       <div className="text-center py-20 bg-slate-900 rounded-[3rem] border border-dashed border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
            <Package size={200} />
          </div>
          <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center text-amber-400 mx-auto mb-6 shadow-xl border border-white/5">
             <Plus size={40} />
          </div>
          <h2 className="text-2xl font-heading font-black uppercase mb-4">INVENTORY SYSTEMS</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">
            Scan parts directly from your phone camera or via Vision Link glasses. Barcodes are automatically tracked.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-amber-400 text-slate-950 px-12 py-5 rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl shadow-amber-400/10 hover:bg-white transition-colors">
               LAUNCH SCANNER
            </button>
            <button 
              onClick={() => setActiveView('vision-link')}
              className="bg-slate-800 text-white px-12 py-5 rounded-2xl font-black text-xs tracking-[0.2em] border border-white/10 hover:bg-slate-700 transition-colors"
            >
               VISION HUB (AR)
            </button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
             <h3 className="text-sm font-black text-white tracking-widest uppercase mb-8 border-b border-white/5 pb-4 flex justify-between">
               RECENTLY USED
               <span className="text-[10px] text-slate-600">LAST 5 ENTRIES</span>
             </h3>
             <div className="space-y-4">
                {jobs.flatMap(j => j.materials).slice(-5).reverse().map((m, i) => {
                  const unitLabel = m.unitQuantity && m.unitQuantity > 1 
                    ? ` x ${m.unitQuantity}`
                    : '';
                  
                  return (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-amber-400 border border-white/5 group-hover:border-amber-400/30 transition-all">
                            <Package size={20} />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-white uppercase">{m.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-[9px] text-slate-500 uppercase tracking-tighter">
                                £{m.unitPrice.toFixed(2)} / UNIT
                              </p>
                              {m.barcode && (
                                <span className="text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 flex items-center gap-1">
                                  <Barcode size={8} /> {m.barcode}
                                </span>
                              )}
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-amber-400 block">
                          {m.quantity}{unitLabel}
                        </span>
                        <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Recorded</span>
                      </div>
                    </div>
                  );
                })}
                {jobs.flatMap(j => j.materials).length === 0 && (
                   <div className="text-center py-10">
                    <History size={32} className="mx-auto text-slate-800 mb-2" />
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest">No materials logged today</p>
                   </div>
                )}
             </div>
          </div>
          
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
             <h3 className="text-sm font-black text-white tracking-widest uppercase mb-8 border-b border-white/5 pb-4">STOCK INTELLIGENCE</h3>
             <div className="space-y-4">
                <div className="flex gap-4 p-5 bg-amber-400/5 rounded-2xl border border-amber-400/20">
                   <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="text-amber-400" size={20} />
                   </div>
                   <div>
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Low Stock Warning</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      2.5mm Twin & Earth Reel (Only 1 left in van). AI-Vision suggested re-order from Edmundson.
                    </p>
                   </div>
                </div>
                
                <div className="flex gap-4 p-5 bg-blue-400/5 rounded-2xl border border-blue-400/20">
                   <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="text-blue-400" size={20} />
                   </div>
                   <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Pricing Alert</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Wholesale cost for Consumer Units has increased by 4% this month. Adjust quote margins accordingly.
                    </p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderFutureTechView = () => (
    <div className="space-y-12 animate-in fade-in duration-700 pb-12">
      {/* Hero Vision Section */}
      <div className="relative p-12 rounded-[3rem] bg-slate-900 border border-white/5 overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-50"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl shadow-amber-400/20">
            <Rocket size={12} /> PROJECT: EVERNODE-SYNC
          </div>
          <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase leading-none text-white">
            THE DECENTRALIZED <br/><span className="text-amber-400">FUTURE</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Craik Electrical is bridging the gap between emerging technology and practical, 
            real-world applications. We're building a peer-to-peer professional economy 
            powered by Smart Contracts and the XRPL network.
          </p>
          <div className="flex justify-center gap-4">
             <button className="bg-white text-slate-950 px-8 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-amber-400 transition-colors">
               READ WHITEPAPER
             </button>
             <button className="bg-slate-800 text-white px-8 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase border border-white/10">
               VIEW ROADMAP
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Smart Contracts Card */}
        <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 group hover:border-amber-400/30 transition-all">
          <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-amber-400 mb-6 border border-white/5 group-hover:scale-110 transition-transform">
            <Lock size={28} />
          </div>
          <h3 className="text-xl font-heading font-black text-white uppercase mb-3">Smart Contracts</h3>
          <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">
            Digital "vending machines" for business agreements. Self-executing, trustless, and immutable logic 
            that ensures the rules of the agreement are fixed and transparent.
          </p>
          <ul className="space-y-3">
             <li className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
               <ShieldCheck size={14} className="text-emerald-400" /> Automation
             </li>
             <li className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
               <ShieldCheck size={14} className="text-emerald-400" /> Trustless Escrow
             </li>
             <li className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
               <ShieldCheck size={14} className="text-emerald-400" /> Transparent Ledger
             </li>
          </ul>
        </div>

        {/* Evernode Card */}
        <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 group hover:border-amber-400/30 transition-all">
          <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-amber-400 mb-6 border border-white/5 group-hover:scale-110 transition-transform">
            <Cpu size={28} />
          </div>
          <h3 className="text-xl font-heading font-black text-white uppercase mb-3">Evernode Hosting</h3>
          <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">
            A decentralized hosting platform built as a sidechain to the XRP Ledger (XRPL). 
            Providing the computing power for complex smart contracts in a low-cost, scalable environment.
          </p>
          <ul className="space-y-3">
             <li className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
               <ShieldCheck size={14} className="text-emerald-400" /> XRPL Efficiency
             </li>
             <li className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
               <ShieldCheck size={14} className="text-emerald-400" /> Global Scalability
             </li>
             <li className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
               <ShieldCheck size={14} className="text-emerald-400" /> 100% Decentralized
             </li>
          </ul>
        </div>

        {/* P2P Economy Card */}
        <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 group hover:border-amber-400/30 transition-all">
          <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-amber-400 mb-6 border border-white/5 group-hover:scale-110 transition-transform">
            <Users size={28} />
          </div>
          <h3 className="text-xl font-heading font-black text-white uppercase mb-3">P2P Economy</h3>
          <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">
            The future of Web3 for independent professionals. Disintermediation cuts out high-fee 
            middlemen, allowing individuals to own their data and portable reputation.
          </p>
          <ul className="space-y-3">
             <li className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
               <ShieldCheck size={14} className="text-emerald-400" /> Data Ownership
             </li>
             <li className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
               <ShieldCheck size={14} className="text-emerald-400" /> No Middlemen
             </li>
             <li className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
               <ShieldCheck size={14} className="text-emerald-400" /> Portable Reputation
             </li>
          </ul>
        </div>
      </div>

      {/* Case Study Scenario Section */}
      <div className="space-y-8">
        <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tight flex items-center gap-3">
          <HardHat className="text-amber-400" size={24} /> 
          PRACTICAL APPLICATION: "ANNA'S SMART JOB"
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
             <div className="bg-slate-900/40 p-6 rounded-3xl border-l-4 border-amber-400">
                <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2">1. The Agreement</p>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  Anna and her client agree on £950 for a kitchen rewire. This is locked into a Smart Contract. 
                  Funds are secure in digital escrow before a single wire is pulled.
                </p>
             </div>
             <div className="bg-slate-900/40 p-6 rounded-3xl border-l-4 border-emerald-400">
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">2. Verification</p>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  IoT sensors in the van and Vision Link glasses verify arrival and material usage. 
                  Evidence (photos/certificates) is immutably tied to the transaction.
                </p>
             </div>
             <div className="bg-slate-900/40 p-6 rounded-3xl border-l-4 border-blue-400">
                <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">3. Instant Settlement</p>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  Upon digital sign-off, the contract releases funds immediately. No invoicing, 
                  no waiting 30 days, no chasing payments. Settlement happens in seconds.
                </p>
             </div>
          </div>
          
          <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 flex flex-col justify-center">
             <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">SUMMARY OF BENEFITS</h4>
             <div className="space-y-4">
                {[
                  { label: "Guaranteed Payments", desc: "Escrow eliminates bad debts" },
                  { label: "Drastically Lower Fees", desc: "P2P removes the 20% platform cut" },
                  { label: "Automated Admin", desc: "No manual invoicing or chasing" },
                  { label: "Portable Asset", desc: "You own your reviews and history" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-xs font-black text-amber-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{item.desc}</p>
                    </div>
                    <CheckCircle2 className="text-emerald-400" size={18} />
                  </div>
                ))}
             </div>
             <div className="mt-8 p-4 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white transition-colors">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Coming Soon: Q4 2025</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </div>
          </div>
        </div>
      </div>

      {/* Challenges & Roadmap Footer */}
      <div className="bg-slate-900/30 p-10 rounded-[3rem] border border-dashed border-white/10 text-center">
         <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-4">ROADMAP CHALLENGES</h4>
         <div className="flex flex-wrap justify-center gap-6">
            <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2"><Gavel size={14}/> Legal Frameworks</span>
            <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2"><Activity size={14}/> Mass Adoption</span>
            <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2"><Shield size={14}/> UX Simplification</span>
         </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return renderDashboard();
      case 'jobs': return renderJobsView();
      case 'materials': return renderMaterialsView();
      case 'vision-link': return <VisionLink />;
      case 'future-tech': return renderFutureTechView();
      case 'ai-assistant': return <AIAssistant />;
      default: return (
        <div className="py-20 text-center opacity-50">
          <Settings size={48} className="mx-auto mb-4" />
          <h2 className="text-xl font-bold uppercase tracking-widest">Settings Module Offline</h2>
        </div>
      );
    }
  };

  return (
    <Layout activeView={activeView} setView={setActiveView} timerActive={timerActive}>
      {renderContent()}
    </Layout>
  );
};

export default App;
