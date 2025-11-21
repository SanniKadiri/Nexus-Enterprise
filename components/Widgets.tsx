
import React, { useState } from 'react';
import { Card, Badge, Button, Input } from './UI';
import { MoreVertical, TrendingUp, TrendingDown, Minus, Calendar, User, Clock, GripVertical, ArrowRightLeft, Plus, X, MapPin, CheckCircle2, AlertCircle, Package, Archive, Truck, ClipboardCheck, HeartPulse, FileText, ExternalLink, Activity, AlertTriangle, Sparkles, Loader2, MousePointerClick, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateBusinessContent } from '../services/geminiService';
import { AIRequestType, KPIWidgetProps } from '../types';

// --- 1. KPI Widget ---
export const KPIWidget: React.FC<KPIWidgetProps> = ({ 
  value, 
  label, 
  change, 
  trend = 'neutral',
  variant = 'light',
  trendData = [] 
}) => {
  const isDark = variant === 'dark';
  
  const renderSparkline = () => {
    if (!trendData || trendData.length === 0) return null;
    const min = Math.min(...trendData);
    const max = Math.max(...trendData);
    const height = 40;
    const width = 100;
    const points = trendData.map((val, i) => {
      const x = (i / (trendData.length - 1)) * 100;
      const y = height - ((val - min) / (max - min)) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="mt-4 pt-4 border-t border-gray-700/20 h-12 relative">
        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <polyline 
            points={points} 
            fill="none" 
            stroke={isDark ? '#FFD600' : '#000'} 
            strokeWidth="2" 
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className={`text-[10px] font-mono mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>LAST 6 MONTHS TREND</div>
      </div>
    );
  };

  return (
    <div className={`h-full p-6 border-2 border-black flex flex-col justify-between transition-all ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`text-xs font-bold font-mono uppercase ${isDark ? 'opacity-70' : 'opacity-50'}`}>
          {label}
        </div>
        <Badge variant={trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'neutral'}>
          {change}
        </Badge>
      </div>
      <div>
        <div className="text-5xl font-black tracking-tighter mb-2">{value}</div>
        {!trendData || trendData.length === 0 ? (
          <div className={`w-full h-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="bg-brand-yellow h-full" style={{ width: '70%' }}></div>
          </div>
        ) : renderSparkline()}
      </div>
    </div>
  );
};

// --- 2. Data Table Widget ---
export interface TableRow {
  col1: string;
  col2: string;
  col3: string;
  status?: 'active' | 'pending' | 'complete' | 'error';
}

export interface DataTableWidgetProps {
  headers: string[];
  rows: TableRow[];
  title?: string;
}

export const DataTableWidget: React.FC<DataTableWidgetProps> = ({ headers, rows, title }) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const prompt = `Analyze this table data: Headers: ${headers.join(', ')}. Rows: ${JSON.stringify(rows)}. Provide a brief strategic summary of the activity.`;
    const summary = await generateBusinessContent(prompt, AIRequestType.SUMMARIZE);
    setAiSummary(summary);
    setIsGenerating(false);
  };

  return (
    <div className="h-full bg-white border-2 border-black flex flex-col relative">
       <div className="p-4 border-b-2 border-black bg-gray-50 flex justify-between items-center">
          <div className="flex gap-2 items-center">
             <div className="flex gap-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
             </div>
             <Button 
               variant="ghost" 
               size="sm" 
               className="font-mono text-[10px] h-auto py-1 flex items-center gap-1 border border-gray-300 hover:border-black bg-white"
               onClick={handleGenerateSummary}
               disabled={isGenerating}
             >
               {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} className="text-brand-yellow fill-brand-yellow" />}
               {isGenerating ? 'ANALYZING...' : 'AI_INSIGHTS'}
             </Button>
          </div>
          
          {selectedRow !== null && (
             <div className="animate-fade-in-up flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-gray-500 hidden sm:inline">Item Selected</span>
                <Button size="sm" variant="primary" className="py-1 text-xs h-auto">
                   Action Details
                </Button>
             </div>
          )}
       </div>
       
       {/* AI Summary Overlay */}
       {aiSummary && (
         <div className="p-4 bg-brand-yellow/20 border-b-2 border-black text-sm font-mono relative">
            <button onClick={() => setAiSummary(null)} className="absolute top-2 right-2 hover:bg-black hover:text-white p-1"><X size={14}/></button>
            <strong className="block mb-1 uppercase">✨ AI Analysis:</strong>
            <ReactMarkdown>{aiSummary}</ReactMarkdown>
         </div>
       )}

       <div className="overflow-x-auto flex-1 custom-scrollbar">
         <table className="w-full text-left text-sm">
            <thead className="bg-white text-black font-black uppercase tracking-wider text-xs border-b-2 border-black">
               <tr>
                  {headers.map((h, i) => <th key={i} className="p-4 border-r border-gray-200 last:border-0">{h}</th>)}
               </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100 font-mono text-xs">
               {rows.map((row, i) => (
                  <tr 
                    key={i} 
                    onClick={() => setSelectedRow(i === selectedRow ? null : i)}
                    className={`transition-all cursor-pointer ${selectedRow === i ? 'bg-brand-yellow border-l-4 border-l-black' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                  >
                     <td className="p-4 font-bold">{row.col1}</td>
                     <td className="p-4">
                        {row.status ? (
                           <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase ${
                              selectedRow === i ? 'bg-black text-white border-black' :
                              row.status === 'complete' ? 'bg-green-100 border-green-400 text-green-800' :
                              row.status === 'active' ? 'bg-blue-100 border-blue-400 text-blue-800' :
                              'bg-gray-100 border-gray-300 text-gray-500'
                           }`}>{row.status}</span>
                        ) : row.col2}
                     </td>
                     <td className="p-4 opacity-70">{row.col3}</td>
                  </tr>
               ))}
            </tbody>
         </table>
       </div>
    </div>
  );
};

// --- 3. Chart Placeholder Widget ---
export interface ChartPlaceholderProps { type: 'line' | 'bar' }

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ type }) => {
  return (
    <div className="h-full bg-white border-2 border-black p-6 flex flex-col relative overflow-hidden">
       <div className="absolute top-4 right-4 flex gap-2">
          <div className="w-2 h-8 bg-black/10"></div>
          <div className="w-2 h-8 bg-black/10"></div>
       </div>
       <div className="flex-1 flex items-end gap-1 mt-8">
          {[40, 60, 30, 80, 50, 90, 70, 40, 60, 80, 50, 70].map((h, i) => (
             <div 
               key={i} 
               style={{ height: `${h}%` }} 
               className={`flex-1 border-t-2 border-x border-black transition-all duration-500 hover:bg-brand-yellow ${type === 'line' ? 'bg-transparent border-x-0 border-t-4 skew-y-12' : 'bg-gray-100'}`}
             ></div>
          ))}
       </div>
       <div className="h-px bg-black w-full mt-0"></div>
       <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-400">
          <span>JAN</span>
          <span>DEC</span>
       </div>
    </div>
  );
};

// --- 4. Text Block Widget ---
export interface TextBlockWidgetProps {
  content: string;
}

export const TextBlockWidget: React.FC<TextBlockWidgetProps> = ({ content }) => {
  return (
    <div className="h-full bg-white border-2 border-transparent p-2">
      <div className="prose prose-sm max-w-none font-sans">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

// --- 5. Form Builder Widget ---
export interface FormBuilderWidgetProps {
  fields: string[];
  submitLabel?: string;
  readOnly?: boolean;
}

export const FormBuilderWidget: React.FC<FormBuilderWidgetProps> = ({ fields, submitLabel = 'Submit', readOnly = false }) => {
  return (
    <div className="h-full bg-white border-2 border-black p-6 flex flex-col justify-center relative">
      {readOnly && (
         <div className="absolute inset-0 bg-gray-100/50 z-10 flex items-center justify-center cursor-not-allowed">
            <div className="bg-white border border-black px-3 py-1 text-xs font-bold uppercase shadow-sm rotate-12 text-gray-500 flex items-center gap-2">
               <Lock size={12} /> Read Only
            </div>
         </div>
      )}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field, idx) => (
          <Input key={idx} label={field} placeholder={`Enter ${field.toLowerCase()}...`} disabled={readOnly} />
        ))}
        <div className="pt-2">
           <Button size="sm" className="w-full" disabled={readOnly}>{submitLabel}</Button>
        </div>
      </form>
    </div>
  );
};

// --- 6. Kanban Board Widget ---
export interface KanbanWidgetProps {
  columns?: string[];
  readOnly?: boolean;
}

export const KanbanWidget: React.FC<KanbanWidgetProps> = ({ columns = ['To Do', 'In Progress', 'Done'], readOnly = false }) => {
  return (
    <div className="h-full bg-white border-2 border-black flex flex-col overflow-hidden relative">
      {readOnly && (
         <div className="absolute top-2 right-2 z-20">
            <div className="bg-white border border-black px-2 py-0.5 text-[10px] font-bold uppercase flex items-center gap-1 text-gray-400">
               <Lock size={10} /> View Only
            </div>
         </div>
      )}
      <div className="p-3 border-b-2 border-black bg-gray-50 text-xs font-bold uppercase tracking-widest">
        Project_Tracker_v1
      </div>
      <div className="flex-1 flex overflow-x-auto p-4 gap-4 custom-scrollbar">
        {columns.map((col, i) => (
          <div key={i} className="min-w-[200px] w-1/3 flex flex-col bg-gray-50 border border-gray-200 h-full">
             <div className="p-2 font-bold text-xs uppercase border-b border-gray-200 flex justify-between items-center bg-white">
               {col}
               <span className="bg-gray-200 px-1.5 py-0.5 rounded-none text-[10px]">{i + 1}</span>
             </div>
             <div className="p-2 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
               {/* Mock Tasks */}
               {[1, 2].map(task => (
                 <div 
                   key={task} 
                   className={`bg-white border border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] transition-all ${
                     readOnly ? 'opacity-80 cursor-default' : 'hover:shadow-[4px_4px_0px_0px_#000] cursor-grab active:cursor-grabbing'
                   }`}
                 >
                    <div className="text-[10px] text-gray-400 font-mono mb-1">TASK-{i}{task}</div>
                    <div className="text-xs font-bold leading-tight mb-2">Update documentation for Q{task} release</div>
                    <div className="flex justify-between items-center">
                       <div className="w-4 h-4 bg-brand-yellow rounded-full border border-black text-[8px] flex items-center justify-center font-bold">JD</div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 7. Team Grid Widget ---
export interface TeamGridWidgetProps {
  limit?: number;
}

export const TeamGridWidget: React.FC<TeamGridWidgetProps> = ({ limit = 6 }) => {
  const members = [
    { name: 'Alex Chen', role: 'DevOps', status: 'online' },
    { name: 'Sarah Jones', role: 'Product', status: 'away' },
    { name: 'Mike Ross', role: 'Design', status: 'online' },
    { name: 'Jessica L', role: 'Legal', status: 'offline' },
    { name: 'Harvey S', role: 'Sales', status: 'busy' },
    { name: 'Donna P', role: 'Admin', status: 'online' },
  ];

  return (
    <div className="h-full bg-white border-2 border-black p-4 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.slice(0, limit).map((m, i) => (
          <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 hover:border-black hover:bg-gray-50 transition-colors">
             <div className="relative">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold border-2 border-transparent">
                  {m.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white ${
                  m.status === 'online' ? 'bg-green-500' :
                  m.status === 'away' ? 'bg-yellow-500' :
                  m.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                }`}></div>
             </div>
             <div>
                <div className="font-bold text-sm leading-none">{m.name}</div>
                <div className="text-xs text-gray-500 font-mono mt-1 uppercase">{m.role}</div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 8. Timeline Widget ---
export interface TimelineWidgetProps {
  title?: string;
}

export const TimelineWidget: React.FC<TimelineWidgetProps> = ({ title = 'Audit Log' }) => {
  const events = [
    { time: '10:42 AM', event: 'Deploy Triggered', user: 'System' },
    { time: '09:15 AM', event: 'Config Updated', user: 'Admin' },
    { time: 'Yesterday', event: 'New User Added', user: 'Jane D' },
  ];

  return (
    <div className="h-full bg-white border-2 border-black p-6">
       <div className="relative border-l-2 border-gray-200 ml-2 space-y-8">
          {events.map((e, i) => (
            <div key={i} className="relative pl-6 group">
               <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-gray-300 rounded-full group-hover:border-black group-hover:bg-brand-yellow transition-colors"></div>
               <div className="flex flex-col">
                 <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">{e.time}</span>
                 <span className="font-bold text-sm">{e.event}</span>
                 <span className="text-xs text-gray-500 mt-1">By {e.user}</span>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

// --- 9. Relationship Widget (Many-to-Many) ---
export interface RelationshipWidgetProps {
  leftTitle?: string;
  rightTitle?: string;
  leftItems?: string[];
  rightItems?: string[];
}

export const RelationshipWidget: React.FC<RelationshipWidgetProps> = ({ 
  leftTitle = 'Available', 
  rightTitle = 'Assigned',
  leftItems = ['User A', 'User B', 'User C'],
  rightItems = ['Project X', 'Project Y']
}) => {
  // Local state for demo interaction
  const [left, setLeft] = useState(leftItems);
  const [right, setRight] = useState(rightItems);

  const moveRight = (item: string) => {
    setLeft(left.filter(i => i !== item));
    setRight([...right, item]);
  };

  const moveLeft = (item: string) => {
    setRight(right.filter(i => i !== item));
    setLeft([...left, item]);
  };

  return (
    <div className="h-full bg-white border-2 border-black flex flex-col">
      <div className="flex-1 flex divide-x-2 divide-black h-full">
        {/* Left Column */}
        <div className="flex-1 flex flex-col p-4">
          <div className="text-xs font-bold uppercase mb-3 flex justify-between items-center">
            {leftTitle}
            <Badge>{left.length}</Badge>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
            {left.map(item => (
              <div key={item} className="flex justify-between items-center p-2 border border-gray-200 hover:bg-gray-50 hover:border-black group cursor-pointer" onClick={() => moveRight(item)}>
                <span className="text-sm font-bold">{item}</span>
                <Plus size={14} className="opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Center (Visual only for desktop width) */}
        <div className="hidden md:flex flex-col justify-center items-center px-2 bg-gray-50">
           <ArrowRightLeft size={16} className="text-gray-400" />
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col p-4">
          <div className="text-xs font-bold uppercase mb-3 flex justify-between items-center">
             {rightTitle}
             <Badge variant="success">{right.length}</Badge>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
             {right.map(item => (
              <div key={item} className="flex justify-between items-center p-2 border border-gray-200 bg-brand-yellow/10 hover:bg-red-50 hover:border-red-500 group cursor-pointer" onClick={() => moveLeft(item)}>
                <span className="text-sm font-bold">{item}</span>
                <X size={14} className="opacity-0 group-hover:opacity-100 text-red-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 10. Calendar Widget (HR / Shift / Holiday) ---
export interface CalendarWidgetProps {
  events?: { date: string; title: string; type: 'holiday' | 'shift' | 'meeting' }[];
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ events = [] }) => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const today = 14;

  return (
    <div className="h-full bg-white border-2 border-black p-4 flex flex-col">
       <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
         <span className="font-black text-lg uppercase">OCTOBER 2024</span>
         <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="py-1 px-2">&lt;</Button>
            <Button variant="ghost" size="sm" className="py-1 px-2">&gt;</Button>
         </div>
       </div>
       <div className="flex-1 grid grid-cols-7 gap-1">
          {['S','M','T','W','T','F','S'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400">{d}</div>
          ))}
          {days.map(d => (
            <div key={d} className={`relative p-1 min-h-[30px] border border-gray-100 hover:border-black transition-colors ${d === today ? 'bg-brand-yellow/20' : ''}`}>
               <span className={`text-xs font-mono ${d === today ? 'font-bold text-black' : 'text-gray-500'}`}>{d}</span>
               {/* Mock Events */}
               {d === 4 && <div className="mt-1 h-1.5 w-full bg-blue-400"></div>}
               {d === 12 && <div className="mt-1 h-1.5 w-full bg-red-400"></div>}
               {d === 25 && <div className="mt-1 h-1.5 w-full bg-green-400"></div>}
            </div>
          ))}
       </div>
       <div className="mt-2 flex gap-3 text-[10px] font-bold uppercase">
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-400"></div> Shift</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-400"></div> Holiday</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400"></div> Review</div>
       </div>
    </div>
  );
};

// --- 11. Process Flow Widget (Manufacturing / Repair) ---
export interface ProcessFlowWidgetProps {
  steps: { label: string; status: 'complete' | 'current' | 'pending' }[];
}

export const ProcessFlowWidget: React.FC<ProcessFlowWidgetProps> = ({ 
  steps = [{label: 'Intake', status:'complete'}, {label: 'Inspection', status:'current'}, {label: 'Repair', status:'pending'}, {label: 'QC', status:'pending'}] 
}) => {
  return (
    <div className="h-full bg-white border-2 border-black p-6 flex items-center overflow-x-auto custom-scrollbar">
       <div className="flex items-center min-w-max">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
               <div className="flex flex-col items-center gap-2 relative group">
                  <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-bold transition-all duration-300 ${
                    step.status === 'complete' ? 'bg-black text-white' :
                    step.status === 'current' ? 'bg-brand-yellow text-black scale-110 shadow-[4px_4px_0px_0px_#000]' :
                    'bg-white text-gray-300'
                  }`}>
                     {step.status === 'complete' ? <CheckCircle2 size={18} /> : i + 1}
                  </div>
                  <div className={`text-xs font-bold uppercase absolute -bottom-8 whitespace-nowrap ${step.status === 'current' ? 'text-black' : 'text-gray-400'}`}>
                    {step.label}
                  </div>
               </div>
               {i < steps.length - 1 && (
                 <div className={`w-16 h-1 mx-2 ${step.status === 'complete' ? 'bg-black' : 'bg-gray-200'}`}></div>
               )}
            </React.Fragment>
          ))}
       </div>
    </div>
  );
};

// --- 12. Inventory Grid Widget (Warehouse / Asset) ---
export interface InventoryGridWidgetProps {
  items: { name: string; stock: number; max: number; sku: string }[];
}

export const InventoryGridWidget: React.FC<InventoryGridWidgetProps> = ({
  items = [
    { name: 'Main Logic Board', stock: 45, max: 100, sku: 'MLB-X1' },
    { name: 'Thermal Paste', stock: 12, max: 200, sku: 'TH-P5' },
    { name: 'Chassis A4', stock: 88, max: 90, sku: 'CH-A4' },
    { name: 'Power Unit', stock: 2, max: 50, sku: 'PSU-500' }
  ]
}) => {
  return (
    <div className="h-full bg-white border-2 border-black flex flex-col">
       <div className="p-3 border-b-2 border-black bg-gray-50 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"><Package size={14}/> Inventory_Level</span>
          <Badge variant="neutral">WAREHOUSE A</Badge>
       </div>
       <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {items.map((item, i) => {
            const percentage = Math.min(100, (item.stock / item.max) * 100);
            const isLow = percentage < 20;
            
            return (
              <div key={i} className={`p-3 border-2 ${isLow ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'} hover:border-black transition-all group`}>
                 <div className="flex justify-between mb-2">
                    <div>
                       <div className="font-bold text-sm leading-none">{item.name}</div>
                       <div className="text-[10px] font-mono text-gray-500 mt-1">SKU: {item.sku}</div>
                    </div>
                    <div className={`text-lg font-black ${isLow ? 'text-red-600' : 'text-black'}`}>{item.stock}</div>
                 </div>
                 <div className="w-full h-2 bg-gray-200 border border-black overflow-hidden">
                    <div 
                      className={`h-full ${isLow ? 'bg-red-500 striped-bg' : 'bg-brand-yellow'}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                 </div>
              </div>
            );
          })}
       </div>
    </div>
  );
};

// --- 13. Status Board Widget (Machines / Servers / Rooms) ---
export interface StatusBoardWidgetProps {
  items: { label: string; status: 'ok' | 'warn' | 'error' }[];
}

export const StatusBoardWidget: React.FC<StatusBoardWidgetProps> = ({
  items = [
    { label: 'Server 01', status: 'ok' },
    { label: 'Server 02', status: 'ok' },
    { label: 'Server 03', status: 'warn' },
    { label: 'Backup', status: 'ok' },
    { label: 'Proxy A', status: 'error' },
    { label: 'Proxy B', status: 'ok' }
  ]
}) => {
  return (
    <div className="h-full bg-black border-2 border-black p-4">
       <div className="grid grid-cols-3 gap-3 h-full content-start">
          {items.map((item, i) => (
             <div key={i} className="aspect-square bg-gray-900 border border-gray-700 flex flex-col items-center justify-center p-2 text-center hover:bg-gray-800 transition-colors">
                <div className={`w-3 h-3 rounded-full mb-2 ${
                   item.status === 'ok' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                   item.status === 'warn' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse' :
                   'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                }`}></div>
                <div className="text-[10px] font-mono text-gray-400 uppercase break-all leading-tight">{item.label}</div>
             </div>
          ))}
       </div>
    </div>
  );
};

// --- 14. Map View Widget (Logistics) ---
export interface MapViewWidgetProps {
  locationName?: string;
}

export const MapViewWidget: React.FC<MapViewWidgetProps> = ({ locationName = 'San Francisco HQ' }) => {
  return (
    <div className="h-full bg-[#f0f0f0] border-2 border-black relative overflow-hidden group">
       {/* Abstract Grid Map */}
       <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
       }}></div>
       
       {/* Decorative Route Line */}
       <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M 50 150 Q 150 50 250 100 T 400 150" stroke="black" strokeWidth="2" fill="none" strokeDasharray="4 4" />
       </svg>

       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <MapPin className="text-red-500 fill-red-500 drop-shadow-md animate-bounce" size={32} />
          <div className="bg-black text-white text-[10px] font-bold px-2 py-1 mt-1 uppercase">{locationName}</div>
       </div>

       <div className="absolute bottom-2 left-2 bg-white border border-black p-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold">
             <Truck size={14} />
             <span>IN TRANSIT: 4</span>
          </div>
       </div>
    </div>
  );
};

// --- 15. Service Ticket Widget (CRM / Repair) ---
export interface ServiceTicketWidgetProps {
  customer: string;
  issue: string;
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
}

export const ServiceTicketWidget: React.FC<ServiceTicketWidgetProps> = ({ 
  customer = 'Acme Corp', 
  issue = 'Hydraulic Press Leaking', 
  status = 'open', 
  priority = 'high' 
}) => {
  return (
    <div className="h-full bg-white border-2 border-black p-0 flex flex-col relative overflow-hidden">
       <div className={`absolute top-0 right-0 p-2 bg-black text-white text-[10px] font-bold uppercase`}>
         {priority}_PRIORITY
       </div>
       <div className="p-6 border-b-2 border-black bg-gray-50">
         <div className="text-xs font-bold text-gray-500 uppercase mb-1">Service Ticket #4921</div>
         <h3 className="text-xl font-black leading-tight">{issue}</h3>
       </div>
       <div className="p-6 flex-1 flex flex-col gap-4">
         <div>
            <div className="text-xs font-bold uppercase text-gray-400">Customer</div>
            <div className="font-bold text-lg">{customer}</div>
         </div>
         <div>
            <div className="text-xs font-bold uppercase text-gray-400">Status</div>
            <div className="flex items-center gap-2 mt-1">
               <span className={`w-3 h-3 rounded-full border border-black ${status === 'open' ? 'bg-red-500' : status === 'pending' ? 'bg-yellow-400' : 'bg-green-500'}`}></span>
               <span className="font-bold uppercase">{status}</span>
            </div>
         </div>
         <div className="mt-auto pt-4">
            <Button size="sm" className="w-full">UPDATE TICKET</Button>
         </div>
       </div>
    </div>
  );
};

// --- 16. Patient Vitals Widget (Healthcare) ---
export interface PatientVitalsWidgetProps {
  patientName: string;
  bpm: number;
  temp: number;
  spo2: number;
}

export const PatientVitalsWidget: React.FC<PatientVitalsWidgetProps> = ({
  patientName = 'John Doe', bpm = 72, temp = 98.6, spo2 = 98
}) => {
  return (
    <div className="h-full bg-black text-white border-2 border-black flex flex-col">
       <div className="p-3 border-b border-gray-800 flex justify-between items-center">
         <span className="font-mono text-xs text-gray-400 uppercase">ICU_BED_04</span>
         <span className="font-bold text-sm">{patientName}</span>
       </div>
       <div className="flex-1 p-4 grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
             <div className="flex items-center gap-2 text-red-500"><HeartPulse size={18} /> <span className="text-xs font-bold">HR (BPM)</span></div>
             <div className="text-2xl font-mono font-black text-red-500 animate-pulse">{bpm}</div>
          </div>
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
             <div className="flex items-center gap-2 text-blue-400"><Activity size={18} /> <span className="text-xs font-bold">SPO2 %</span></div>
             <div className="text-2xl font-mono font-black text-blue-400">{spo2}</div>
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-yellow-400"><TrendingUp size={18} /> <span className="text-xs font-bold">TEMP (F)</span></div>
             <div className="text-2xl font-mono font-black text-yellow-400">{temp}</div>
          </div>
       </div>
       <div className="h-1 bg-gray-800 w-full overflow-hidden">
          <div className="h-full bg-green-500 w-full animate-[marquee_2s_linear_infinite]"></div>
       </div>
    </div>
  );
};

// --- 17. Resource List Widget (Process / Manuals) ---
export interface ResourceListWidgetProps {
  title: string;
  items: { label: string; type: 'pdf' | 'link' | 'doc' }[];
}

export const ResourceListWidget: React.FC<ResourceListWidgetProps> = ({
  title = 'Safety Protocols',
  items = [{label: 'Fire Safety v2.pdf', type: 'pdf'}, {label: 'OSHA Guidelines', type: 'link'}]
}) => {
  return (
    <div className="h-full bg-white border-2 border-black flex flex-col">
       <div className="p-4 bg-brand-yellow border-b-2 border-black font-black uppercase tracking-tight flex items-center gap-2">
         <FileText size={18} />
         {title}
       </div>
       <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {items.map((item, i) => (
             <div key={i} className="p-3 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_0px_#000] transition-all mb-2 cursor-pointer bg-white flex items-center justify-between group">
                <span className="font-bold text-sm">{item.label}</span>
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
          ))}
       </div>
    </div>
  );
};
