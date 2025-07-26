# ♻️ ClearZone: Smart Waste Management System

**ClearZone** is a full-stack web application that empowers citizens to report waste-littered areas and enables municipal workers and administrators to track, manage, and resolve complaints efficiently. It’s built with **React.js**, **Node.js**, and **MongoDB**, and integrates **Google Maps API** for real-time location tracking.

---

## 🚀 Features

### 👥 Citizen Interface
- Upload images of waste areas.
- Auto-capture and send location data.
- Submit complaints through an intuitive UI.

### 👷 Worker Dashboard
- View and manage assigned complaints.
- Access map locations and waste images.
- Upload images of cleaned areas after task completion.

### 🛠️ Admin Panel
- Monitor all complaints and progress.
- Track worker performance.

---

## 🧰 Tech Stack

| Layer       | Technology            |
|-------------|------------------------|
| Frontend    | React.js               |
| Backend     | Node.js                |
| Database    | MongoDB with Mongoose  |
| Maps        | Google Maps API        |
| Auth        | JWT (JSON Web Tokens)  |

---

## ⚙️ Getting Started

### 🔧 Prerequisites
- Node.js
- npm
- MongoDB instance (local or cloud)
- Google Maps API key

### 🔄 Installation

```bash
# Clone the repo
git clone https://github.com/merin10/ClearZone.git
cd ClearZone

# Install backend dependencies
npm install

# Start backend server
npm run dev

# In a new terminal: install frontend
cd frontend
npm install

# Start frontend
npm start


ClearZone/
├── frontend/         # React frontend code
├── controllers/      # Backend route controllers
├── middleware/       # Auth & error handling
├── models/           # Mongoose schemas
├── routes/           # API routes
├── utils/            # Utility functions (e.g. email)
├── server.js         # Entry point for Node server
├── testEmail.js      # Email testing script

