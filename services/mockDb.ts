
import { Tenant, User, Page, WidgetInstance, AuditLog } from '../types';

const STORAGE_KEY = 'nexus_os_db_v1';
const LATENCY_MS = 300; // Simulated network delay

// --- SEED DATA ---

const SEED_TENANTS: Tenant[] = [
  { 
    id: 't1', 
    name: 'Acme Corp', 
    plan: 'Enterprise', 
    logoChar: 'A',
    theme: { primaryColor: '#FFD600', secondaryColor: '#111111' },
    features: { enableAI: true, enableHR: true, enableCRM: true }
  },
  { 
    id: 't2', 
    name: 'Stark Ind', 
    plan: 'Pro', 
    logoChar: 'S',
    theme: { primaryColor: '#00f2ff', secondaryColor: '#004a4f' }, // Arc Reactor Blue
    features: { enableAI: true, enableHR: false, enableCRM: true }
  },
  { 
    id: 't3', 
    name: 'Wayne Ent', 
    plan: 'Enterprise', 
    logoChar: 'W',
    theme: { primaryColor: '#555555', secondaryColor: '#000000' }, // Stealth Grey
    features: { enableAI: true, enableHR: true, enableCRM: true }
  }
];

const SEED_USERS: User[] = [
  { id: 'u1', tenantId: 't1', name: 'Jane Doe', role: 'ADMIN', email: 'jane@acme.com', status: 'active', lastActive: Date.now() },
  { id: 'u2', tenantId: 't1', name: 'John Smith', role: 'EDITOR', email: 'john@acme.com', status: 'active', lastActive: Date.now() - 86400000 },
  { id: 'u5', tenantId: 't1', name: 'Alice Dev', role: 'EDITOR', email: 'alice@acme.com', status: 'active', lastActive: Date.now() - 3600000 },
  { id: 'u6', tenantId: 't1', name: 'Charlie Ops', role: 'VIEWER', email: 'charlie@acme.com', status: 'active', lastActive: Date.now() - 7200000 },
  { id: 'u7', tenantId: 't1', name: 'Eve Security', role: 'VIEWER', email: 'eve@acme.com', status: 'inactive', lastActive: Date.now() - 604800000 },
  
  // Stark Users
  { id: 'u3', tenantId: 't2', name: 'Tony S', role: 'OWNER', email: 'tony@stark.com', status: 'active', lastActive: Date.now() },
  { id: 'u8', tenantId: 't2', name: 'Pepper P', role: 'ADMIN', email: 'pepper@stark.com', status: 'active', lastActive: Date.now() - 4000000 },
  
  // Wayne Users
  { id: 'u9', tenantId: 't3', name: 'Bruce W', role: 'OWNER', email: 'bruce@wayne.com', status: 'active', lastActive: Date.now() - 1000000 },
  { id: 'u10', tenantId: 't3', name: 'Lucius F', role: 'ADMIN', email: 'lucius@wayne.com', status: 'active', lastActive: Date.now() - 200000 },
  
  { id: 'u4', tenantId: 't1', name: 'Bob Worker', role: 'VIEWER', email: 'bob@acme.com', status: 'inactive', lastActive: Date.now() - 100000000 },
];

// Pre-built Layouts for Seed
const OVERVIEW_LAYOUT: WidgetInstance[] = [
  {
    id: 'w1',
    type: 'KPI_CARD',
    title: 'Revenue',
    colSpan: 1,
    config: { label: 'TOTAL REVENUE', value: '$124,500', change: '+12.5%', trend: 'up', variant: 'dark', trendData: [105000, 108000, 112000, 110000, 118000, 124500] }
  },
  {
    id: 'w2',
    type: 'KPI_CARD',
    title: 'Users',
    colSpan: 1,
    config: { label: 'ACTIVE USERS', value: '1,234', change: 'STABLE', trend: 'neutral', variant: 'light' }
  },
  {
    id: 'w3',
    type: 'KPI_CARD',
    title: 'Load',
    colSpan: 1,
    config: { label: 'SYSTEM LOAD', value: '42%', change: 'NORMAL', trend: 'neutral', variant: 'light' }
  },
  {
    id: 'w4',
    type: 'DATA_TABLE',
    title: 'Recent Activity',
    colSpan: 3,
    config: {
      headers: ['Project', 'Status', 'Timeline'],
      rows: [
         { col1: 'Website Redesign', col2: 'In Progress', col3: '2 mins ago', status: 'active' },
         { col1: 'Q3 Financial Report', col2: 'Completed', col3: '1 hour ago', status: 'complete' },
         { col1: 'Mobile App Beta', col2: 'Review', col3: 'Yesterday', status: 'pending' },
      ]
    }
  }
];

