import { useState, useEffect, useRef } from 'react';
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
  Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type MessageType = 'ai' | 'user';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  options?: string[];
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

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'user',
      content: 'This is a question asked by user...',
    },
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
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleOptionClick = (option: string) => {
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

    // Simulate final AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "For such decision, we would be trading off space for performance. Looking at the data it seems like ebx users unplug their device for a minimum of 8hrs and on avg. 5hrs. Here is a custom report on this point. Could you share more around why we should explore this option?"
      }]);
      setShowSidePanel(true);
      setStep(3);
    }, 2000);
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
            <div className="flex items-center justify-between p-2 rounded-lg bg-brand-accent/10 text-brand-accent text-sm font-medium border border-brand-accent/20">
              <span className="truncate">New feature for EBS Battery</span>
              <MoreVertical size={14} className="opacity-60" />
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-panel text-brand-text-dim text-sm transition-colors">
              <span className="truncate">Fan decision</span>
              <MoreVertical size={14} className="opacity-40" />
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
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>

                  {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOptionClick(opt)}
                          className="option-btn px-4 py-2 rounded-full border border-brand-border text-xs font-medium hover:bg-brand-accent hover:border-brand-accent transition-all duration-200"
                        >
                          {opt}
                        </button>
                      ))}
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-[480px] flex-shrink-0 bg-brand-bg border-l border-brand-border flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold">Telemetry Metrics</h2>
              <button 
                onClick={() => setShowSidePanel(false)}
                className="p-1 hover:bg-brand-panel rounded transition-colors"
              >
                <X size={20} className="text-brand-text-dim" />
              </button>
            </div>

            <div className="bg-brand-panel rounded-xl border border-brand-border p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-brand-text-dim uppercase">Battery Telemetry</span>
                </div>
                <div className="flex gap-2">
                  <Copy size={14} className="text-brand-text-dim cursor-pointer hover:text-white" />
                  <Download size={14} className="text-brand-text-dim cursor-pointer hover:text-white" />
                </div>
              </div>

              <div className="flex gap-4 mb-4 text-[10px] text-brand-text-dim">
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">Series <span className="text-white">X 8</span></div>
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">Gen <span className="text-white">1</span></div>
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">Model <span className="text-white">ALL</span></div>
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded ml-auto">Time frame <span className="text-white">3 yrs</span></div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="text-brand-text-dim border-b border-brand-border">
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Field Unit</th>
                      <th className="pb-2 font-medium">hrs unplugged</th>
                      <th className="pb-2 font-medium">Battery Life</th>
                      <th className="pb-2 font-medium">Health</th>
                      <th className="pb-2 font-medium">Attach %</th>
                      <th className="pb-2 font-medium">BOM Cost</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/80">
                    <tr className="border-b border-brand-border/50">
                      <td className="py-3 font-bold">50 KW</td>
                      <td className="py-3">1 million</td>
                      <td className="py-3">3.1 hrs</td>
                      <td className="py-3">5hrs</td>
                      <td className="py-3 text-green-400">Healthy</td>
                      <td className="py-3">20%</td>
                      <td className="py-3">10 USD</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold">100 KW</td>
                      <td className="py-3">3 million</td>
                      <td className="py-3">2.7 hrs</td>
                      <td className="py-3">10hrs</td>
                      <td className="py-3 text-red-400 font-medium">high failure</td>
                      <td className="py-3">80%</td>
                      <td className="py-3">30 USD</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-xs text-brand-text-dim leading-relaxed mb-6">
              Test 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answersTest 123 more answers
            </div>

            <div className="bg-brand-panel border border-brand-border rounded-lg p-3 flex items-center gap-3 group cursor-pointer hover:border-brand-accent transition-colors">
              <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center">
                <FileText size={16} className="text-brand-text-dim" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">3D mise global Reports Ipsos_4.29.22.pptx</div>
              </div>
              <Download size={14} className="text-brand-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
