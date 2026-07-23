# 📌 TaskPulse - Modern Task Management Application

TaskPulse is a sleek, responsive, and modern Full-Stack Task Management Application built with React, Node.js, Express, and MySQL. It features secure user authentication, real-time analytics, dynamic status toggling, search capabilities, and user profile management with image uploads.

---

## 🚀 Features

- 🔑 **Secure Authentication:** User registration and login using JWT (JSON Web Tokens) and Bcrypt password hashing.
- 📌 **Task Management (CRUD):** Add, Edit, Update Status (Pending/Completed), and Delete tasks effortlessly.
- 🚨 **Deletion Guard:** Custom Confirmation Modals for task deletion to prevent accidental loss.
- 🔔 **Toast Notifications:** Smooth and interactive alerts using `react-toastify`.
- 📊 **Real-time Analytics:** Interactive completion progress bar and statistical indicators.
- 🔍 **Search & Filter:** Instant local task search functionality.
- 👤 **Profile Management:** User profile page with image upload support powered by `Multer`.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** Custom CSS3 (Modern SaaS Theme)
- **UI Components:** `react-toastify`

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **FileUpload:** Multer
- **Security:** Bcrypt, JSON Web Token (JWT)

### **Database**
- MySQL

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js installed on your system
- MySQL Server running

```bash
# 1. Clone the Repository
git clone [https://github.com/Marinsha/task-manager-app.git](https://github.com/Marinsha/task-manager-app.git)
cd task-manager-app

# 2. Setup & Start Backend
cd task-manager-backend
npm install
npm run dev

# 3. Setup & Start Frontend
cd ..
cd task-manager-frontend
npm install
npm run dev
