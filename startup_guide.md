# Startup Guide: User Management System

Follow these steps to run the project successfully on your local machine.

## Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **PostgreSQL**: Ensure a PostgreSQL instance is running.

---

## 1. Installation

Install all necessary dependencies for both the frontend and backend services.

### Automatic Installation (Recommended)
You can use the follow commands from the root directory to install everything:

```bash
# Install Frontend dependencies
cd frontend && npm install

# Install Backend microservices
cd ../backend/api-gateway && npm install
cd ../auth-service && npm install
cd ../user-service && npm install
cd ../notification-service && npm install
cd ../..
```

---

## 2. Environment Configuration

### Database Configuration
Update the `DATABASE_URL` and other secrets in the `.env` files within each service. You must have `.env` files in:
- `backend/api-gateway/.env`
- `backend/auth-service/.env`
- `backend/user-service/.env`
- `backend/notification-service/.env`

Example `DATABASE_URL`:
`DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"`

---

## 3. Database & Prisma Setup

Run these commands in the specific service directories to initialize the database:

```bash
# In Auth Service
cd backend/auth-service
npx prisma generate
npx prisma migrate dev --name init
npm run seed # Creates the Global Admin (globaladmin/password123)

# In User Service
cd ../user-service
npx prisma generate
npx prisma migrate dev --name init
```

---

## 4. Running the Project

### Start Backend Services
Use the provided script in the `scripts/` folder to launch all services in separate terminal windows (macOS):

```bash
bash scripts/start-backend.sh
```

### Start Frontend
In a new terminal:

```bash
cd frontend
npm run dev
```

Visit **[http://localhost:4000](http://localhost:4000)** to access the application dashboard.

---

## 5. Login Credentials (Post-Seed)

### Global Admin
- **Username**: `globaladmin`
- **Password**: `password123`

---

## Troubleshooting

- **Prisma Issues**: If you see "Prisma Client could not be found", run `npx prisma generate` in the specific service folder.
- **Port Conflicts**: Ensure ports 3000, 3002, 3003, 3006, and 4000 are free.
- **JSX Types Error**: If your IDE shows JSX errors, ensure you have run `npm install` in the `frontend` directory.