const HR_LAYOUT: WidgetInstance[] = [
   { id: 'h1', type: 'CALENDAR', title: 'Shift Schedule', colSpan: 2, config: {} },
   { id: 'h2', type: 'TEAM_GRID', title: 'Staff Status', colSpan: 1, config: { limit: 6 } }
];

const PROJECT_LAYOUT: WidgetInstance[] = [
  { id: 'k1', type: 'KANBAN_BOARD', title: 'Active Sprints', colSpan: 3, config: { columns: ['Backlog', 'In Progress', 'Review', 'Done'] } }
];

const DOCS_LAYOUT: WidgetInstance[] = [
  { id: 'd1', type: 'RESOURCE_LIST', title: 'Compliance Docs', colSpan: 1, config: { 
      title: 'Safety Protocols',
      items: [{label: 'Fire Safety v2.pdf', type: 'pdf'}, {label: 'OSHA Guidelines', type: 'link'}] 
    } 
  },
  { id: 'd2', type: 'RESOURCE_LIST', title: 'Employee Handbooks', colSpan: 1, config: { 
      title: 'HR Manuals',
      items: [{label: '2024 Benefits', type: 'pdf'}, {label: 'Code of Conduct', type: 'doc'}] 
    } 
  },
  { id: 'd3', type: 'TEXT_BLOCK', title: 'Notice', colSpan: 1, config: { content: '### Q4 Audit in Progress\nPlease ensure all documents are up to date.' } }
];

const TEAM_LAYOUT: WidgetInstance[] = [
   { id: 't1', type: 'TEAM_GRID', title: 'Engineering', colSpan: 1, config: { limit: 10 } },
   { id: 't2', type: 'KPI_CARD', title: 'Headcount', colSpan: 1, config: { label: 'Total Staff', value: '142', change: '+4', trend: 'up' } },
   { id: 't3', type: 'KPI_CARD', title: 'Open Roles', colSpan: 1, config: { label: 'Hiring', value: '8', change: 'URGENT', trend: 'neutral' } }
];

const SEED_PAGES: Page[] = [
  // Acme Pages (Full Suite)
  { id: 'p1', tenantId: 't1', name: 'Overview', layout: OVERVIEW_LAYOUT, isSystem: true },
  { id: 'p2', tenantId: 't1', name: 'Projects', layout: PROJECT_LAYOUT, isSystem: false },
  { id: 'p3', tenantId: 't1', name: 'Team', layout: TEAM_LAYOUT, isSystem: false },
  { id: 'p4', tenantId: 't1', name: 'HR & Shifts', layout: HR_LAYOUT, isSystem: false },
  { id: 'p5', tenantId: 't1', name: 'Documents', layout: DOCS_LAYOUT, isSystem: false },
  { id: 'p6', tenantId: 't1', name: 'Analytics', layout: [], isSystem: false },
  
  // Stark Pages (Limited Suite)
  { id: 'p7', tenantId: 't2', name: 'Overview', layout: [], isSystem: true },
  { id: 'p8', tenantId: 't2', name: 'Arc Reactor Status', layout: [{ id: 's1', type: 'STATUS_BOARD', title: 'Core Systems', colSpan: 3, config: {} }], isSystem: false },
  
  // Wayne Pages
  { id: 'p9', tenantId: 't3', name: 'Overview', layout: [], isSystem: true },
  { id: 'p10', tenantId: 't3', name: 'Surveillance', layout: [{ id: 'm1', type: 'MAP_VIEW', title: 'City Limits', colSpan: 2, config: { locationName: 'Gotham City' } }], isSystem: false }
];

