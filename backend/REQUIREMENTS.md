# 🛠️ GearGuard Backend - Comprehensive Requirements

This document overrides previous partial requirements. It combines the core hackathon problem statement with enterprise-level features required to support the 60-screen frontend.

---

## 1. 🏗️ Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MySQL
*   **ORM:** Sequelize
*   **Authentication:** JWT (JSON Web Tokens)
*   **File Storage:** Multer (Local uploads to `public/uploads`) or Cloudinary (Optional)
*   **Email Service:** Nodemailer (Gmail SMTP or Ethereal/Mailtrap for dev)
*   **Scheduling:** Node-Cron (for automated checks)
*   **Validation:** Joi or Zod (for request body validation)

---

## 2. 🗄️ Database Schema (Expanded)

### A. Core Tables (From Problem Statement)

1.  **Users**
    *   `id` (PK), `name`, `email` (Unique), `password_hash`, `role` (Admin, Manager, Technician, Employee), `avatar_url` (Nullable), `status` (Active/Inactive), `created_at`.
2.  **Departments**
    *   `id` (PK), `name`, `description`.
3.  **Maintenance_Teams**
    *   `id` (PK), `team_name`, `description`.
4.  **Team_Members**
    *   `id` (PK), `team_id` (FK), `user_id` (FK).
5.  **Equipment**
    *   `id` (PK), `name`, `serial_number`, `category`, `image_url` (Nullable), `purchase_date`, `warranty_expiry`, `location`, `status` (Active/Scrapped/Maintenance).
    *   `department_id` (FK), `assigned_employee_id` (FK), `maintenance_team_id` (FK).
6.  **Maintenance_Requests**
    *   `id` (PK), `subject`, `description`, `type` (Corrective/Preventive), `priority` (Low/Medium/High).
    *   `stage` (New, In Progress, Repaired, Scrap).
    *   `equipment_id` (FK), `assigned_team_id` (FK), `assigned_technician_id` (FK - Nullable).
    *   `scheduled_date` (For Preventive), `completion_date` (Nullable).
    *   `hours_spent` (Float, Nullable).

### B. New "Enterprise" Tables (Gap Analysis)

7.  **Notifications**
    *   `id` (PK), `user_id` (FK), `title`, `message`, `type` (Assignment, Overdue, System), `is_read` (Boolean, Default: false), `related_entity_id` (Nullable), `created_at`.
8.  **Audit_Logs**
    *   `id` (PK), `action` (Create, Update, Delete, Login), `entity_table` (Requests, Equipment), `entity_id` (INT), `actor_id` (FK - User), `changes` (JSON/Text - stores before/after diff), `timestamp`.
    *   *Note: This drives the "History Timeline" and "Activity Log" pages.*
9.  **Password_Resets**
    *   `id` (PK), `email`, `token`, `expires_at`.
10. **System_Settings**
    *   `id` (PK), `key` (e.g., 'working_hours_start'), `value` (e.g., '09:00').

---

## 3. 🔌 API Requirements

### 🔐 Authentication Module
*   `POST /api/auth/login` - Returns JWT + User Info.
*   `POST /api/auth/forgot-password` - Generates token & sends email via Nodemailer.
*   `POST /api/auth/reset-password` - Verifies token & updates password.
*   `POST /api/auth/logout` - (Client-side token removal, optional server blacklist).

### 👥 User & Role Management (Admin)
*   `GET /api/users` - List all users (with filters).
*   `POST /api/users` - Create new user (with Role).
*   `PUT /api/users/:id` - Update details/role.
*   `DELETE /api/users/:id` - Soft delete/deactivate.

### 🏢 Organization Management (Admin)
*   **Departments**
    *   `GET /api/departments` - List for dropdowns.
    *   `POST /api/departments` - Create.
    *   `PUT /api/departments/:id` - Update.
    *   `DELETE /api/departments/:id` - Delete.
*   **Maintenance Teams**
    *   `GET /api/teams` - List teams.
    *   `POST /api/teams` - Create team.
    *   `PUT /api/teams/:id` - Update (Add/Remove members logic handled here or separate endpoint).
    *   `DELETE /api/teams/:id` - Delete.
    *   `POST /api/teams/:id/members` - Add member to team.
    *   `DELETE /api/teams/:id/members/:userId` - Remove member.

### 🏭 Equipment Module
*   `GET /api/equipment` - List with search/filter (Dept, Employee).
*   `POST /api/equipment` - Create (Handle Image Upload via Multer).
*   `GET /api/equipment/:id` - Details + Associated Active Requests count.
*   `PUT /api/equipment/:id` - Update.
*   `GET /api/equipment/:id/maintenance-history` - Returns list of past requests for this item.

### 🛠️ Maintenance Request Module
*   `GET /api/requests` - Kanban Board Data (Grouped by Stage) or List View.
*   `POST /api/requests` - Create.
    *   *Logic:* Auto-assign `team_id` based on Equipment's team.
*   `PUT /api/requests/:id` - Update Stage/Assignee/Schedule.
    *   *Logic:* If Stage -> "Repaired", require `hours_spent`.
    *   *Logic:* If Stage -> "Scrap", trigger Equipment Status Update.
*   `GET /api/requests/calendar` - Returns only requests with `scheduled_date` (for Calendar View).
*   `GET /api/requests/my-assigned` - Filter by logged-in Technician ID.

### 🔔 Notifications & Search
*   `GET /api/notifications` - Get unread for current user.
*   `PUT /api/notifications/:id/read` - Mark as read.
*   `GET /api/search` - Global Search Endpoint.
    *   *Query:* `?q=laptop`
    *   *Returns:* `{ users: [...], equipment: [...], requests: [...] }`

### 📊 Analytics (Admin/Manager)
*   `GET /api/stats/dashboard` - High-level counts (Open requests, Overdue, Total Equipment).
*   `GET /api/stats/faulty-equipment` - Top 5 equipment with most breakdown requests.
*   `GET /api/stats/team-performance` - Avg time to repair per team.

---

## 4. 🤖 Automation & Logic

1.  **Auto-Assignment Logic:**
    *   When a Request is created for "Printer A" (Managed by IT Team), the Request's `team_id` must automatically be set to "IT Team".
2.  **Scrap Workflow:**
    *   Moving a Request to "Scrap" stage -> Automatically updates Equipment status to "Scrapped".
3.  **Overdue Checker (Cron Job):**
    *   Runs daily/hourly. Checks if `scheduled_date` < `NOW` and stage is not "Repaired".
    *   Creates a **Notification** for the assigned Technician/Manager.
    *   Flag visually in API response (`is_overdue: true`).

---

## 5. 📂 File Structure Proposal

```
backend/
├── src/
│   ├── config/         # DB connection, Env vars
│   ├── controllers/    # Request logic
│   ├── middlewares/    # Auth, Role check, File Upload (Multer)
│   ├── models/         # Sequelize definitions
│   ├── routes/         # API Route definitions
│   ├── services/       # EmailService, CronJobs
│   ├── utils/          # Helpers (Error handling, etc)
│   └── app.js          # Entry point
├── public/
│   └── uploads/        # Stored images
├── .env
└── package.json
```
