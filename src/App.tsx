import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Send, 
  ArrowUp, 
  X, 
  Download, 
  Copy, 
  FileText,
  Battery,
  Cpu,
  Wind,
  Calendar,
  ChevronDown,
  Mail,
  CloudDownload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// --- Types ---
type MessageType = 'ai' | 'user';
type PanelView = 'table' | 'chart';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  options?: string[];
  selectedOption?: string;
  hasPanel?: boolean;
  panelView?: PanelView;
}

// --- Constants ---
const COLORS = {
  bg: '#0F1117',
  main: '#161922',
  panel: '#1C212B',
  accent: '#254EDB',
  border: '#2D333F',
  textDim: '#94A3B8',
};

const CHART_DATA = [
  { name: 'JAN 2022', kw50: 90, kw100: 80 },
  { name: 'DEC 2022', kw50: 85, kw100: 78 },
  { name: 'JAN 2023', kw50: 125, kw100: 95 },
  { name: 'DEC 2023', kw50: 130, kw100: 130 },
  { name: 'JAN 2024', kw50: 122, kw100: 145 },
  { name: 'DEC 2024', kw50: 125, kw100: 200 },
  { name: 'JAN 2025', kw50: 140, kw100: 210 },
  { name: 'DEC 2025', kw50: 145, kw100: 250 },
  { name: 'APR 2026', kw50: 125, kw100: 285 },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome messages from Savvy...\nWhat kind of decision we are making today?',
      options: ['New Feature', 'Cost Reduction', 'Trade-off analysis'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [panelView, setPanelView] = useState<PanelView>('table');
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleOptionClick = (option: string, messageId: string) => {
    // Update the message with the selected option
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, selectedOption: option } : m
    ));

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: option };
    setMessages(prev => [...prev, userMsg]);
    
    setIsTyping(true);
    
    // Simulate AI response based on step
    setTimeout(() => {
      setIsTyping(false);
      if (step === 0) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "Which component we're talking about?",
          options: ['Memory', 'Battery', 'Fan']
        }]);
        setStep(1);
      } else if (step === 1) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "What is the new feature we're thinking for battery"
        }]);
        setInputValue("should we add a 24hr battery to the next gen of EBX?");
        setStep(2);
      }
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    if (step === 2) {
      // Step 2: User asks about 24hr battery
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "For such decision, we would be trading off space for performance. Looking at the data it seems like ebx users unplug their device for a minimum of 8hrs and on avg. 5hrs. Here is a custom report on this point. Could you share more around why we should explore this option?",
          hasPanel: true,
          panelView: 'table'
        }]);
        setInputValue("Management suggested we look into this because a couple of our largest customers mentioned that extended battery life would be valuable for their workflows. They often run devices continuously in field operations and don’t want interruptions.");
        setShowSidePanel(true);
        setPanelView('table');
        setStep(3);
      }, 2000);
    } else if (step === 3) {
      // Step 3: User explains management suggestion
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "I see, we don’t want to lose these big customers. Let’s dig a little deeper. We can analyze whether a 24‑hour battery aligns with broader market needs or if it’s a niche requirement.",
          hasPanel: true,
          panelView: 'chart',
          options: ["create an email with the key info we discussed", "create a report to show to your management"]
        }]);
        setPanelView('chart');
        setShowSidePanel(true);
        setStep(4);
      }, 2000);
    }
  };

  return (
    <div className="flex h-screen w-full bg-brand-bg text-white overflow-hidden">
      {/* --- Sidebar --- */}
      <aside className="w-64 flex-shrink-0 bg-brand-bg border-r border-brand-border flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0ZM16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16C28 22.6274 22.6274 28 16 28Z" fill="#254EDB" fillOpacity="0.2"/>
            <rect x="11" y="4" width="10" height="10" rx="5" fill="#254EDB" />
            <rect x="18" y="11" width="10" height="10" rx="5" fill="#3B82F6" />
            <rect x="11" y="18" width="10" height="10" rx="5" fill="#254EDB" />
            <rect x="4" y="11" width="10" height="10" rx="5" fill="#60A5FA" />
            <rect x="13" y="13" width="6" height="6" rx="1" fill="white" />
          </svg>
          <span className="font-bold text-xl tracking-tight">PM Savvy</span>
        </div>

        <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-brand-border hover:bg-brand-panel transition-colors mb-6 text-sm font-medium">
          <Plus size={16} />
          Ask me anything
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-brand-text-dim uppercase tracking-wider mb-3 px-2">Recent Chats</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-[#2D333F] text-[#74B1FF] text-sm font-medium transition-colors cursor-pointer">
              <span className="truncate">New feature for EBS Battery</span>
              <MoreVertical size={14} className="text-white/40" />
            </div>
            <div className="flex items-center justify-between p-2 px-3 rounded-xl hover:bg-[#2D333F]/50 text-[#74B1FF] text-sm transition-colors cursor-pointer">
              <span className="truncate">Fan decision</span>
              <MoreVertical size={14} className="text-white/20" />
            </div>
          </div>
        </div>
      </aside>

      {/* --- Main Chat Area --- */}
      <main className="flex-1 flex flex-col bg-brand-main relative">
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <div className="max-w-2xl mx-auto space-y-8">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.type === 'user' 
                        ? 'bg-brand-accent text-white rounded-tr-none' 
                        : 'bg-brand-panel text-white/90 rounded-tl-none'
                    }`}
                  >
                      {msg.content.split('\n').map((line, i) => {
                        const triggerTable = 'Here is a custom report on this point.';
                        const triggerChart = 'Let’s dig a little deeper.';
                        
                        let displayLine: React.ReactNode = line;
                        
                        if (line.includes(triggerTable)) {
                          const parts = line.split(triggerTable);
                          displayLine = (
                            <>
                              {parts[0]}{triggerTable}
                              {msg.hasPanel && msg.panelView === 'table' && (
                                <button 
                                  onClick={() => {
                                    if (showSidePanel && panelView === 'table') {
                                      setShowSidePanel(false);
                                    } else {
                                      setPanelView('table');
                                      setShowSidePanel(true);
                                    }
                                  }}
                                  className="option-btn inline-flex items-center gap-1.5 px-2 py-0.5 ml-1.5 rounded-md bg-[#2D333F] text-[10px] font-semibold text-[#74B1FF] hover:brightness-125 transition-all align-middle"
                                >
                                  Ref: Telemetry Metric
                                </button>
                              )}
                              {parts[1]}
                            </>
                          );
                        } else if (line.includes(triggerChart)) {
                          const parts = line.split(triggerChart);
                          displayLine = (
                            <>
                              {parts[0]}{triggerChart}
                              {msg.hasPanel && msg.panelView === 'chart' && (
                                <button 
                                  onClick={() => {
                                    if (showSidePanel && panelView === 'chart') {
                                      setShowSidePanel(false);
                                    } else {
                                      setPanelView('chart');
                                      setShowSidePanel(true);
                                    }
                                  }}
                                  className="option-btn inline-flex items-center gap-1.5 px-2 py-0.5 ml-1.5 rounded-md bg-[#2D333F] text-[10px] font-semibold text-[#74B1FF] hover:brightness-125 transition-all align-middle"
                                >
                                  Ref: Battery Failure Trend
                                </button>
                              )}
                              {parts[1]}
                            </>
                          );
                        }

                        return (
                          <div key={i} className={i > 0 ? 'mt-2' : ''}>
                            {displayLine}
                          </div>
                        );
                      })}
                    </div>

                    {/* Removed old button position */}

                    {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {msg.options.map((opt) => {
                        const isSelected = msg.selectedOption === opt;
                        const hasSelection = !!msg.selectedOption;
                        
                        return (
                          <button
                            key={opt}
                            onClick={() => !hasSelection && handleOptionClick(opt, msg.id)}
                            disabled={hasSelection}
                            className={`option-btn px-4 py-2 rounded-full border text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                              isSelected 
                                ? 'bg-brand-accent border-brand-accent text-white' 
                                : hasSelection
                                  ? 'opacity-30 border-brand-border text-brand-text-dim cursor-not-allowed'
                                  : 'border-brand-border text-white hover:brightness-125'
                            }`}
                          >
                            {opt === "create an email with the key info we discussed" && <Mail size={14} />}
                            {opt === "create a report to show to your management" && <CloudDownload size={14} />}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex items-start"
              >
                <div className="bg-brand-panel p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full typing-dot" />
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full typing-dot" />
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full typing-dot" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* --- Input Area --- */}
        <div className="p-8 pt-0">
          <div className="max-w-2xl mx-auto relative">
            <div className="bg-brand-panel border border-brand-border rounded-xl p-4 flex flex-col gap-2 focus-within:border-brand-accent transition-colors">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Can I help you?"
                className="bg-transparent border-none outline-none resize-none text-sm text-white placeholder:text-brand-text-dim h-24"
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center hover:opacity-90 disabled:opacity-30 transition-all"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- Side Panel --- */}
      <AnimatePresence>
        {showSidePanel && (
          <motion.aside
            initial={{ width: 0, opacity: 0, x: 20 }}
            animate={{ width: 640, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="flex-shrink-0 bg-[#0F1117]/80 backdrop-blur-xl border border-white/10 flex flex-col p-8 overflow-y-auto z-50 shadow-2xl rounded-2xl my-4 mr-4 no-scrollbar"
          >
            <div className="flex items-center justify-between mb-8 min-w-[576px]">
              <h2 className="text-xl font-semibold tracking-tight">
                {panelView === 'table' ? 'Telemetry Metrics' : 'Battery Failure Trend'}
              </h2>
              <div className="flex items-center gap-4">
                {panelView === 'chart' && (
                  <div className="flex items-center gap-6 mr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#A855F7]" />
                      <span className="text-xs text-white/60">50kW</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
                      <span className="text-xs text-white/60">100kW</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors ml-4">
                      <Calendar size={14} className="text-brand-text-dim" />
                      <span className="text-xs text-white/80">Jan 2022 - Apr 2026</span>
                      <ChevronDown size={14} className="text-brand-text-dim" />
                    </div>
                  </div>
                )}
                <button 
                  onClick={() => setShowSidePanel(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={18} className="text-brand-text-dim" />
                </button>
              </div>
            </div>

            {panelView === 'table' ? (
              <>
                <div className="bg-[#1C212B]/40 rounded-xl border border-white/5 p-6 mb-8 min-w-[576px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-brand-text-dim uppercase tracking-widest">Battery Telemetry</span>
                    </div>
                    <div className="flex gap-3">
                      <Copy size={16} className="text-brand-text-dim cursor-pointer hover:text-white transition-colors" />
                      <Download size={16} className="text-brand-text-dim cursor-pointer hover:text-white transition-colors" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6 text-[10px] text-brand-text-dim">
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5">Series <span className="text-white font-medium bg-white/10 px-1.5 rounded">X 8</span></div>
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5">Gen <span className="text-white font-medium bg-white/10 px-1.5 rounded">1</span></div>
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5">Model <span className="text-white font-medium bg-white/10 px-1.5 rounded">ALL</span></div>
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5 ml-auto">Time frame <span className="text-white font-medium bg-white/10 px-1.5 rounded">3 yrs</span></div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead>
                        <tr className="text-brand-text-dim border-b border-white/10">
                          <th className="pb-3 font-semibold uppercase tracking-wider">Type</th>
                          <th className="pb-3 font-semibold uppercase tracking-wider">Field Unit</th>
                          <th className="pb-3 font-semibold uppercase tracking-wider">hrs unplugged</th>
                          <th className="pb-3 font-semibold uppercase tracking-wider">Battery Life</th>
                          <th className="pb-3 font-semibold uppercase tracking-wider">Health</th>
                          <th className="pb-3 font-semibold uppercase tracking-wider">Attach %</th>
                          <th className="pb-3 font-semibold uppercase tracking-wider">BOM Cost</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/90">
                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 font-bold text-sm">50 KW</td>
                          <td className="py-4">1 million</td>
                          <td className="py-4">3.1 hrs</td>
                          <td className="py-4">5hrs</td>
                          <td className="py-4 text-emerald-400 font-medium">Healthy</td>
                          <td className="py-4">20%</td>
                          <td className="py-4">10 USD</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-4 font-bold text-sm">100 KW</td>
                          <td className="py-4">3 million</td>
                          <td className="py-4">2.7 hrs</td>
                          <td className="py-4">10hrs</td>
                          <td className="py-4 text-rose-400 font-semibold">high failure</td>
                          <td className="py-4">80%</td>
                          <td className="py-4">30 USD</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 w-full min-h-[400px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={CHART_DATA}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="color50" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="color100" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#8E9299', fontSize: 10 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#8E9299', fontSize: 10 }}
                      tickFormatter={(val) => `${val}K`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1C212B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="kw50" 
                      stroke="#A855F7" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#color50)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="kw100" 
                      stroke="#0EA5E9" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#color100)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