// Helper to generate past timestamps
const timeAgo = (mins: number) => Date.now() - (mins * 60 * 1000);

const SEED_LOGS: AuditLog[] = [
  // Acme Logs
  { id: 'l1', tenantId: 't1', userId: 'u1', action: 'LOGIN', details: 'Successful login via email', timestamp: timeAgo(5) },
  { id: 'l2', tenantId: 't1', userId: 'u1', action: 'UPDATE_LAYOUT', details: 'Updated layout for page Overview', timestamp: timeAgo(12) },
  { id: 'l3', tenantId: 't1', userId: 'u2', action: 'CREATE_PAGE', details: 'Created new page Analytics', timestamp: timeAgo(60 * 24) },
  { id: 'l4', tenantId: 't1', userId: 'u2', action: 'UPDATE_WIDGET', details: 'Modified KPI Card configuration', timestamp: timeAgo(60 * 25) },
  { id: 'l5', tenantId: 't1', userId: 'u5', action: 'LOGIN', details: 'Successful login via SSO', timestamp: timeAgo(60 * 48) },
  { id: 'l6', tenantId: 't1', userId: 'u1', action: 'INVITE_USER', details: 'Invited charlie@acme.com as VIEWER', timestamp: timeAgo(60 * 72) },
  { id: 'l7', tenantId: 't1', userId: 'u6', action: 'LOGIN', details: 'First time login', timestamp: timeAgo(60 * 73) },
  { id: 'l8', tenantId: 't1', userId: 'u1', action: 'DELETE_WIDGET', details: 'Removed chart placeholder from Dashboard', timestamp: timeAgo(60 * 120) },
  { id: 'l9', tenantId: 't1', userId: 'u2', action: 'EXPORT_DATA', details: 'Downloaded Q3 Report PDF', timestamp: timeAgo(60 * 140) },
  { id: 'l10', tenantId: 't1', userId: 'u1', action: 'UPDATE_SETTINGS', details: 'Changed primary language to English (US)', timestamp: timeAgo(60 * 200) },
  { id: 'l11', tenantId: 't1', userId: 'u5', action: 'UPDATE_LAYOUT', details: 'Reordered widgets on Team page', timestamp: timeAgo(60 * 210) },
  { id: 'l12', tenantId: 't1', userId: 'u1', action: 'API_KEY_ROLL', details: 'Rolled API Key', timestamp: timeAgo(60 * 500) },

  // Stark Logs
  { id: 'l20', tenantId: 't2', userId: 'u3', action: 'LOGIN', details: 'Biometric Login Verified', timestamp: timeAgo(15) },
  { id: 'l21', tenantId: 't2', userId: 'u3', action: 'UPDATE_STATUS', details: 'Mark 42 Status: Online', timestamp: timeAgo(20) },
  { id: 'l22', tenantId: 't2', userId: 'u8', action: 'LOGIN', details: 'Login via Secure Terminal', timestamp: timeAgo(120) },
  { id: 'l23', tenantId: 't2', userId: 'u8', action: 'UPDATE_LAYOUT', details: 'Optimized Arc Reactor Dashboard', timestamp: timeAgo(130) },

  // Wayne Logs
  { id: 'l30', tenantId: 't3', userId: 'u9', action: 'LOGIN', details: 'Encrypted Connection Established', timestamp: timeAgo(2) },
  { id: 'l31', tenantId: 't3', userId: 'u10', action: 'UPDATE_MAP', details: 'Updated Surveillance Grid', timestamp: timeAgo(300) },
];

interface DBState {
  tenants: Tenant[];
  users: User[];
  pages: Page[];
  auditLogs: AuditLog[];
}

