# 💰 Expense Analyser

**Expense Analyser** is a full-stack web application that helps users manage and analyze their daily expenses efficiently. It allows users to add, categorize, filter, and visualize expenses over time, and also set budgets to control spending.

---

## 🚀 Tech Stack

### **Frontend**
- React.js (Vite / Create React App)
- Axios (for API communication)
- React Router DOM
- TailwindCSS / Bootstrap (depending on your setup)
- Chart.js or Recharts (for visual analytics)

### **Backend**
- Node.js
- Express.js
- MongoDB (with Mongoose ODM)
- JSON Web Token (JWT) for authentication
- bcrypt.js for password hashing
- dotenv for environment variables

---

## 📂 Folder Structure

```
expense-analyser/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── config/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   ├── package.json
│
└── README.md
```

---

## ⚙️ Features

### **Frontend**
- 🧾 Add, view, and delete expenses
- 🏷️ Categorize expenses (Food, Travel, Bills, etc.)
- 📅 Filter by category and date range
- 📊 Visualize expenses with charts
- 🔐 Secure user authentication (JWT)
- 💵 Display total expenses and remaining budget

### **Backend**
- 🧠 RESTful API built with Express.js
- 🧍 User registration & login with JWT
- 💸 CRUD operations for expenses
- 💰 Budget management API
- 📊 Aggregation endpoints for monthly/annual reports

---

## 🧩 API Overview

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/expenses` | Get all user expenses |
| POST | `/api/expenses` | Add a new expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/api/budgets` | Get budget data |
| POST | `/api/budgets` | Add or update budget |

---

## 🔐 Environment Variables

Create a `.env` file in the **backend** folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/sunil081103/expense-analyser.git
cd expense-analyser
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm start
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The app will typically run on:
- Frontend → http://localhost:5173 or http://localhost:3000
- Backend → http://localhost:5000

---

## 🌐 Deployment Notes

- **Frontend:** Deploy on Netlify or Vercel  
- **Backend:** Deploy on Render / Railway / AWS EC2  
- **Database:** Use MongoDB Atlas  
- Make sure to update API URLs in `frontend/src/services/api.js`

---

## 🧠 Future Enhancements

- 📅 Export expense data to Excel or PDF  
- 🔔 Expense limit notifications  
- 📈 AI-based spending analysis  
- 👥 Shared group budgeting  

---

## 👨‍💻 Author
**J M Sunil Sairaj**  
Full Stack Developer | Computer Science Student  
📧 sunilsairaj2210709@ssn.edu.in

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
