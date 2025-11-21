
import React, { useState } from 'react';
import { Tenant, User, NavItem } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronDown, 
  Bot,
  BarChart3,
  Plus,
  FilePlus,
  Trash2
} from 'lucide-react';
import { Input, Button } from './UI';

interface LayoutProps {
  children: React.ReactNode;
  activePageId: string;
  navItems: NavItem[];
  onNavigate: (pageId: string) => void;
  onAddPage: () => void;
  onDeletePage: (pageId: string) => void;
  user: User;
  activeTenant: Tenant;
  tenants: Tenant[];
  onSwitchTenant: (tenant: Tenant) => void;
  onLogout: () => void;
  onToggleAI: () => void;
  showAIActive: boolean;
  isEditMode: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activePageId, 
  navItems,
  onNavigate, 
  onAddPage,
  onDeletePage,
  user, 
  activeTenant, 
  tenants,
  onSwitchTenant,
  onLogout,
  onToggleAI,
  showAIActive,
  isEditMode
}) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r-2 border-black flex flex-col relative z-20 shadow-[4px_0px_0px_0px_rgba(0,0,0,0.05)]">
        {/* Tenant Switcher */}
        <div className="p-6 border-b-2 border-black">
          <div className="relative group">
             <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all rounded-none group-focus-within:border-black">
                <div className="w-12 h-12 bg-brand-yellow border-2 border-black flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_#000]">
                  {activeTenant.logoChar}
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold leading-tight uppercase tracking-wide truncate">{activeTenant.name}</div>
                  <div className="text-xs font-mono text-gray-500 mt-1">{activeTenant.plan} Plan</div>
                </div>
                <ChevronDown size={16} className="text-black" />
             </button>
             
             {/* Dropdown */}
             <div className="absolute top-full left-0 w-full bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] mt-2 hidden group-hover:block p-1 z-50">
                {tenants.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => onSwitchTenant(t)}
                    className={`w-full text-left p-3 text-sm font-bold hover:bg-brand-yellow hover:text-black transition-colors flex justify-between items-center ${activeTenant.id === t.id ? 'bg-gray-100' : ''}`}
                  >
                    {t.name}
                    {activeTenant.id === t.id && <div className="w-2 h-2 bg-black rounded-full"></div>}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-4 pl-2 pr-2">
             <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Menu</div>
             {isEditMode && (
               <button 
                 onClick={onAddPage} 
                 className="text-[10px] font-black text-black bg-gray-100 hover:bg-brand-yellow border border-transparent hover:border-black px-2 py-1 uppercase flex items-center gap-1 transition-all animate-[fadeInUp_0.2s_ease-out]"
                 title="Create New Page"
               >
                 <Plus size={12} strokeWidth={3} /> ADD
               </button>
             )}
          </div>
          
          {navItems.map(item => (
            <div key={item.id} className="group flex items-center">
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex-1 flex items-center gap-4 px-4 py-3 border-2 transition-all duration-200 ${
                  activePageId === item.id 
                    ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_#FFD600] translate-x-[-2px] translate-y-[-2px] z-10' 
                    : 'border-transparent text-gray-600 hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_#000]'
                }`}
              >
                <item.icon size={20} />
                <span className="font-bold uppercase">{item.label}</span>
              </button>
              
              {/* Delete Action for custom pages in Edit Mode */}
              {isEditMode && !['overview', 'settings', 'analytics', 'projects', 'team'].includes(item.id) && (
                <button 
                  onClick={() => onDeletePage(item.id)}
                  className="ml-1 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Page"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t-2 border-black bg-gray-50">
          <button 
            onClick={onToggleAI}
            className={`w-full flex items-center justify-between px-4 py-4 bg-white border-2 border-black text-black font-bold mb-4 hover:bg-brand-yellow transition-colors shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${showAIActive ? 'bg-brand-yellow translate-x-[-2px] translate-y-[-2px]' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span>AI AGENT</span>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-600 text-sm font-bold transition-colors">
            <LogOut size={16} />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-grid-slate-100">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b-2 border-black flex items-center justify-between px-8 sticky top-0 z-10">
           <div className="flex items-center gap-4 w-1/3">
             <Search size={20} className="text-black" />
             <Input placeholder="SEARCH DATABASE..." className="!border-none !bg-transparent !text-sm focus:!ring-0 !p-0 border-b !border-transparent focus:!border-black !rounded-none focus:!shadow-none" />
           </div>
           <div className="flex items-center gap-8">
              <button className="relative text-black hover:scale-110 transition-transform">
                 <Bell size={24} strokeWidth={2} />
                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-yellow border-2 border-white"></span>
              </button>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-4 cursor-pointer group">
                <div className="text-right hidden sm:block">
                   <div className="text-sm font-black uppercase">{user.name}</div>
                   <div className="text-xs text-gray-500 font-mono">{user.role}</div>
                </div>
                <div className="w-10 h-10 bg-gray-200 border-2 border-black group-hover:bg-brand-yellow transition-colors flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                </div>
              </div>
           </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
           {children}
        </div>
      </main>
    </div>
  );
};