// --- SERVICE IMPLEMENTATION ---

class MockDbService {
  private state: DBState;

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.state = JSON.parse(stored);
      // Migration: Ensure new pages exist if upgrading from old version
      if (this.state.pages.filter(p => p.tenantId === 't1').length < 5) {
         this.state.pages = SEED_PAGES;
         this.save();
      }
      // Migration: Add seed logs if empty or sparse (Phase 3 Update)
      if (!this.state.auditLogs || this.state.auditLogs.length < 10) {
        this.state.auditLogs = SEED_LOGS;
        // Also update users if missing new ones
        if (this.state.users.length < SEED_USERS.length) {
           this.state.users = SEED_USERS;
        }
        this.save();
      }
    } else {
      this.state = {
        tenants: SEED_TENANTS,
        users: SEED_USERS,
        pages: SEED_PAGES,
        auditLogs: SEED_LOGS
      };
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private async delay() {
    return new Promise(resolve => setTimeout(resolve, LATENCY_MS));
  }

  // --- TENANTS ---

  async getTenants(): Promise<Tenant[]> {
    await this.delay();
    return [...this.state.tenants];
  }

  async getTenant(id: string): Promise<Tenant | undefined> {
    await this.delay();
    return this.state.tenants.find(t => t.id === id);
  }

  // --- USERS ---

  async getCurrentUser(tenantId: string): Promise<User> {
    await this.delay();
    // Simulate getting the first admin user for the tenant
    const user = this.state.users.find(u => u.tenantId === tenantId && ['OWNER', 'ADMIN'].includes(u.role));
    if (user) return user;
    // fallback
    return this.state.users.find(u => u.tenantId === tenantId) || SEED_USERS[0];
  }

  async getUsers(tenantId: string): Promise<User[]> {
    await this.delay();
    return this.state.users.filter(u => u.tenantId === tenantId);
  }

  async addUser(user: User): Promise<void> {
    await this.delay();
    this.state.users.push(user);
    this.save();
    this.logAction(user.id, user.tenantId, 'USER_CREATED', `User ${user.email} added to tenant.`);
  }

  async updateUser(user: User): Promise<void> {
    await this.delay();
    const index = this.state.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      this.state.users[index] = user;
      this.save();
    }
  }

  async removeUser(userId: string): Promise<void> {
    await this.delay();
    this.state.users = this.state.users.filter(u => u.id !== userId);
    this.save();
  }

  // --- PAGES ---

  async getPages(tenantId: string): Promise<Page[]> {
    await this.delay();
    const pages = this.state.pages.filter(p => p.tenantId === tenantId);
    
    // If no pages exist for this tenant (e.g. new seed), create default Overview
    if (pages.length === 0) {
       const defaultPage: Page = { id: `p_${Date.now()}`, tenantId, name: 'Overview', layout: [], isSystem: true };
       this.state.pages.push(defaultPage);
       this.save();
       return [defaultPage];
    }
    
    return pages;
  }

  async savePage(page: Page): Promise<void> {
    await this.delay();
    const index = this.state.pages.findIndex(p => p.id === page.id);
    if (index >= 0) {
      this.state.pages[index] = page;
    } else {
      this.state.pages.push(page);
    }
    this.save();
    console.log(`[MockDB] Saved page ${page.name} for tenant ${page.tenantId}`);
  }

  async deletePage(pageId: string): Promise<void> {
    await this.delay();
    this.state.pages = this.state.pages.filter(p => p.id !== pageId);
    this.save();
  }

  // --- LOGS ---

  async logAction(userId: string, tenantId: string, action: string, details: string) {
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      userId,
      tenantId,
      action,
      details,
      timestamp: Date.now()
    };
    this.state.auditLogs.unshift(log); // Prepend
    this.save();
  }

  async getAuditLogs(tenantId: string): Promise<AuditLog[]> {
    await this.delay();
    return this.state.auditLogs
      .filter(l => l.tenantId === tenantId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const mockDb = new MockDbService();
