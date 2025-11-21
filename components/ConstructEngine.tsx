
import React, { useState, useEffect, useRef } from 'react';
import { WidgetInstance, WidgetType, KPIWidgetProps } from '../types';
import { 
  KPIWidget, 
  DataTableWidget, 
  ChartPlaceholder, 
  TextBlockWidget, 
  FormBuilderWidget,
  KanbanWidget,
  TeamGridWidget,
  TimelineWidget,
  RelationshipWidget,
  CalendarWidget,
  ProcessFlowWidget,
  InventoryGridWidget,
  StatusBoardWidget,
  MapViewWidget,
  ServiceTicketWidget,
  PatientVitalsWidget,
  ResourceListWidget,
  DataTableWidgetProps, 
  ChartPlaceholderProps,
  TextBlockWidgetProps,
  FormBuilderWidgetProps,
  KanbanWidgetProps,
  RelationshipWidgetProps,
  ProcessFlowWidgetProps,
  InventoryGridWidgetProps,
  StatusBoardWidgetProps,
  MapViewWidgetProps,
  ServiceTicketWidgetProps,
  PatientVitalsWidgetProps,
  ResourceListWidgetProps
} from './Widgets';
import { Button, Modal, Input, Select, Textarea } from './UI';
import { Plus, Move, Trash2, GripHorizontal, Save, RotateCcw, Settings, ChevronLeft, ChevronRight, Type, Table, BarChart, LayoutTemplate, Trello, Users, Clock, Grip, Link2, Calendar, Activity, Package, Map, Server, Wrench, Heart, FileText, AlignJustify, AlignLeft, AlignRight } from 'lucide-react';

interface ConstructEngineProps {
  layout: WidgetInstance[];
  onLayoutChange: (newLayout: WidgetInstance[]) => void;
  isEditMode: boolean;
  isReadOnly?: boolean;
}

