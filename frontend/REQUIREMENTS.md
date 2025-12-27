# 🎨 GearGuard Frontend - End-to-End Requirements

This document outlines the frontend specifications to support the complete 60-page user flow defined for GearGuard.

---

## 1. 🏗️ Tech Stack

*   **Framework:** React 19 + Vite
*   **Language:** TypeScript (Recommended) or JavaScript
*   **Styling:** Tailwind CSS (for rapid "Enterprise" UI) + ShadcnUI (optional, but good for polished look)
*   **State Management:** Zustand or Redux Toolkit
*   **Routing:** React Router v6+
*   **HTTP Client:** Axios or TanStack Query (React Query)
*   **Icons:** Lucide-React or Heroicons
*   **Charts:** Recharts or Chart.js
*   **Kanban:** @hello-pangea/dnd or React-Beautiful-DND
*   **Calendar:** React-Big-Calendar or FullCalendar
*   **Forms:** React Hook Form + Zod
*   **Notifications:** Sonner or React-Hot-Toast

---

## 2. 🧭 Routing Structure

### A. Public Routes (No Auth)
*   `/login` - Login Page
*   `/forgot-password` - Forgot Password
*   `/reset-password` - Reset Password
*   `/404` - Not Found
*   `/500` - Server Error

### B. Protected Routes (Requires Login)
Layout: `MainLayout` (Sidebar + Topbar + Content Area)

#### 🏠 Universal Access
*   `/` - Redirects to `/dashboard`
*   `/dashboard` - Role-based Dashboard (Admin/Manager/Tech/Employee)
*   `/profile` - User Profile
*   `/notifications` - Notifications Center
*   `/search` - Global Search Results
*   `/help` - Help & Documentation

#### 🏭 Equipment Module
*   `/equipment` - Equipment List
*   `/equipment/create` - Add Equipment
*   `/equipment/:id` - Detail View
*   `/equipment/:id/edit` - Edit Equipment
*   `/equipment/scrapped` - Scrapped List

#### 👥 Admin Module (Admin Only)
*   `/admin/overview` - System Statistics
*   `/admin/users` - User Management List
*   `/admin/users/create` - Create User
*   `/admin/users/:id` - Edit User
*   `/admin/roles` - Permissions View
*   `/admin/teams` - Maintenance Team List
*   `/admin/teams/create` - Create Team
*   `/admin/teams/:id` - Edit Team
*   `/admin/settings` - System Settings
*   `/admin/audit-logs` - Activity Logs

#### 🛠️ Maintenance & Tasks
*   `/maintenance` - Kanban Board (Main Workspace)
*   `/maintenance/list` - List View (Alternative to Kanban)
*   `/maintenance/create` - Create Request
*   `/maintenance/:id` - Request Detail
*   `/maintenance/:id/edit` - Edit Request
*   `/maintenance/my-assigned` - "My Tasks" (Technician specific)
*   `/maintenance/my-raised` - "My Requests" (Employee specific)
*   `/maintenance/calendar` - Calendar View (Preventive)
*   `/maintenance/overdue` - Overdue List
*   `/maintenance/scrap` - Scrap Request List

#### 📊 Reports & Analytics (Admin/Manager)
*   `/reports` - Reports Dashboard
*   `/reports/team` - Requests per Team
*   `/reports/equipment` - Requests per Equipment
*   `/reports/faulty` - Most Faulty Screen

---

## 3. 🧩 Key Components & Layouts

### 1. Main Layout (The "Shell")
*   **Sidebar:** Navigation links (collapsible), Logo.
*   **Top Bar:** Global Search Bar, Notification Bell (with badge), User Avatar Dropdown (Profile, Logout).
*   **Breadcrumbs:** Auto-generated e.g., `Home > Equipment > Generator X`.

### 2. Dashboard Widgets (Role-Based)
*   **Admin:** "Total Users", "System Health", "Active Teams".
*   **Manager:** "Open Requests", "Overdue Requests", "Team Workload".
*   **Technician:** "My Pending Tasks", "Upcoming Schedule".
*   **Employee:** "My Active Requests".

### 3. Equipment Detail View
*   **Header:** Image (Left), Key Info (Right - Serial, Location, Status).
*   **Tabs:**
    *   *Details:* Full specs.
    *   *History:* Timeline of past repairs (Audit Log).
    *   *Docs:* Manuals/PDFs.
*   **Smart Button:** "Maintenance (5)" - Clicks to filtered request list.

### 4. Kanban Board
*   **Columns:** New, In Progress, Repaired, Scrap.
*   **Cards:** Subject, Equip Name, Priority Color, Avatar of Assignee.
*   **Drag & Drop:** Updates status via API.

---

## 4. 🎨 UI/UX Polish (The "Wow" Factor)

*   **Empty States:** Custom SVG illustrations for "No Data" (e.g., Pages 17, 25, 31, 41, 47).
*   **Loading Skels:** Skeleton loaders for tables and cards while fetching data (Page 51).
*   **Micro-interactions:**
    *   Button hover effects.
    *   Toast notification animations.
    *   Modal transitions.
*   **Error Handling:**
    *   Form validation messages (inline red text).
    *   Network error toast/boundary.

---

## 5. 📂 Recommended File Structure

```
frontend/
├── src/
│   ├── assets/             # Images, SVGs
│   ├── components/         # Reusable UI parts
│   │   ├── common/         # Button, Input, Modal, Table
│   │   ├── layout/         # Sidebar, Navbar, PageWrapper
│   │   └── ui/             # Complex UI (KanbanBoard, Calendar)
│   ├── features/           # Feature-based folders
│   │   ├── auth/           # Login form, protection logic
│   │   ├── equipment/      # Lists, forms, details
│   │   ├── maintenance/    # Kanban, forms, calendar
│   │   └── admin/          # User management, reports
│   ├── hooks/              # Custom React hooks (useAuth, useFetch)
│   ├── pages/              # Page components (Mapped to Routes)
│   ├── services/           # API calls (axios instances)
│   ├── store/              # Global state (auth, theme)
│   ├── utils/              # Formatters (date, currency)
│   └── App.tsx             # Route definitions
└── package.json
```
