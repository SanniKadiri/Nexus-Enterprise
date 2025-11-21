
📂 NEXUS ENTERPRISE OS: MASTER SPECIFICATION
Version: 2.9.0 (Phase 3 Expansion)
Architectural Style: Neo-Brutalist / High-Performance
Core Philosophy: "Scaling Without Limits."

1. Executive Summary
Nexus is a multi-tenant SaaS boilerplate designed for speed, scalability, and visual impact. Unlike traditional "clean" SaaS templates, Nexus uses a high-contrast, brutalist aesthetic to convey reliability and engineering rigor. Its differentiator is the "Construct Engine," a built-in no-code/low-code visual builder allowing non-technical admins to compose complex dashboards and workflows via drag-and-drop.

2. Feature Specification
A. The "Construct Engine" (No-Code Builder)
  Concept: A visual interface where admins define the layout of their tenant's workspace.
  Mechanics:
    Drag-and-Drop Canvas: Grid-based layout system.
  Component Library: Pre-built "Bricks" (Charts, Tables, AI Widgets, KPI Cards, Forms).
    State Management: The layout is saved as a JSON schema in the database. The frontend interprets this JSON to render the view.
  Live Preview: "Edit Mode" vs. "View Mode" toggle.
B. AI Intelligence Layer (Gemini Powered)
  Predictive Analytics: Analyze table data to forecast trends (e.g., "Revenue is projected to dip on Tuesday").
  Natural Language Querying: "Show me all users from Japan who signed up last week" -> Converts to Filter/SQL.
  Generative Reporting: Auto-generate PDF summaries of dashboard states.
C. Enterprise Security & Architecture
  Multi-Tenancy:
    Logical Isolation: tenant_id on every database record.
    Row-Level Security (RLS): Enforced at the database level (Supabase/Postgres).
  Authentication:
    RBAC (Role-Based Access Control): SuperAdmin, TenantAdmin, User, Viewer.
    MFA (Multi-Factor Authentication) enforcement settings.
    SSO (Single Sign-On) placeholders for SAML/OIDC.
  Audit Logs: Immutable logs of every critical action (Login, Delete, Export).
D. UX/UI & Design System ("The Nexus Look")
  Neo-Brutalism:
    Hard Shadows: box-shadow: 4px 4px 0px black.
    Typography: Tight tracking, uppercase headers, monospaced data.
    Motion: Spring physics for interactions; heavy, mechanical transitions.
  Accessibility: High contrast ratios (WCAG AAA), keyboard navigation support.

3. Technical Stack
    Layer	                  Technology	                  Reasoning
    Frontend	              React 19, TypeScript	        Industry standard, performance.
    Styling	                Tailwind CSS	                Rapid development, brutalist config.
    State	                  Context API + Reducers	      Complex local state (Dashboard Builder).
    Drag & Drop	            Native HTML5 Drag API	        No external dependencies, lightweight.
    AI Model	              Google Gemini 2.5 Flash	      Low latency, high reasoning for business data.
    Build Tool	            Vite	                        Instant HMR (Hot Module Replacement).

4. Developer Task List (Single Source of Truth)
This list guides the development process. Agents and developers must check items off here.

🔴 Phase 1: Core Architecture & Design (COMPLETED)

    [x] Project scaffolding (Vite + TS).

    [x] Design System Implementation (Brutalist UI components).

    [x] Basic Routing (Landing -> Login -> Dashboard).

    [x] Mock Authentication Flow.

    [x] Gemini AI Service Integration.

🟡 Phase 2: The "Construct" No-Code Engine (COMPLETED)

    [x] Data Structure: Define the DashboardSchema JSON interface (layout, widgets, config).

    [x] Edit Mode: Create a toggle in Dashboard to switch between "View" and "Edit".

    [x] Widget Registry: Create a mapping of string keys (e.g., 'REVENUE_CHART') to React components.

    [x] Drag Interface: Implement basic visual reordering of widgets (Native HTML5 DnD).

    [x] Property Editor: A side panel/modal to configure selected widgets.

    [x] Component Expansion Pack (v2.7):
        [x] CRM/HR: Calendar, Team Grid, Relationship.
        [x] Operations: Process Flow, Status Board.
        [x] Logistics: Inventory Grid, Map View.
        [x] Specialized: Service Ticket, Patient Vitals, Resource List.
        [x] Management: KPI with trend lines, Data Tables with row selection.

🔵 Phase 3: Advanced Data & Multi-Tenancy (IN PROGRESS)

    3.1 The "Mock-End" (Simulated Backend Service)
    [ ] Create `services/mockDb.ts`: A robust, relational-like in-memory database using LocalStorage.
        - Tables: `Tenants`, `Users`, `Pages`, `AuditLogs`.
        - Relationships: Users belong to Tenants; Pages belong to Tenants.
    [ ] Implement Latency Simulation: Add a 200-500ms random delay to all data calls to simulate real-world network conditions.
    [ ] Persistence: Ensure "Construct" layout changes are saved to the Mock DB so they persist after refresh.

    3.2 Advanced Multi-Tenancy
    [ ] Tenant Configuration Object: Extend `Tenant` type to include:
        - `theme`: Primary color, font overrides.
        - `features`: Boolean flags for enabled modules (e.g., `enableAI`, `enableHR`).
    [ ] Theming Engine: Update `App.tsx` to inject CSS variables based on the active tenant's configuration (e.g., Coca-Cola gets Red, John Deere gets Green).
    [ ] Data Isolation: Ensure switching tenants strictly filters data in the Mock DB.

    3.3 Role-Based Access Control (RBAC)
    [ ] Role Definitions: Define permissions for `OWNER`, `ADMIN`, `EDITOR`, `VIEWER`.
    [ ] Permission Guards:
        - Create `<Restricted to={['ADMIN']}>` wrapper component.
        - Hide "Edit Layout" button for non-admins.
        - Read-only mode for `VIEWER` role on forms.

    3.4 User Management Module ("The Salesforce Killer")
    [ ] Team Directory Page:
        - Data Table listing all users in the current tenant.
        - "Invite Member" Modal with Role selection.
        - "Revoke Access" action.
    [ ] User Profile: Slide-over panel showing user activity logs and assigned permissions.

    3.5 Global Command Center
    [ ] Implement `Cmd+K` (Command Palette):
        - Quick navigation between pages.
        - "Search Users".
        - "Switch Tenant".
        - "Create Ticket" shortcut.

🟣 Phase 4: Polish & "Delighters"

    [x] Draggable/Movable Toolbar.

    [ ] Skeleton Loaders: Brutalist shimmering block loaders for the Mock DB latency.

    [ ] Toast Notifications: Stackable, swipeable error/success messages.

    [ ] Parallax Refinement: Smooth out landing page scroll effects.

5. Architectural Diagram: The "Construct" Engine
How the Drag-and-Drop System works technically:

graph TD
    A[Admin User] -->|Enters Edit Mode| B(Dashboard Builder UI)
    B -->|Drags Component| C[Local State Manager]
    C -->|Updates| D{JSON Schema}
    D -->|Example| E["{ type: 'CHART', x: 0, y: 0, w: 2, h: 2 }"]
    B -->|Clicks Save| F[API / Mock DB]
    
    G[End User] -->|Logs In| H(Dashboard Viewer)
    H -->|Fetches JSON| F
    H -->|Maps JSON to Components| I[Widget Registry]
    I -->|Renders| J[Final UI]

6. Next Steps
    Begin Sub-task 3.1: Create the MockDb service.
