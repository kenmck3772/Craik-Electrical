
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, AlertTriangle, RefreshCw, Terminal, Code } from 'lucide-react';
import { getElectricalAdvice } from '../services/geminiService';
import { ChatMessage, MessageRole } from '../types';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: MessageRole.MODEL, text: "TERMINAL ACTIVE. I am the Craik Electrical Field Assistant. Provide a technical query or describe a fault for diagnostic support." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: MessageRole.USER, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg];
      const advice = await getElectricalAdvice(history);
      setMessages(prev => [...prev, { role: MessageRole.MODEL, text: advice }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: MessageRole.MODEL, text: "FATAL ERROR: AI CO-PROCESSOR DISCONNECTED." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight">AI FIELD TECH</h2>
          <p className="text-[10px] font-black text-amber-400 tracking-widest mt-1">NICEIC KNOWLEDGE BASE INTEGRATED</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-white/5 px-4 py-2 rounded-xl">
           <Code size={16} className="text-emerald-400" />
           <span className="text-[10px] font-black tracking-widest text-slate-400">STATUS: NOMINAL</span>
        </div>
      </div>

      <div className="flex-grow flex flex-col glass rounded-[2rem] overflow-hidden border-white/5 relative">
        {/* Chat Area */}
        <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 custom-scrollbar bg-slate-900/40">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden border ${msg.role === MessageRole.USER ? 'bg-white text-slate-950 border-white/10' : 'bg-slate-800 border-amber-400/30'}`}>
                {msg.role === MessageRole.USER ? (
                  <User size={20} />
                ) : (
                  <img 
                    src="https://images.mirror-media.xyz/publication-images/79f53e1a-8e2b-4b1a-8c5e-8d8d8d8d8d8d.jpg" 
                    className="w-full h-full object-cover" 
                    alt="AI Avatar" 
                  />
                )}
              </div>
              <div className={`max-w-[85%] ${msg.role === MessageRole.USER ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${msg.role === MessageRole.USER ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-slate-900 text-slate-300 border border-white/5 rounded-tl-none'}`}>
                   <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center border border-amber-400/20">
                <RefreshCw size={20} className="animate-spin" />
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 flex gap-2 items-center">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
        </div>

        {/* Safety Warning */}
        <div className="px-6 py-2 bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-widest text-center">
           AI advice is for reference only. Adhere to BS 7671 at all times.
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 bg-slate-900 border-t border-white/5 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="FAULT DESCRIPTION OR SERVICE QUERY..."
            className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:border-amber-400 outline-none text-[10px] font-bold tracking-widest uppercase"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-amber-400 hover:bg-white disabled:bg-slate-800 text-slate-950 p-3 rounded-xl transition-all shadow-lg shadow-amber-400/10 active:scale-90"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
