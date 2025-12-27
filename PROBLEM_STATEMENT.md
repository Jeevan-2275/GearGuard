# GearGuard: The Ultimate Maintenance Tracker

## 1. Module Overview

**Objective:** Develop a maintenance management system that allows a company to track its assets (machines, vehicles, computers) and manage maintenance requests for those assets.

**Core Philosophy:** The module must seamlessly connect Equipment (what is broken), Teams (who fix it), and Requests (the work to be done).

---

## 2. Key Functional Areas

### A. Equipment

The system serves as a central database for all company assets. Participants must create a robust "Equipment" record that tracks ownership and technical details.

#### Equipment Tracking
Use the search or group by for tracking the request:
- **By Department:** (e.g., A CNC Machine belongs to the "Production" department)
- **By Employee:** (e.g., A Laptop belongs to "Person name")

#### Responsibility
Each equipment must have a dedicated Maintenance Team and a technician is assigned to it by default.

#### Key Fields
- Equipment Name & Serial Number
- Purchase Date & Warranty Information
- Location: Where is this machine physically located?

---

### B. Maintenance Team

The system must support multiple specialized teams.

#### Team Structure
- **Team Name:** Ability to define teams (e.g., Mechanics, Electricians, IT Support)
- **Team Member Name:** Link specific users (Technicians) to these teams
- **Workflow Logic:** When a request is created for a specific team, only team members should pick it up

---

### C. Maintenance Request

This is the transactional part of the module. It handles the lifecycle of a repair job.

#### Request Types
- **Corrective:** Unplanned repair (Breakdown)
- **Preventive:** Planned maintenance (Routine Checkup)

#### Key Fields
- **Subject:** What is wrong? (e.g., "Leaking Oil")
- **Equipment:** Which machine is affected?
- **Scheduled Date:** When should the work happen?
- **Duration:** How long did the repair take?

---

## 3. The Functional Workflow

### Flow 1: The Breakdown

1. **Request:** Any user can create a request
2. **Auto-Fill Logic:** When the user selects an Equipment (e.g., "Printer 01"):
   - The system should automatically fetch the Equipment category and Maintenance Team from the equipment record and fill them into the request
3. **Request State:** The request starts in the **New** stage
4. **Assignment:** A manager or technician assigns themselves to the ticket
5. **Execution:** The stage moves to **In Progress**
6. **Completion:** The technician records the Hours Spent (Duration) and moves the stage to **Repaired**

### Flow 2: The Routine Checkup

1. **Scheduling:** A manager creates a request with the type **Preventive**
2. **Date Setting:** The user sets a Scheduled Date (e.g., Next Monday)
3. **Visibility:** This request must appear on the Calendar View on the specific date so the technician knows they have a job to do

---

## 4. User Interface & Views Requirements

### 1. The Maintenance Kanban Board

The primary workspace for technicians.

- **Group By:** Stages (New | In Progress | Repaired | Scrap)
- **Drag & Drop:** Users must be able to drag a card from "New" to "In Progress"
- **Visual Indicators:**
  - **Technician:** Show the avatar of the assigned user
  - **Status Color:** Display a red strip or text if the request is Overdue

### 2. The Calendar View

- Display all Preventive maintenance requests
- Allow users to click a date to schedule a new maintenance request

### 3. The Pivot/Graph Report (Optional/Advanced)

- A report showing the Number of Requests per Team or per Equipment Category

---

## 5. Required Automation & Smart Features

These features distinguish a basic form from a smart "Odoo-like" module.

### Smart Buttons

- **On the Equipment Form:** Add a button labeled "Maintenance"
- **Function:** Clicking this button opens a list of all requests related only to that specific machine
- **Badge:** The button should display the count of open requests

### Scrap Logic

- If a request is moved to the **Scrap** stage, the system should logically indicate that the equipment is no longer usable (e.g., log a note or set a flag)

---

## 6. Resources

**Mockup Link:** https://link.excalidraw.com/l/65VNwvy7c4X/5y5Qt87q1Qp

---

## 7. Technical Stack

### Backend
- Node.js + Express
- Sequelize ORM
- MySQL/PostgreSQL
- JWT Authentication
- Node-Cron (for scheduled tasks)

### Frontend
- React 19
- Vite
- React Router (navigation)
- Kanban Board Library
- Calendar Component
- State Management

---

## 8. Database Schema (Proposed)

### Tables

1. **Users**
   - id, name, email, password, role, avatar

2. **Departments**
   - id, name, description

3. **Maintenance_Teams**
   - id, team_name, description

4. **Team_Members**
   - id, team_id, user_id

5. **Equipment**
   - id, name, serial_number, category, purchase_date, warranty_expiry, location
   - department_id (FK), employee_id (FK), team_id (FK), default_technician_id (FK)

6. **Maintenance_Requests**
   - id, subject, description, type (corrective/preventive), stage (new/in-progress/repaired/scrap)
   - equipment_id (FK), team_id (FK), assigned_to (FK), scheduled_date, duration
   - created_at, updated_at

---

## 9. Key Features Checklist

- [ ] Equipment CRUD operations
- [ ] Department & Employee assignment
- [ ] Maintenance Team management
- [ ] Team Member assignment
- [ ] Maintenance Request creation
- [ ] Auto-fill equipment details on request
- [ ] Request stage management (New → In Progress → Repaired → Scrap)
- [ ] Kanban board with drag & drop
- [ ] Calendar view for preventive maintenance
- [ ] Smart buttons with request count
- [ ] Overdue visual indicators
- [ ] Scrap logic implementation
- [ ] User authentication & authorization
- [ ] Reporting & analytics

---

## 10. User Roles

1. **Admin:** Full system access, manage teams and equipment
2. **Manager:** Create requests, assign technicians, view reports
3. **Technician:** View assigned requests, update status, log duration
4. **Employee:** Create requests for their equipment

---

## 11. Business Rules

1. Only team members can be assigned to requests for their team
2. Requests automatically inherit team from selected equipment
3. Preventive maintenance must have a scheduled date
4. Duration is recorded only when moving to "Repaired" stage
5. Overdue requests show visual warnings
6. Scrapped equipment should be flagged in the system
7. Smart buttons show real-time count of open requests

---

## 12. Success Criteria

✅ Users can track all company assets  
✅ Maintenance teams can be organized and managed  
✅ Requests flow smoothly through stages  
✅ Technicians have clear visibility of their tasks  
✅ Preventive maintenance is scheduled and visible  
✅ System provides smart automation and auto-fill features  
✅ Reports provide insights on maintenance operations  
