
import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Command, User as UserIcon, Layout, Building2, PlusCircle } from 'lucide-react';
import { Page, User, Tenant } from '../types';
import { mockDb } from '../services/mockDb';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Page[];
  activeTenant: Tenant;
  currentUser: User;
  onNavigate: (pageId: string) => void;
  onSwitchTenant: (tenant: Tenant) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, onClose, pages, activeTenant, currentUser, onNavigate, onSwitchTenant 
}) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // Fetch data for search
      const fetchData = async () => {
        const u = await mockDb.getUsers(activeTenant.id);
        const t = await mockDb.getTenants();
        setUsers(u);
        setAllTenants(t);
      };
      fetchData();
    } else {
      setQuery('');
    }
  }, [isOpen, activeTenant.id]);

  if (!isOpen) return null;

  const filteredPages = pages.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
  const filteredTenants = allTenants.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) && t.id !== activeTenant.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
       <div 
         className="w-full max-w-2xl bg-white border-2 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)] animate-[reveal_0.2s_ease-out_forwards] flex flex-col max-h-[60vh]" 
         onClick={e => e.stopPropagation()}
       >
          {/* Input */}
          <div className="flex items-center px-4 border-b-2 border-black">
             <Search className="text-gray-400" size={24} />
             <input 
               ref={inputRef}
               className="w-full p-6 text-xl font-black uppercase placeholder:text-gray-300 focus:outline-none bg-transparent"
               placeholder="Type a command or search..."
               value={query}
               onChange={e => setQuery(e.target.value)}
             />
             <div className="hidden sm:flex gap-1">
               <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">ESC</kbd>
             </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-2 bg-gray-50 custom-scrollbar">
             {query === '' && (
                <div className="p-4 text-sm text-gray-500 font-mono">
                   <p className="mb-2">SUGGESTED ACTIONS:</p>
                   <div className="space-y-2">
                      <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 hover:border-black hover:bg-brand-yellow hover:text-black transition-all font-bold flex items-center gap-3 group">
                         <PlusCircle size={18} className="text-gray-400 group-hover:text-black" />
                         <span>Create New Service Ticket</span>
                         <span className="ml-auto text-[10px] opacity-50">SHORTCUT</span>
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 hover:border-black hover:bg-brand-yellow hover:text-black transition-all font-bold flex items-center gap-3 group">
                         <UserIcon size={18} className="text-gray-400 group-hover:text-black" />
                         <span>Invite Team Member</span>
                      </button>
                   </div>
                </div>
             )}

             {filteredPages.length > 0 && (
               <div className="mb-4">
                  <div className="px-4 py-2 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Navigation</div>
                  {filteredPages.map(page => (
                    <button 
                      key={page.id} 
                      onClick={() => { onNavigate(page.id); onClose(); }}
                      className="w-full text-left px-4 py-3 bg-white border-b border-gray-100 hover:bg-black hover:text-white transition-colors flex items-center justify-between group"
                    >
                       <div className="flex items-center gap-3">
                          <Layout size={16} className="text-gray-400 group-hover:text-brand-yellow" />
                          <span className="font-bold">{page.name}</span>
                       </div>
                       <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-brand-yellow" />
                    </button>
                  ))}
               </div>
             )}

             {filteredUsers.length > 0 && (
               <div className="mb-4">
                  <div className="px-4 py-2 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Users</div>
                  {filteredUsers.map(u => (
                    <div key={u.id} className="w-full px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold">{u.name.charAt(0)}</div>
                          <span className="font-bold text-sm">{u.name}</span>
                          <span className="text-xs text-gray-400 font-mono">{u.email}</span>
                       </div>
                       <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-1">{u.role}</span>
                    </div>
                  ))}
               </div>
             )}

             {filteredTenants.length > 0 && (
               <div className="mb-4">
                  <div className="px-4 py-2 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Switch Workspace</div>
                  {filteredTenants.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => { onSwitchTenant(t); onClose(); }}
                      className="w-full text-left px-4 py-3 bg-white border-b border-gray-100 hover:bg-black hover:text-white transition-colors flex items-center justify-between group"
                    >
                       <div className="flex items-center gap-3">
                          <Building2 size={16} className="text-gray-400 group-hover:text-brand-yellow" />
                          <span className="font-bold">{t.name}</span>
                       </div>
                       <span className="text-[10px] font-mono">{t.plan}</span>
                    </button>
                  ))}
               </div>
             )}
          </div>
          
          <div className="p-2 bg-gray-100 border-t-2 border-black flex justify-between text-[10px] font-mono text-gray-500 uppercase">
             <span>Nexus Command v2.1</span>
             <div className="flex gap-2">
                <span>Select <b className="text-black">↵</b></span>
                <span>Navigate <b className="text-black">↑↓</b></span>
             </div>
          </div>
       </div>
    </div>
  );
};
