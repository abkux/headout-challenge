# The Globetrotter Challenge – The Ultimate Travel Guessing Game!

---

## 📂 Project Structure ( backend )

```
/backend
├── /prisma                   # Prisma client and schema
├── /routes                   # Route handlers
│   ├── authRoutes.js         # User authentication routes
│   ├── gameRoutes.js         # Game-related routes
│   └── miscRoutes.js         # Misc Routes ( only 1 )
├── /controllers              # Controller functions
│   ├── authController.js     # Handles login and registration
│   ├── gameController.js     # Handles game logic
│   └── miscController.js     # Handles misc logic only 1 (username check)
├── /middleware
│   └── authMiddleware.js     # Middleware to authenticate and validate session
├── /prisma
│   └── client.js             # Prisma database connection
├── .env                      # Environment variables
├── index.js                 # Main server entry point
└── README.md                 # Project documentation
```

---

## ⚡️ Tech Stack

| Technology | Description |
| ---------- | ----------- |
|            |             |

| **Node.js**    | Backend runtime                    |
| -------------- | ---------------------------------- |
| **Express.js** | Web framework for Node.js          |
| **Prisma**     | ORM for PostgreSQL                 |
| **PostgreSQL** | Database                           |
| **JWT**        | Authentication via JSON Web Tokens |
| **bcryptjs**   | Password hashing                   |
| **nanoid**     | Unique session generation          |
| **dotenv**     | Environment variable management    |
| **CORS**       | Cross-origin resource sharing      |

---
## 🪣 Database ER Diagram
![Prisma_ER_Diagram](./media/prisma-erd.svg)

---

## 🛠️ Setup Instructions

### 1. 📥 Clone the Repository

```bash
git clone https://github.com/abkux/headout-challenge.git
cd headout challenge
```

### 2. 📚 Install Dependencies

```bash
npm install
```

### 3. ⚙️ Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```bash
PORT=5000
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
JWT_SECRET=your_jwt_secret
```

> Replace placeholders with appropriate values.

---

## 📡 Database Setup

### 1. 🎲 Migrate Prisma Schema

Run the following command to apply Prisma migrations:

```bash
npx prisma migrate dev --name init
```

### 2. 🔍 Generate Prisma Client

```bash
npx prisma generate
```

---

## 🚀 Run the Application

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Start the Production Server

```bash
npm start
```

---

## 🔥 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and generate token/session

### Game Routes

- `GET /api/game/question` - Get a new question
- `POST /api/game/answer` - Submit an answer and check correctness
- `PUT /api/game/score` - Update the user score

---

