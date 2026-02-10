# Startup Guide: User Management System

Follow these steps to run the project successfully on the local machine.

## Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **PostgreSQL**: Ensure a PostgreSQL instance is running and have a valid database .

---

## 1. Database Configuration

Update the `DATABASE_URL` in the following files with PostgreSQL credentials:

- `backend/auth-service/.env`
- `backend/user-service/.env`

Example:
`DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/user_management?schema=public"`

---

## 2. Initialize Database (Prisma)

Run these commands in both service directories to sync the schema and generate the Prisma client.

```bash
# In Auth Service
cd backend/auth-service
npx prisma migrate dev --name init
npm run seed # This creates the Global Admin

# In User Service
cd ../user-service
npx prisma migrate dev --name init
```

---

## 3. Running the Backend Services

Open **4 separate terminal windows** and run each service:

1.  **API Gateway** (Port 3000):
    ```bash
    cd backend/api-gateway && npm run start:dev
    ```
2.  **Auth Service** (Port 3001):
    ```bash
    cd backend/auth-service && npm run start:dev
    ```
3.  **User Service** (Port 3002):
    ```bash
    cd backend/user-service && npm run start:dev
    ```
4.  **Notification Service** (Port 3003):
    ```bash
    cd backend/notification-service && npm run start:dev
    ```

---

## 4. Running the Frontend

In a **new terminal window**:

```bash
cd frontend
npm run dev
```

Visit **[http://localhost:3001](http://localhost:3001)** (or the port shown in terminal) to access the app.

---

## 5. Login Credentials

Once the system is up and the seed script has been run:

### Global Admin (Full Access)

- **Username**: `globaladmin`
- **Password**: `password123`

### Standard User (Read Only)

- **Username**: `standarduser`
- **Password**: `password123`

---

## Troubleshooting

- **Port Conflicts**: Ensure ports 3000-3004 are not being used by other applications.
- **Inter-service Communication**: Ensure the `Notification Service` is running, as `Auth Service` depends on it for registration events.
- **Typo Note**:Frontend directory is named `frontend`, make sure to `cd` into the correct one.
