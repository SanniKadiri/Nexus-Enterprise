import React, { useState } from 'react';
import { generateBusinessContent } from '../services/geminiService';
import { AIRequestType } from '../types';
import { Button, Card } from './UI';
import { Sparkles, Send, Loader2, X, Bot, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIWidgetProps {
  onClose?: () => void;
}

export const AIWidget: React.FC<AIWidgetProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AIRequestType>(AIRequestType.INSIGHT);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse(null);
    
    // In a real app, we might combine mode + prompt
    const result = await generateBusinessContent(
      `${mode}: ${prompt}`, 
      mode
    );
    
    setResponse(result);
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-lg shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] border-2 border-black relative bg-white flex flex-col max-h-[85vh] !p-0">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b-2 border-black bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-yellow border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000]">
            <Bot size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-black text-lg uppercase tracking-tight leading-none">Nexus AI</h3>
            <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">Enterprise Consultant</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-black p-1 transition-all">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
        {/* Mode Selection */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {Object.values(AIRequestType).map((t) => (
            <button
              key={t}
              onClick={() => setMode(t)}
              className={`text-xs font-bold px-3 py-1.5 border-2 transition-all uppercase tracking-wider shrink-0 ${
                mode === t 
                  ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_#FFD600] translate-x-[-1px] translate-y-[-1px]' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Input Area */}
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Enter context for ${mode.toLowerCase()}...`}
              className="relative block w-full p-4 bg-white border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all resize-none h-32 text-sm font-medium placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !prompt.trim()}
              size="sm"
              variant="primary"
              className="w-full sm:w-auto"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Send className="mr-2" size={16} />}
              {loading ? 'PROCESSING...' : 'GENERATE'}
            </Button>
          </div>

          {/* Response Area */}
          {response && (
            <div className="mt-8 animate-fade-in-up">
               <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_#000] overflow-hidden">
                 <div className="bg-black text-white px-3 py-2 text-xs font-bold uppercase tracking-widest flex justify-between items-center border-b-2 border-black">
                   <div className="flex items-center gap-2">
                     <Terminal size={14} className="text-brand-yellow" />
                     <span>Analysis_Output</span>
                   </div>
                   <div className="flex gap-1">
                     <div className="w-2 h-2 rounded-full bg-red-500"></div>
                     <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   </div>
                 </div>
                 <div className="p-5 text-sm leading-relaxed prose prose-sm max-w-none font-mono bg-gray-50/30">
                    <ReactMarkdown>{response}</ReactMarkdown>
                 </div>
                 <div className="bg-gray-100 border-t-2 border-black px-3 py-1 text-[10px] font-mono text-right text-gray-500 uppercase">
                    Generated via Gemini-2.5-Flash
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};