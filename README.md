# BuzzApp Web Portal

School administration web portal for BuzzApp — Biometric Attendance & Safety System.

**CodeQuest 2026 | Group 99 | KNUST**

## What it does

The BuzzApp Web Portal is a browser-based dashboard used by school administrators, teachers, and parents to monitor student attendance, manage exeats, view academic results, and communicate with parents.

## User Roles

| Role | What they see |
|---|---|
| **Admin** | Full dashboard — attendance, students, exeats, results, messaging, staff, reports, settings |
| **Teacher** | Class attendance table with mark present and export |
| **Parent** | Child's attendance history and notifications |

## Demo Login

Go to the login page and click one of the demo buttons:
- **Admin** — full school dashboard
- **Teacher** — class attendance view
- **Parent** — child attendance history

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS

## How to Run

**Requirements:** Node.js installed

**Steps:**

```bash
# 1. Clone the repo
git clone https://github.com/Mobile-App-Dev-Group-99/buzz-web-portal.git

# 2. Go into the folder
cd buzz-web-portal

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev

# 5. Open in browser
http://localhost:5173
```

## Screens

- Login page with role-based access
- Admin Dashboard — live gate feed, stats, class attendance, alerts
- Gate Attendance — full scan log table
- Students — list with biometric status
- Exeat Management — approve/deny exeats
- Academic Results — grade submissions and delivery
- Messaging — parent inbox and announcements
- Staff Management — teacher and staff accounts
- Reports & Exports — PDF and Excel reports
- System Settings — school configuration
- Emergency Lockdown mode

## Repository

Part of the BuzzApp project:
- `buzz-mobile` — Expo mobile apps
- `buzz-web-portal` — this repo
- `buzz-backend` — Spring Boot microservices
- `buzz-database` — PostgreSQL schema

## Team

Group 99 | CodeQuest 2026 | KNUST