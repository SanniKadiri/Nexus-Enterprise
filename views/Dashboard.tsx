
import React, { useState, useEffect } from 'react';
import { Tenant, User, WidgetInstance, WidgetType, Page, NavItem } from '../types';
import { Button, Card, Badge, Modal, Input } from '../components/UI';
import { Layout } from '../components/Layout';
import { AIWidget } from '../components/AIWidget';
import { ConstructEngine, ConstructToolbar } from '../components/ConstructEngine';
import { Settings } from './Settings';
import { TeamView } from './TeamView';
import { CommandPalette } from '../components/CommandPalette';
import { mockDb } from '../services/mockDb';
import { 
  ArrowUpRight,
  Pencil,
  Check,
  LayoutDashboard,
  Settings as SettingsIcon,
  FileText,
  BarChart3,
  Users,
  Briefcase,
  PieChart,
  Activity,
  Folder,
  MessageSquare,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  // --- GLOBAL STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [showAI, setShowAI] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  
  // --- PAGE MANAGEMENT ---
  const [pages, setPages] = useState<Page[]>([]);
  const [activePageId, setActivePageId] = useState<string>('');
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingPageId, setPendingPageId] = useState<string | null>(null);

  // --- CONSTRUCT ENGINE STATE ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempLayout, setTempLayout] = useState<WidgetInstance[]>([]);
  
  const [showReportModal, setShowReportModal] = useState(false);

  // --- INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      
      // 1. Fetch Tenants
      const loadedTenants = await mockDb.getTenants();
      setTenants(loadedTenants);
      
      // 2. Set Active Tenant (Persist via localStorage)
      const storedTenantId = localStorage.getItem('nexus_active_tenant');
      const initialTenant = loadedTenants.find(t => t.id === storedTenantId) || loadedTenants[0];
      setActiveTenant(initialTenant);
      
      // 3. Fetch User for this tenant
      const user = await mockDb.getCurrentUser(initialTenant.id);
      setCurrentUser(user);
      
      // 4. Fetch Pages
      const loadedPages = await mockDb.getPages(initialTenant.id);
      setPages(loadedPages);
      setActivePageId(loadedPages[0].id);
      
      setIsLoading(false);
    };
    
    init();
  }, []);

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- TENANT SWITCHING & THEMING ENGINE ---
  const handleSwitchTenant = async (tenant: Tenant) => {
    setIsLoading(true);
    setActiveTenant(tenant);
    localStorage.setItem('nexus_active_tenant', tenant.id);
    
    // Refresh Data
    const loadedPages = await mockDb.getPages(tenant.id);
    const user = await mockDb.getCurrentUser(tenant.id);
    
    setPages(loadedPages);
    setCurrentUser(user);
    setActivePageId(loadedPages[0]?.id || '');
    setIsEditMode(false); // Exit edit mode safely
    
    setIsLoading(false);
  };

  // Apply Theme CSS Variables
  useEffect(() => {
    if (activeTenant) {
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', activeTenant.theme.primaryColor);
      // We can extend this for fonts, secondary colors, etc.
    }
  }, [activeTenant]);


  // --- DERIVED STATE ---
  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const isAdmin = currentUser ? ['OWNER', 'ADMIN'].includes(currentUser.role) : false;
  const isReadOnly = currentUser?.role === 'VIEWER';

  // Helper to get icon for nav
  const getPageIcon = (page: Page) => {
    if (page.isSystem) {
      if (page.name === 'Overview') return LayoutDashboard;
      if (page.name === 'Settings') return SettingsIcon;
      if (page.name === 'Team') return Users;
    }
    const lower = page.name.toLowerCase();
    if (lower.includes('analytic')) return BarChart3;
    if (lower.includes('team') || lower.includes('hr')) return Users;
    if (lower.includes('project') || lower.includes('roadmap')) return Briefcase;
    if (lower.includes('doc')) return Folder;
    return FileText;
  };

  const navItems: NavItem[] = pages.map(p => ({
    id: p.id,
    label: p.name,
    icon: getPageIcon(p)
  }));
  // Add Settings manually if not present (it usually is system page)
  if (!navItems.find(i => i.id === 'settings')) {
     navItems.push({ id: 'settings', label: 'Settings', icon: SettingsIcon });
  }


  // --- HANDLERS ---

  const handleEnterEditMode = () => {
    setTempLayout(activePage ? [...activePage.layout] : []);
    setIsEditMode(true);
  };

  const handleSaveLayout = async () => {
    if (!activeTenant || !activePage) return;

    const updatedPage: Page = { ...activePage, layout: tempLayout };
    
    // Optimistic UI Update
    const updatedPages = pages.map(p => p.id === activePageId ? updatedPage : p);
    setPages(updatedPages);
    setIsEditMode(false);

    // Persistence
    await mockDb.savePage(updatedPage);
    mockDb.logAction(currentUser?.id || 'unknown', activeTenant.id, 'UPDATE_LAYOUT', `Updated layout for page ${activePage.name}`);
  };

  const handleCancelEdit = () => {
    setPendingPageId(null);
    setShowUnsavedModal(true);
  };

  const handleLayoutChange = (newLayout: WidgetInstance[]) => {
    setTempLayout(newLayout);
  };

  const handleAddWidget = (type: WidgetType) => {
    const newWidget: WidgetInstance = {
      id: `w_${Date.now()}`,
      type,
      title: 'New Component',
      colSpan: type === 'DATA_TABLE' || type === 'KANBAN_BOARD' ? 3 : 1,
      config: 
        type === 'KPI_CARD' ? { label: 'METRIC', value: '0', change: '+0%', variant: 'light' } : 
        type === 'DATA_TABLE' ? { headers: ['Col A', 'Col B', 'Col C'], rows: [{ col1: 'Data 1', col2: 'Data 2', col3: 'Data 3' }] } :
        {} 
    };
    setTempLayout([...tempLayout, newWidget]);
  };

  const handleNavigationAttempt = (pageId: string) => {
    if (activePageId === pageId) return;

    if (isEditMode) {
      setPendingPageId(pageId);
      setShowUnsavedModal(true);
    } else {
      setActivePageId(pageId);
    }
  };

  const confirmNavigation = () => {
    if (pendingPageId) {
      setIsEditMode(false);
      setTempLayout([]);
      setActivePageId(pendingPageId);
      setPendingPageId(null);
    } else {
      // Just cancelling edit mode
      setIsEditMode(false);
      setTempLayout([]);
    }
    setShowUnsavedModal(false);
  };

  const cancelNavigation = () => {
    setPendingPageId(null);
    setShowUnsavedModal(false);
  };

  const handleCreatePage = async () => {
    if (!newPageName.trim() || !activeTenant) return;
    
    const newPage: Page = {
      id: `p_${Date.now()}`,
      tenantId: activeTenant.id,
      name: newPageName,
      layout: [],
      isSystem: false
    };

    // Persistence
    await mockDb.savePage(newPage);
    mockDb.logAction(currentUser?.id || 'unknown', activeTenant.id, 'CREATE_PAGE', `Created new page ${newPageName}`);
    
    // State Update
    setPages([...pages, newPage]);
    setIsEditMode(false); 
    setActivePageId(newPage.id);
    setNewPageName('');
    setShowAddPageModal(false);
    
    // Auto enter edit mode
    setTimeout(() => {
      setTempLayout([]);
      setIsEditMode(true);
    }, 100);
  };

  const handleDeletePage = async (pageId: string) => {
    await mockDb.deletePage(pageId);
    mockDb.logAction(currentUser?.id || 'unknown', activeTenant!.id, 'DELETE_PAGE', `Deleted page ${pageId}`);
    setPages(pages.filter(p => p.id !== pageId));
    if (activePageId === pageId) setActivePageId(pages[0]?.id || '');
  };

  // ---- RENDER CONTENT ---- //

  if (isLoading || !activeTenant || !currentUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-black" />
          <div className="font-bold font-mono uppercase tracking-widest">Initializing Nexus Core...</div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (activePageId === 'settings') return <Settings activeTenant={activeTenant} currentUser={currentUser} />;
    if (activePage?.name === 'Team') return <TeamView activeTenant={activeTenant} currentUser={currentUser} />;

    return (
      <div className="max-w-7xl mx-auto pb-24">
        <div className="flex justify-between items-end mb-10 animate-fade-in-up">
           <div>
              <h1 className="text-4xl font-black uppercase tracking-tight mb-2">{activePage?.name || 'Page'}</h1>
              <div className="flex items-center gap-2 text-sm font-mono text-gray-500">
                <span>WORKSPACE: {activeTenant.name.toUpperCase()}</span>
                <span>•</span>
                <span className="text-green-600">CONNECTED</span>
                {isReadOnly && <span className="bg-gray-200 text-gray-600 px-2 py-0.5 text-[10px] uppercase font-bold">Read Only Mode</span>}
              </div>
           </div>
           
           <div className="flex gap-4">
              {isAdmin && !isEditMode && activePage && (
                <Button size="md" variant="outline" withIcon onClick={handleEnterEditMode}>
                    <Pencil size={16} className="mr-2" />
                    EDIT LAYOUT
                </Button>
              )}
              
              {!isEditMode && (
                <Button size="md" withIcon className="shadow-[4px_4px_0px_0px_#000]" onClick={() => setShowReportModal(true)}>
                    GENERATE REPORT
                    <ArrowUpRight size={18} className="ml-2" />
                </Button>
              )}
           </div>
        </div>

        {/* CONSTRUCT ENGINE RENDERER */}
        {activePage && (
          <ConstructEngine 
            layout={isEditMode ? tempLayout : activePage.layout} 
            onLayoutChange={handleLayoutChange} 
            isEditMode={isEditMode} 
            isReadOnly={isReadOnly}
          />
        )}
        
        {/* Empty State */}
        {!isEditMode && activePage?.layout.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 p-12 text-center text-gray-400 rounded-none">
            <h3 className="text-xl font-bold uppercase mb-2">Empty Canvas</h3>
            <p className="mb-6">This page has no widgets yet.</p>
            {isAdmin && (
               <Button variant="outline" onClick={handleEnterEditMode}>Start Building</Button>
            )}
          </div>
        )}
        
        {/* EDIT MODE TOOLBAR */}
        {isEditMode && (
          <ConstructToolbar 
            onAddWidget={handleAddWidget}
            onSave={handleSaveLayout}
            onCancel={handleCancelEdit}
          />
        )}
      </div>
    );
  };

  return (
    <Layout 
      activePageId={activePageId}
      navItems={navItems}
      onNavigate={handleNavigationAttempt}
      onAddPage={() => setShowAddPageModal(true)}
      onDeletePage={handleDeletePage}
      user={currentUser}
      activeTenant={activeTenant}
      tenants={tenants}
      onSwitchTenant={handleSwitchTenant}
      onLogout={onLogout}
      onToggleAI={() => setShowAI(!showAI)}
      showAIActive={showAI}
      isEditMode={isEditMode}
    >
      {renderContent()}

      {/* Command Palette */}
      <CommandPalette 
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
        pages={pages}
        activeTenant={activeTenant}
        currentUser={currentUser}
        onNavigate={handleNavigationAttempt}
        onSwitchTenant={handleSwitchTenant}
      />

      {/* AI Overlay */}
      {showAI && (
        <div className="absolute bottom-8 right-8 z-50 w-[450px] animate-[fadeInUp_0.3s_ease-out_forwards]">
          <AIWidget onClose={() => setShowAI(false)} />
        </div>
      )}

      {/* Report Modal Example */}
      <Modal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)} 
        title="Generate Report"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowReportModal(false)}>Cancel</Button>
            <Button onClick={() => setShowReportModal(false)}>Export PDF</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Select the parameters for the quarterly report.</p>
          <Card className="bg-gray-50 !p-4 !border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center">
                <ArrowUpRight />
              </div>
              <div>
                <div className="font-bold text-sm">Q3_Financial_Report.pdf</div>
                <div className="text-xs text-gray-500">~2.4MB • Generated by System</div>
              </div>
            </div>
          </Card>
        </div>
      </Modal>

      {/* Unsaved Changes Warning Modal */}
      <Modal
        isOpen={showUnsavedModal}
        onClose={cancelNavigation}
        title="Unsaved Changes"
        footer={
          <>
            <Button variant="ghost" onClick={cancelNavigation}>Stay Editing</Button>
            <Button variant="danger" onClick={confirmNavigation}>Discard & Leave</Button>
          </>
        }
      >
        <div className="flex items-start gap-4">
           <div className="bg-yellow-100 p-2 border-2 border-yellow-400 text-yellow-700 rounded-none">
              <AlertTriangle size={24} />
           </div>
           <div>
              <h4 className="font-bold uppercase text-sm mb-2">Are you sure you want to discard unsaved changes?</h4>
              <p className="text-sm text-gray-600 mb-2">
                If you leave this page now, any edits you made to the layout will not be saved.
              </p>
           </div>
        </div>
      </Modal>

      {/* Add Page Modal */}
      <Modal
        isOpen={showAddPageModal}
        onClose={() => setShowAddPageModal(false)}
        title="Create New Page"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddPageModal(false)}>Cancel</Button>
            <Button onClick={handleCreatePage} disabled={!newPageName.trim()}>Create Page</Button>
          </>
        }
      >
        <div className="space-y-4">
           <Input 
             label="Page Name" 
             placeholder="e.g. Human Resources" 
             value={newPageName}
             onChange={(e) => setNewPageName(e.target.value)}
             autoFocus
           />
           <p className="text-xs text-gray-500">
             New pages start with an empty canvas. You can delete them later in Edit Mode.
           </p>
        </div>
      </Modal>

    </Layout>
  );
};
