⚙️ Scalable Multi-User Claim Management System
A full-stack MERN application designed for content creators to claim earnings based on post engagement (likes & views), with a hierarchical review workflow involving Account and Admin roles. Includes real-time approval form locking, deduction handling, advanced filtering, and final settlement report generation.

💬 Built with: React + Node.js + Express + MongoDB + Socket.IO
🔐 Role-based access: User | Account Reviewer | Admin
📦 Realtime Locking • Claim Loopbacks • Deduction Tracking • CSV/JSON Reports

📌 Table of Contents
🌟 Features

🧑‍💻 Roles & Permissions

🧠 System Workflow

🛠️ Tech Stack

📂 Project Structure

🚀 Getting Started

🌐 Deployment Notes

📎 API Reference

🧾 Final Report Export

🧱 Nested Routing Info

📬 Contact & Credits

🌟 Features
✅ User Post Creation (image + text)
✅ Claim Submission with media proof (views, likes, screenshot URL)
✅ Real-Time Locking of claim forms via Socket.IO
✅ Account Role: Review, approve, or apply deductions with reasons
✅ Admin Role: Final claim approval + report generation
✅ Advanced Filtering (date, user, status, deduction, earnings, etc.)
✅ Claim Loopback System: User ↔ Account ↔ Admin
✅ CSV/JSON Final Settlement Reports
✅ JWT Authentication + Role-based Access
✅ Responsive UI built with TailwindCSS

🧑‍💻 Roles & Permissions
Role	Abilities
User (Content Creator)	Create posts, submit claims, respond to deductions
Account (Finance Reviewer)	Review claims, apply deductions, approve/loop back
Admin	Final approval, export reports, manage global settings

🧠 System Workflow
pgsql
User (Claim Submission)
       ⬇
Account Reviewer
(Approve / Deduct → User Response)
       ⬇
   If accepted ⟶ Admin Approval
   If declined ⟶ Loopback to Account
       ⬇
  Final Settlement Logged + Exported
  
🛠️ Tech Stack
Frontend

React + Vite + React Router v6

TailwindCSS for UI

Axios for HTTP requests

Context API for Auth & Socket state

Backend

Node.js + Express

MongoDB + Mongoose

JWT Authentication

Socket.IO for real-time locking

CSV/JSON utilities for reporting

📂 Project Structure
📁 Backend (Express API)
bash

/controllers
/models
/routes
/middlewares
/utils
server.js
.env

📁 Frontend (React + Vite)
bash

/src
 ├─ /pages
 ├─ /components
 ├─ /services
 ├─ /context
 ├─ /layouts
 ├─ /routes
 └─ /hooks
vite.config.js
tailwind.config.js

🚀 Getting Started

1. Clone Repos
bash
# Backend
git clone https://github.com/your-username/claim-management-backend.git
cd claim-management-backend
npm install
bash

# Frontend
git clone https://github.com/your-username/claim-management-frontend.git
cd claim-management-frontend
npm install

2. Environment Variables
🗂️ Backend .env
init
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

4. Run Locally
bash
# Start backend
npm run dev

# Start frontend
npm run dev
🌐 Deployment Notes
Backend (Replit)
The backend is hosted on Replit, which provides a free online Node.js environment.

Your backend API will be served at:
https://your-replit-username.repl.co (or similar)

Make sure to update the frontend .env with:

init
VITE_BACKEND_URL=https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev

✅ Don't forget to enable Replit's "Web View" and keep the backend always on with Replit Deployments or Replit's Hacker plan if needed.

📎 API Reference (Backend)
Endpoint	Method	Role	Description
/api/posts	POST	User	Create a post
/api/claims	POST	User	Submit a claim
/api/claims/review	PUT	Account	Review or apply deduction
/api/claims/final	PUT	Admin	Final approval
/api/claims/export	GET	Admin	Download CSV/JSON

🧾 Final Report Export
Admins can filter and export approved claims as:

📄 CSV (for Excel)

📦 JSON (for data pipelines)

Includes:

Creator Info

Approved Amount

Deduction Details

Approver Timestamps

🧱 Nested Routing Info
🔀 Routes are nested (e.g., /dashboard/account/review).
Use browser back or one-level URL updates to navigate manually.
If routing fails on deployment, try refreshing one level above.

📬 Contact & Credits
👤 Author: Abhishek Choudhary

🛠️ Built using Open Source Tools

🗃️ Source: Backend Repo | Frontend Repo

📌 If Replit backend fails, make sure MongoDB URI and JWT secret are correctly configured.
PRs & Issues welcome!
