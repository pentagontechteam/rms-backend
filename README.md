# 🚀 AATC-RMS — AN INCIDENT AND REPORT MANAGEMENT SYSTEM

This is the **backend API** for the AATC-RMS system — a real-time, role-based file sharing system built for supervisor-vendor incident report submission and management at AATC Abuja.

> It supports user authentication, role management, vendor creation and report management.

---

## 🛠️ Built With

Backend stack:

- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

---

## ✨ Key Features

- 🔐 User authentication with refresh tokens
- 🎓 Role-based accounts: **Vendor** or **Supervisor**
- 📧 OTP email verification
- 🧱 PostgreSQL (Neon) for database

---

## ⚙️ How To Run the Backend Locally

### 1. Clone the repository

```bash
git clone https://github.com/pentagontechteam/rms-backend.git
cd rms-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

In the root directory, create a `.env` file with the following variables (values required but not provided here):

```env
# Port
PORT=4000

# PostgreSQL / Prisma
DATABASE_URL=
POSTGRES_USER=
POSTGRES_DB=
POSTGRES_PASSWORD=

# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=

# JWT Tokens
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

```

> These values are required for the server to run correctly. Contact the maintainer if you need access to a `.env` example.

---

### 4. Apply Prisma schema

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the development server

```bash
npm run dev
```

> Server runs at:  
> ⚙️ `http://localhost:4000`

---

## 🧩 Project Structure

```bash
spaces-backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth and validation middleware
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── prisma/           # Prisma schema and client
├── .env                  # Environment variables (not committed)
├── prisma/schema.prisma  # Database schema
└── README.md
```

---

## 🧪 Troubleshooting

- Ensure your PostgreSQL and Redis services are reachable.
- Double-check `.env` values and format (no spaces around `=`).
- Use `npx prisma studio` to inspect and debug your DB locally.
- Restart your dev server after any `.env` changes.

---