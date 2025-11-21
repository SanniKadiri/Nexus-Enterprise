
import React from 'react';

export enum ViewMode {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
}

export interface Page {
  id: string;
  tenantId: string;
  name: string;
  layout: WidgetInstance[];
  isSystem?: boolean; // System pages like Overview cannot be deleted
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

// --- MULTI-TENANCY & RBAC ---

export type Role = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
}

export interface TenantFeatures {
  enableAI: boolean;
  enableHR: boolean;
  enableCRM: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  plan: 'Enterprise' | 'Pro' | 'Starter';
  logoChar: string;
  theme: TenantTheme;
  features: TenantFeatures;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive';
  lastActive: number;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  details: string;
  timestamp: number;
}

// --- AI TYPES ---

export interface AIResponse {
  text: string;
  timestamp: number;
}

export enum AIRequestType {
  INSIGHT = 'INSIGHT',
  DRAFT = 'DRAFT',
  SUMMARIZE = 'SUMMARIZE'
}

// --- CONSTRUCT ENGINE TYPES ---

export type WidgetType = 
  | 'KPI_CARD' 
  | 'DATA_TABLE' 
  | 'CHART_PLACEHOLDER' 
  | 'TEXT_BLOCK' 
  | 'FORM_BUILDER'
  | 'KANBAN_BOARD'
  | 'TEAM_GRID'
  | 'TIMELINE'
  | 'RELATIONSHIP'
  // Enterprise Bricks
  | 'CALENDAR'        // HR, Scheduling, Shifts
  | 'PROCESS_FLOW'    // Manufacturing, Onboarding, Repair Steps
  | 'INVENTORY_GRID'  // Warehouse, Asset Tracking, Products
  | 'STATUS_BOARD'    // Machine Status, Room Occupancy, Server Health
  | 'MAP_VIEW'        // Logistics, Delivery, Site Locations
  | 'SERVICE_TICKET'  // CRM, Repair, Helpdesk
  | 'PATIENT_VITALS'  // Healthcare, Monitoring
  | 'RESOURCE_LIST';  // Knowledge Base, Manuals

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  title: string;
  colSpan: 1 | 2 | 3; // Grid column span (1-3)
  config: Record<string, any>; // Flexible prop storage
}

export interface DashboardSchema {
  id: string;
  name: string;
  pages: Page[];
}

export interface KPIWidgetProps {
  value: string;
  label: string;
  change: string;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'dark' | 'light';
  trendData?: number[];
}