export const ConstructEngine: React.FC<ConstructEngineProps> = ({ layout, onLayoutChange, isEditMode, isReadOnly = false }) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);

  // --- DRAG AND DROP LOGIC ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    
    // --- CUSTOM GHOST IMAGE ---
    // Clone the target to make a visible ghost
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const ghost = target.cloneNode(true) as HTMLElement;
    
    // Style the ghost
    ghost.style.position = 'absolute';
    ghost.style.top = '-9999px';
    ghost.style.left = '-9999px';
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.opacity = '0.9';
    ghost.style.transform = 'scale(0.95) rotate(2deg)'; 
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';
    ghost.style.background = '#fff';
    ghost.style.border = '4px solid #FFD600'; // Yellow border for visibility
    ghost.style.boxShadow = '15px 15px 0px 0px rgba(0,0,0,0.3)';
    
    // Append to body so setDragImage can pick it up
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, rect.width / 2, rect.height / 2);
    
    // Cleanup after a short delay (browser needs it momentarily)
    setTimeout(() => {
      document.body.removeChild(ghost);
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    // Swap items in the layout array
    const newLayout = [...layout];
    const draggedItem = newLayout[draggedItemIndex];
    newLayout.splice(draggedItemIndex, 1);
    newLayout.splice(index, 0, draggedItem);
    
    setDraggedItemIndex(index);
    onLayoutChange(newLayout);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  // --- WIDGET ACTIONS ---
  const removeWidget = (id: string) => {
    onLayoutChange(layout.filter(w => w.id !== id));
  };

  const updateWidgetConfig = (id: string, newConfig: any, newTitle?: string) => {
    const updatedLayout = layout.map(w => {
      if (w.id === id) {
        return { ...w, config: { ...w.config, ...newConfig }, title: newTitle || w.title };
      }
      return w;
    });
    onLayoutChange(updatedLayout);
  };

  const handleResize = (id: string, delta: number) => {
    const updatedLayout = layout.map(w => {
      if (w.id === id) {
        const newSpan = Math.min(3, Math.max(1, w.colSpan + delta)) as 1 | 2 | 3;
        return { ...w, colSpan: newSpan };
      }
      return w;
    });
    onLayoutChange(updatedLayout);
  };

  // --- COMPONENT MAPPING ---
  const renderWidgetComponent = (widget: WidgetInstance) => {
    switch (widget.type) {
      case 'KPI_CARD':
        return <KPIWidget {...(widget.config as KPIWidgetProps)} />;
      case 'DATA_TABLE':
        return <DataTableWidget {...(widget.config as DataTableWidgetProps)} />;
      case 'CHART_PLACEHOLDER':
        return <ChartPlaceholder {...(widget.config as ChartPlaceholderProps)} />;
      case 'TEXT_BLOCK':
        return <TextBlockWidget {...(widget.config as TextBlockWidgetProps)} />;
      case 'FORM_BUILDER':
        return <FormBuilderWidget {...(widget.config as FormBuilderWidgetProps)} readOnly={isReadOnly} />;
      case 'KANBAN_BOARD':
        return <KanbanWidget {...(widget.config as KanbanWidgetProps)} readOnly={isReadOnly} />;
      case 'TEAM_GRID':
        return <TeamGridWidget />;
      case 'TIMELINE':
        return <TimelineWidget />;
      case 'RELATIONSHIP':
        return <RelationshipWidget {...(widget.config as RelationshipWidgetProps)} />;
      case 'CALENDAR':
        return <CalendarWidget />;
      case 'PROCESS_FLOW':
        return <ProcessFlowWidget {...(widget.config as ProcessFlowWidgetProps)} />;
      case 'INVENTORY_GRID':
        return <InventoryGridWidget {...(widget.config as InventoryGridWidgetProps)} />;
      case 'STATUS_BOARD':
        return <StatusBoardWidget {...(widget.config as StatusBoardWidgetProps)} />;
      case 'MAP_VIEW':
        return <MapViewWidget {...(widget.config as MapViewWidgetProps)} />;
      case 'SERVICE_TICKET':
        return <ServiceTicketWidget {...(widget.config as ServiceTicketWidgetProps)} />;
      case 'PATIENT_VITALS':
        return <PatientVitalsWidget {...(widget.config as PatientVitalsWidgetProps)} />;
      case 'RESOURCE_LIST':
        return <ResourceListWidget {...(widget.config as ResourceListWidgetProps)} />;
      default:
        return <div className="p-4 bg-red-100 border border-red-500 text-red-500 font-mono text-xs">UNKNOWN_WIDGET_TYPE: {widget.type}</div>;
    }
  };

  // --- CONFIG MODAL HELPERS ---
  const getWidgetToEdit = () => layout.find(w => w.id === editingWidgetId);

  return (
    <div className={`transition-all duration-300 ${isEditMode ? 'scale-[0.98] origin-top' : ''}`}>
      
      {/* Config Editor Modal */}
      {editingWidgetId && (
        <WidgetConfigModal 
          widget={getWidgetToEdit()!} 
          isOpen={!!editingWidgetId} 
          onClose={() => setEditingWidgetId(null)} 
          onSave={(id, cfg, title) => {
            updateWidgetConfig(id, cfg, title);
            setEditingWidgetId(null);
          }}
        />
      )}

      {/* Render Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {layout.map((widget, index) => (
          <div
            key={widget.id}
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative transition-all duration-300 flex flex-col ${
              isEditMode 
                ? 'cursor-move border-2 border-dashed border-brand-yellow bg-yellow-50/50 p-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]' 
                : ''
            } ${
              // Determine Grid Span CSS
              widget.colSpan === 3 ? 'md:col-span-3' : 
              widget.colSpan === 2 ? 'md:col-span-2' : 
              'md:col-span-1'
            } ${
               draggedItemIndex === index ? 'opacity-30 scale-95' : 'opacity-100'
            }`}
          >
            {/* Edit Overlay Tools */}
            {isEditMode && (
              <div className="absolute -top-4 -right-2 z-20 flex gap-1 items-center animate-[fadeInUp_0.2s_ease-out]">
                 {/* Type Label */}
                <div className="bg-black text-white p-1.5 text-[10px] font-bold font-mono uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] mr-1">
                   {widget.type}
                </div>
                
                {/* Resize Controls */}
                <div className="flex bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] mr-1">
                  <button 
                    onClick={() => handleResize(widget.id, -1)} 
                    disabled={widget.colSpan <= 1}
                    className="p-1 hover:bg-gray-100 disabled:opacity-30 border-r border-gray-200"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="px-2 text-[10px] font-black flex items-center bg-gray-50">
                    {widget.colSpan}x
                  </div>
                  <button 
                    onClick={() => handleResize(widget.id, 1)}
                    disabled={widget.colSpan >= 3}
                    className="p-1 hover:bg-gray-100 disabled:opacity-30 border-l border-gray-200"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Edit Config */}
                <button 
                   onClick={() => setEditingWidgetId(widget.id)}
                   className="bg-brand-yellow text-black border-2 border-black p-1.5 hover:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                   title="Configure Widget"
                >
                  <Settings size={16} />
                </button>
                
                {/* Delete */}
                <button 
                   onClick={() => removeWidget(widget.id)}
                   className="bg-red-500 border-2 border-black text-white p-1.5 hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                   title="Remove Widget"
                >
                  <Trash2 size={16} />
                </button>

                {/* Enhanced Grip Handle */}
                <div 
                  className="bg-brand-yellow border-2 border-black text-black p-1.5 cursor-move shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group relative"
                  title="Drag to reorder"
                >
                   <Grip size={16} strokeWidth={2.5} />
                   <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-bold z-30">Drag to reorder</span>
                </div>
              </div>
            )}
            
            {/* The Actual Component */}
            <div className={`h-full flex-1 ${isEditMode ? 'pointer-events-none opacity-80 select-none' : ''}`}>
               {widget.title && isEditMode && (
                 <div className="mb-2 text-xs font-bold uppercase text-brand-black/50 flex items-center gap-2">
                    <span className="w-2 h-2 bg-black rounded-full"></span>
                    {widget.title}
                 </div>
               )}
               {renderWidgetComponent(widget)}
            </div>
          </div>
        ))}
        
        {/* Dropzone / Add New Placeholder */}
        {isEditMode && (
           <div className="md:col-span-1 min-h-[200px] border-2 border-dashed border-gray-300 rounded-none flex flex-col items-center justify-center bg-gray-50 text-gray-400 hover:border-brand-yellow hover:text-brand-black hover:bg-brand-yellow/10 transition-all cursor-pointer group">
              <Plus size={40} className="mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold uppercase text-sm">Drag New Brick Here</span>
           </div>
        )}
      </div>
    </div>
  );
};

