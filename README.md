# CivGo — Smart Citizen Service Management System

## 📌 Project Overview

**CivGo** is a full-stack web application that helps citizens report public service issues digitally instead of visiting government offices physically. Citizens can submit complaints such as street light failures, water leakage, garbage collection delays, road damage, and drainage blockage.

The system enables administrators or local authorities to manage complaints efficiently, assign departments, update statuses, and track resolutions in real time.

---

## 🎯 Project Objective

To provide a transparent, efficient, and user-friendly digital platform for civic complaint management between citizens and authorities.

---

## 🚀 Key Features

### 👤 Citizen Module

* User Registration & Login
* Submit complaints online
* Upload complaint images
* Auto/manual location selection
* Track complaint status
* View complaint history
* Rate service after complaint resolution (1–5 stars)

### 🧑‍💼 Admin Module

* Secure Admin Login
* Dashboard analytics
* View all complaints
* Filter by category, status, and priority
* Assign departments
* Update complaint status
* Upload after-resolution image
* Track resolution time
* Export reports (PDF / Excel)

### 🔔 Additional Features

* JWT Authentication
* Password hashing using bcrypt
* Role-based authorization
* Real-time updates with Socket.io
* Notifications system
* Responsive UI
* Dark / Light mode (optional)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication / Security

* JWT
* bcryptjs
* Helmet
* CORS

### Other Tools

* Multer (image upload)
* Cloudinary (image storage)
* Socket.io
* Nodemailer
* Chart.js / Recharts

---

## 📁 Project Structure

```text
CivicConnect/
│── client/                 # Frontend React App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│
│── server/                 # Backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.js
│
│── README.md
```


## ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/civicconnect.git
cd civicconnect
```

---

## 2️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
```

---

## 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Default URLs

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

## 🔐 User Roles

### Citizen

* Register/Login
* Raise complaints
* Track complaints
* View history

### Admin

* Manage all complaints
* Assign departments
* Update statuses
* Generate reports

---

## 📊 Complaint Status Flow

```text
Pending → In Progress → Resolved
```

---

## 📸 Sample Complaint Categories

* Street Light
* Water Leakage
* Garbage Collection
* Road Damage
* Drainage Blockage
* Electricity
* Public Property

---

## 🎓 Academic Relevance

This project demonstrates:

* CRUD Operations
* Authentication & Authorization
* REST API Development
* Database Design
* Full Stack Integration
* Real-world Problem Solving
* Dashboard Analytics

---

## 🔮 Future Enhancements

* Mobile App version
* AI chatbot assistance
* Multi-language support
* GIS complaint heatmap
* SMS notifications
* Department SLA monitoring

---

## 👩‍💻 Developed By

Rakshitha D

---

## 📄 License

This project is for educational and academic purposes.
