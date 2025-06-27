
#  SparkBook — Instagram Clone

**SparkBook** is a full-featured Instagram-inspired web app that allows users to share their stories through images and captions. It supports user authentication, content feeds, likes, comments, and profile management — all wrapped in a clean and responsive UI.

---

##  Features

-  **Authentication**  
  Register and log in securely with protected routes and session persistence.

-  **User Profiles**  
  View your own posts in a grid layout, along with basic profile info.

-  **Image Post Upload**  
  Upload image posts with captions that are instantly visible on the feed.

-  **Live Feed**  
  Explore recent posts from all users, updated in real time.

-  **Likes**  
  Like/unlike posts and see like counts update dynamically.

-  **Comments**  
  Comment on posts and join in conversations.

---

##  Folder Structure
```
sparkbook/
├── client/                      # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/              # Images, icons, etc.
│   │   ├── components/          # Reusable UI components (e.g., Navbar, PostCard)
│   │   ├── pages/               # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── PostUploadPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── styles/              # CSS/SCSS/Tailwind files
│   │   │   ├── HomePage.css
│   │   │   ├── LoginPage.css
│   │   │   ├── RegisterPage.css
│   │   │   ├── PostUploadPage.css
│   │   │   └── ProfilePage.css
│   │   ├── utils/               # Helper files
│   │   │   └── auth.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── .env                 # (optional) frontend config
│   ├── package.json
│   └── tailwind.config.js       # If using Tailwind CSS
│
├── server/                      # Express + MongoDB Backend
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verify logic
│   ├── .env
│   ├── index.js
│   └── package.json
│
└── README.md

```

---

##  Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/sparkbook.git
cd sparkbook
```

### 2. Start Backend
```bash
cd server
npm install
# Add .env with MONGO_URI and JWT_SECRET
node index.js
```
### 3. Start Frontend
```bash
cd ../client
npm install
npm start
```

# Environment Variables (server/.env)
```ini
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_key
```

---

# Contribution
Pull requests are welcome! If you’d like to contribute:
- Fork the repo
- Create a feature branch
- Submit a PR with clear description
  
---

### 📜 License

MIT License
© 2025 Yash Kansal

---

### 🔗 Connect with Me

[LinkedIn](https://www.linkedin.com/in/yashkansal/)
[GitHub](https://github.com/Kansal-ji)
[Profile](https://yash-kansal.netlify.app/)