// --- WIDGET CONFIG MODAL ---
interface WidgetConfigModalProps {
  widget: WidgetInstance;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, newConfig: any, title: string) => void;
}

const WidgetConfigModal: React.FC<WidgetConfigModalProps> = ({ widget, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState(widget.title);
  // Deep copy config to local state
  const [config, setConfig] = useState<any>(JSON.parse(JSON.stringify(widget.config)));

  const handleSave = () => {
    onSave(widget.id, config, title);
  };

  const renderForm = () => {
    switch (widget.type) {
      case 'KPI_CARD':
        return (
          <>
            <Input label="Metric Label" value={config.label} onChange={e => setConfig({...config, label: e.target.value})} />
            <Input label="Metric Value" value={config.value} onChange={e => setConfig({...config, value: e.target.value})} />
            <Input label="Change Indicator" value={config.change} onChange={e => setConfig({...config, change: e.target.value})} />
            <Select 
              label="Trend Direction" 
              value={config.trend} 
              onChange={e => setConfig({...config, trend: e.target.value})}
              options={[{value: 'up', label: 'Up (Good)'}, {value: 'down', label: 'Down (Bad)'}, {value: 'neutral', label: 'Neutral'}]}
            />
             <Select 
              label="Visual Variant" 
              value={config.variant} 
              onChange={e => setConfig({...config, variant: e.target.value})}
              options={[{value: 'light', label: 'Light Mode'}, {value: 'dark', label: 'Dark Mode'}]}
            />
            <Input 
              label="Trend Data (Comma separated numbers for sparkline)" 
              placeholder="10, 20, 15, 30"
              value={config.trendData ? config.trendData.join(', ') : ''}
              onChange={e => {
                const nums = e.target.value.split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n));
                setConfig({...config, trendData: nums});
              }}
            />
          </>
        );
      case 'TEXT_BLOCK':
        return (
          <Textarea 
            label="Content (Markdown Supported)" 
            value={config.content} 
            onChange={e => setConfig({...config, content: e.target.value})} 
            rows={10}
          />
        );
      case 'FORM_BUILDER':
        return (
          <>
            <Input 
               label="Fields (Comma Separated)" 
               value={config.fields ? config.fields.join(', ') : ''} 
               onChange={e => setConfig({...config, fields: e.target.value.split(',').map((s: string) => s.trim())})} 
            />
            <Input label="Submit Button Label" value={config.submitLabel} onChange={e => setConfig({...config, submitLabel: e.target.value})} />
          </>
        );
      case 'DATA_TABLE':
        return (
          <>
             <Input 
                label="Headers (Comma Separated)" 
                value={config.headers ? config.headers.join(', ') : ''} 
                onChange={e => setConfig({...config, headers: e.target.value.split(',').map((s: string) => s.trim())})} 
             />
             <Textarea
                label="Row Data (CSV Format: Col1, Col2, Col3... New Line for new row)"
                rows={6}
                placeholder="Project A, In Progress, Today\nProject B, Complete, Yesterday"
                defaultValue={config.rows ? config.rows.map((r: any) => Object.values(r).filter(v => typeof v === 'string').join(', ')).join('\n') : ''}
                onChange={e => {
                   const lines = e.target.value.split('\n');
                   const newRows = lines.map((line: string) => {
                      const cols = line.split(',').map((s: string) => s.trim());
                      return { 
                        col1: cols[0] || '', 
                        col2: cols[1] || '', 
                        col3: cols[2] || '',
                        status: cols[1] === 'In Progress' ? 'active' : cols[1] === 'Complete' ? 'complete' : 'pending'
                      };
                   });
                   setConfig({...config, rows: newRows});
                }}
             />
          </>
        );
      case 'KANBAN_BOARD':
        return (
           <Input 
              label="Columns (Comma Separated)" 
              value={config.columns ? config.columns.join(', ') : ''} 
              onChange={e => setConfig({...config, columns: e.target.value.split(',').map((s: string) => s.trim())})} 
           />
        );
      case 'RELATIONSHIP':
        return (
          <>
            <Input label="Left Column Title" value={config.leftTitle} onChange={e => setConfig({...config, leftTitle: e.target.value})} />
            <Input label="Right Column Title" value={config.rightTitle} onChange={e => setConfig({...config, rightTitle: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
               <Textarea 
                 label="Available Items (Lines)" 
                 value={config.leftItems ? config.leftItems.join('\n') : ''} 
                 onChange={e => setConfig({...config, leftItems: e.target.value.split('\n').filter((s: string) => s.trim() !== '')})} 
               />
               <Textarea 
                 label="Assigned Items (Lines)" 
                 value={config.rightItems ? config.rightItems.join('\n') : ''} 
                 onChange={e => setConfig({...config, rightItems: e.target.value.split('\n').filter((s: string) => s.trim() !== '')})} 
               />
            </div>
          </>
        );
      case 'PROCESS_FLOW':
        return (
           <Textarea 
              label="Steps (One per line)" 
              placeholder="Step Name"
              value={config.steps ? config.steps.map((s: any) => s.label).join('\n') : ''}
              onChange={e => {
                const steps = e.target.value.split('\n').map((label: string, i: number) => ({
                  label: label.trim(),
                  status: i === 0 ? 'complete' : i === 1 ? 'current' : 'pending' // Mock logic
                })).filter((s: any) => s.label);
                setConfig({...config, steps});
              }}
           />
        );
      case 'INVENTORY_GRID':
        return (
           <Textarea
             label="Inventory Items (Name, Stock, Max, SKU)"
             placeholder="Item A, 50, 100, SKU-1"
             value={config.items ? config.items.map((i: any) => `${i.name}, ${i.stock}, ${i.max}, ${i.sku}`).join('\n') : ''}
             onChange={e => {
                const items = e.target.value.split('\n').map((line: string) => {
                   const [name, stock, max, sku] = line.split(',').map(s => s.trim());
                   return { name: name || 'Item', stock: Number(stock)||0, max: Number(max)||100, sku: sku||'---' };
                });
                setConfig({...config, items});
             }}
           />
        );
      case 'STATUS_BOARD':
        return (
           <Textarea
             label="Status Items (Label, ok/warn/error)"
             placeholder="Server 1, ok"
             value={config.items ? config.items.map((i: any) => `${i.label}, ${i.status}`).join('\n') : ''}
             onChange={e => {
                const items = e.target.value.split('\n').map((line: string) => {
                   const [label, status] = line.split(',').map(s => s.trim());
                   return { label: label || 'Unknown', status: status || 'ok' };
                });
                setConfig({...config, items});
             }}
           />
        );
      case 'MAP_VIEW':
        return (
           <Input label="Location Label" value={config.locationName} onChange={e => setConfig({...config, locationName: e.target.value})} />
        );
      case 'SERVICE_TICKET':
        return (
          <>
            <Input label="Customer Name" value={config.customer} onChange={e => setConfig({...config, customer: e.target.value})} />
            <Input label="Issue Description" value={config.issue} onChange={e => setConfig({...config, issue: e.target.value})} />
            <Select 
              label="Status" 
              value={config.status} 
              onChange={e => setConfig({...config, status: e.target.value})}
              options={[{value: 'open', label: 'Open'}, {value: 'pending', label: 'Pending'}, {value: 'closed', label: 'Closed'}]}
            />
             <Select 
              label="Priority" 
              value={config.priority} 
              onChange={e => setConfig({...config, priority: e.target.value})}
              options={[{value: 'low', label: 'Low'}, {value: 'medium', label: 'Medium'}, {value: 'high', label: 'High'}]}
            />
          </>
        );
      case 'PATIENT_VITALS':
        return (
          <>
             <Input label="Patient Name" value={config.patientName} onChange={e => setConfig({...config, patientName: e.target.value})} />
             <div className="grid grid-cols-3 gap-2">
                <Input label="BPM" type="number" value={config.bpm} onChange={e => setConfig({...config, bpm: parseInt(e.target.value)})} />
                <Input label="Temp (F)" type="number" value={config.temp} onChange={e => setConfig({...config, temp: parseFloat(e.target.value)})} />
                <Input label="SPO2 %" type="number" value={config.spo2} onChange={e => setConfig({...config, spo2: parseInt(e.target.value)})} />
             </div>
          </>
        );
      case 'RESOURCE_LIST':
         return (
           <>
             <Input label="List Title" value={config.title} onChange={e => setConfig({...config, title: e.target.value})} />
             <Textarea
               label="Items (Label, type[pdf/link/doc])"
               value={config.items ? config.items.map((i: any) => `${i.label}, ${i.type}`).join('\n') : ''}
               onChange={e => {
                  const items = e.target.value.split('\n').map((line: string) => {
                     const [label, type] = line.split(',').map(s => s.trim());
                     return { label: label || 'Document', type: type || 'doc' };
                  });
                  setConfig({...config, items});
               }}
             />
           </>
         );
      case 'TEAM_GRID':
      case 'TIMELINE':
      case 'CALENDAR':
        return (
          <div className="text-gray-500 text-sm bg-gray-50 p-4">This widget pulls data directly from the system database and doesn't have visual configuration options yet.</div>
        );
      default:
        return <div className="text-gray-500 italic">No configuration available for this widget type.</div>;
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Widget" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </>
    }>
      <div className="space-y-4">
        <Input label="Widget Title (Internal)" value={title} onChange={e => setTitle(e.target.value)} />
        <hr className="border-gray-200" />
        {renderForm()}
      </div>
    </Modal>
  );
};

// --- TOOLBAR FOR EDIT MODE ---
interface ConstructToolbarProps {
  onAddWidget: (type: WidgetType) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ConstructToolbar: React.FC<ConstructToolbarProps> = ({ onAddWidget, onSave, onCancel }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [orientation, setOrientation] = useState<'bottom' | 'left' | 'right'>('bottom');
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const groups = [
    {
       label: 'Analytics',
       items: [
         { type: 'KPI_CARD', label: 'KPI', icon: BarChart },
         { type: 'CHART_PLACEHOLDER', label: 'Chart', icon: Activity }
       ]
    },
    {
       label: 'Data & Lists',
       items: [
         { type: 'DATA_TABLE', label: 'Table', icon: Table },
         { type: 'INVENTORY_GRID', label: 'Stock', icon: Package },
         { type: 'TEAM_GRID', label: 'Team', icon: Users },
         { type: 'MAP_VIEW', label: 'Map', icon: Map },
         { type: 'RESOURCE_LIST', label: 'Docs', icon: FileText }
       ]
    },
    {
       label: 'Workflow',
       items: [
         { type: 'KANBAN_BOARD', label: 'Kanban', icon: Trello },
         { type: 'PROCESS_FLOW', label: 'Process', icon: GripHorizontal },
         { type: 'CALENDAR', label: 'Calendar', icon: Calendar },
         { type: 'TIMELINE', label: 'Timeline', icon: Clock }
       ]
    },
    {
       label: 'Specialized',
       items: [
         { type: 'SERVICE_TICKET', label: 'Ticket', icon: Wrench },
         { type: 'PATIENT_VITALS', label: 'Vitals', icon: Heart },
         { type: 'STATUS_BOARD', label: 'Status', icon: Server }
       ]
    },
    {
       label: 'Utility',
       items: [
         { type: 'TEXT_BLOCK', label: 'Text', icon: Type },
         { type: 'FORM_BUILDER', label: 'Form', icon: LayoutTemplate },
         { type: 'RELATIONSHIP', label: 'Rel', icon: Link2 }
       ]
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      
      setPosition({ x: newX, y: newY });
      setHasMoved(true);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const startDrag = (e: React.MouseEvent) => {
    // Only drag if clicking the black header part
    if ((e.target as HTMLElement).closest('button')) return;
    
    setIsDragging(true);
    if (toolbarRef.current) {
      const rect = toolbarRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      // If it's the first drag, we need to set initial absolute position
      if (!hasMoved) {
        setPosition({ x: rect.left, y: rect.top });
      }
    }
  };

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'bottom' ? 'left' : prev === 'left' ? 'right' : 'bottom');
    // Reset position on orientation change for safety
    setHasMoved(false);
  };

  const isVertical = orientation !== 'bottom';

  const getContainerStyle = () => {
    if (hasMoved) {
       return { 
        top: `${position.y}px`, 
        left: `${position.x}px`, 
        transform: 'none',
        bottom: 'auto',
        maxHeight: isVertical ? '90vh' : 'auto'
      };
    }
    
    if (orientation === 'bottom') {
       return { bottom: '2rem', left: '50%', transform: 'translateX(-50%)', width: '95vw', maxWidth: '72rem' };
    } else if (orientation === 'left') {
       return { top: '2rem', left: '2rem', bottom: 'auto', maxHeight: '90vh', overflowY: 'auto' };
    } else {
       return { top: '2rem', right: '2rem', left: 'auto', bottom: 'auto', maxHeight: '90vh', overflowY: 'auto' };
    }
  };

  return (
    <div 
      ref={toolbarRef}
      onMouseDown={startDrag}
      style={getContainerStyle() as any}
      className={`fixed z-50 animate-[fadeInUp_0.3s_ease-out_forwards] custom-scrollbar ${isDragging ? 'cursor-grabbing select-none' : ''}`}
    >
       <div className={`bg-black p-2 flex gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] border-2 border-white cursor-grab active:cursor-grabbing ${isVertical ? 'flex-col items-stretch w-64' : 'flex-row items-center min-w-max'}`}>
          
          {/* Header */}
          <div className={`text-white font-black uppercase px-3 text-sm tracking-widest flex items-center gap-2 ${isVertical ? 'border-b border-gray-700 pb-2 mb-2 justify-between' : 'border-r border-gray-700 sticky left-0 bg-black z-10'}`}>
            <div className="flex items-center gap-2">
               <GripHorizontal size={16} className="text-brand-yellow" />
               <span>Construct<span className="text-brand-yellow">OS</span></span>
            </div>
            <button onClick={toggleOrientation} className="text-gray-400 hover:text-white">
               {orientation === 'bottom' ? <AlignJustify size={14}/> : orientation === 'left' ? <AlignLeft size={14}/> : <AlignRight size={14}/>}
            </button>
          </div>
          
          {/* Groups */}
          <div className={`flex ${isVertical ? 'flex-col gap-4 px-2 overflow-y-auto custom-scrollbar max-h-[60vh]' : 'flex-row gap-6 px-2'}`}>
             {groups.map((group, idx) => (
               <div key={idx} className={`flex gap-2 ${isVertical ? 'flex-col items-start' : 'items-center'}`}>
                  <span className={`text-[10px] text-gray-500 font-bold uppercase ${isVertical ? 'mb-1' : 'mb-0 hidden md:block'}`}>{group.label}</span>
                  <div className={`flex gap-1 ${isVertical ? 'flex-wrap' : 'flex-row'}`}>
                     {group.items.map(item => (
                       <button 
                         key={item.type}
                         onClick={() => onAddWidget(item.type as WidgetType)} 
                         className="px-3 py-2 bg-gray-800 text-white text-xs font-bold uppercase hover:bg-brand-yellow hover:text-black transition-colors flex flex-col md:flex-row items-center gap-1 border border-transparent hover:border-black w-full md:w-auto justify-center"
                       >
                         <item.icon size={14} /> 
                         <span className={!isVertical ? 'hidden sm:inline' : 'text-[10px]'}>{item.label}</span>
                       </button>
                     ))}
                  </div>
                  {!isVertical && idx < groups.length - 1 && <div className="h-8 w-px bg-gray-700 mx-1"></div>}
                  {isVertical && idx < groups.length - 1 && <div className="w-full h-px bg-gray-700 my-1"></div>}
               </div>
             ))}
          </div>
          
          {!isVertical && <div className="h-8 w-px bg-gray-700 mx-2 sticky right-[140px]"></div>}
          {isVertical && <div className="w-full h-px bg-gray-700 my-2"></div>}
          
          {/* Actions */}
          <div className={`flex gap-2 ${isVertical ? 'flex-col' : 'sticky right-0 bg-black pl-2'}`}>
             <button onClick={onCancel} className="p-2 text-white hover:text-red-500 transition-colors border border-transparent hover:border-red-500 flex items-center justify-center gap-2 w-full" title="Cancel">
                <RotateCcw size={18} />
                {isVertical && <span className="text-xs font-bold uppercase">Cancel</span>}
             </button>
             <button onClick={onSave} className="px-4 py-2 bg-brand-yellow text-black text-xs font-black uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-black w-full">
                <Save size={14} />
                Save
             </button>
          </div>
       </div>
    </div>
  );
};
