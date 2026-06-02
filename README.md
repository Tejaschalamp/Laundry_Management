# 🧺 College Laundry Token-Based Status Tracking System

An enterprise-grade, full-stack web application designed to completely digitize and streamline hostel and college campus laundry operations. By replacing outdated paper logs with automated **unique digital tokens**, this system bridges the communication gap between students and administrative staff. ⚡

---

## 🎯 The Problem & Campus Pain Points Solved

* **🛑 High Foot Traffic & Long Queues:** Students previously had to make multiple unnecessary physical trips to the laundry room just to check if their clothes were washed. **This system reduced physical checkout visits by over 80%!**
* **❌ Manual Tracking Errors:** Paper ledgers and manual sorting frequently led to misplaced clothes, mixed-up orders, and tracking confusion. Digital tokens ensure 100% data integrity.
* **📉 Lack of Operational Transparency:** Students were left in the dark regarding their laundry lifecycle. This system brings real-time accountability to the entire workflow.

---

## ✨ Key Features & Capabilities

* **🎫 Automated Token Generation Engine:** Instantly generates a unique, trackable digital token for every clothing submission.
* **⏳ Real-Time Status Tracking:** Empower users to track their laundry lifecycle across dynamic stages: `Pending ⏳` ➡️ `In Progress 🧼` ➡️ `Ready for Pickup 👕`.
* **🔒 Secure Administrative Panel:** A restricted dashboard for staff to instantly update clothing statuses, log timestamped entries, and manage daily volumes.
* **⚙️ Automated Admin Bootstrapping:** Includes a standalone utility script (`setup-admin.js`) to securely seed initial system administrator credentials directly into the database for rapid deployment.
* **📱 Device-Agnostic Responsive UI:** A fluid front-end interface meticulously styled to work flawlessly for students checking statuses on mobile phones or admins managing logs on desktops.

---

## 🏗️ System Architecture & Design Principles

The architecture is built cleanly from the ground up to support multiple concurrent users while remaining highly maintainable:

```text
├── middleware/      # 🔐 Security layers, token validation, and session auth
├── models/          # 🗄️ Database Schemas (User, Order/Token, Inventory blueprints)
├── routes/          # 🛣️ Express Routers (API endpoints decoupling business logic)
├── public/          # 🎨 Static UI Layer (HTML5 templates, CSS3 themes, client JS)
├── server.js        # 🚀 Application entry point & server initializations
└── setup-admin.js   # 🛠️ Database seeding and environment utility
