# API Reference: User Management System

This document describes the public API endpoints exposed by the API Gateway (Port 3000) and the internal microservice message patterns.

## Base URL
`http://localhost:3000`

---

## Authentication API (`/auth`)

### Register User
Create a new user account.
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Login
Authenticate and receive access/refresh tokens.
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Refresh Token
Get a new access token using a refresh token.
- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "refreshToken": "string"
  }
  ```

### Logout
Invalidate the current session.
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes (JWT Bearer Token)

### Verify Email
Verify account via token sent to email.
- **URL**: `/auth/verify-email`
- **Method**: `GET`
- **Query Params**: `token=string`

### Request Password Reset
Request a reset OTP via email.
- **URL**: `/auth/request-password-reset`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```

### Reset Password
Submit new password with reset token.
- **URL**: `/auth/reset-password`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "token": "string",
    "newPassword": "password123"
  }
  ```

---

## User Management API (`/users`)
*All endpoints in this section require a valid JWT Access Token.*

### List All Users
- **URL**: `/users`
- **Method**: `GET`
- **Roles Required**: Global Admin, Admin (Standard users only see themselves)

### Get User Details
- **URL**: `/users/:id`
- **Method**: `GET`

### Update User
Update email, username, or permissions.
- **URL**: `/users/:id`
- **Method**: `PUT`
- **Body**:
  ```json
  {
    "email": "new@example.com",
    "username": "newusername"
  }
  ```

### Admin: Create User
- **URL**: `/users`
- **Method**: `POST`
- **Roles Required**: Global Admin, Admin
- **Body**:
  ```json
  {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "temporaryPassword123",
    "role": "MEMBER"
  }
  ```

### Admin: Reset User Password
- **URL**: `/users/:id/reset-password`
- **Method**: `POST`
- **Roles Required**: Global Admin, Admin
- **Body**:
  ```json
  {
    "password": "newSecurePassword123"
  }
  ```

### Admin: Change User Role
Change a user's role.
- **URL**: `/users/:id/role`
- **Method**: `POST`
- **Roles Required**: Global Admin
- **Body**:
  ```json
  {
    "role": "ADMIN"
  }
  ```

### Delete User
- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Roles Required**: Global Admin

---

## Internal Microservice Patterns (TCP)

Services communicate internally via NestJS TCP transport on the following ports:
- **API Gateway**: 3000 (HTTP)
- **Auth Service**: 3006 (TCP)
- **User Service**: 3002 (TCP)
- **Notification Service**: 3003 (TCP)

### Key Message Patterns
- `register`, `login`, `refresh`, `logout`, `verify_email`, `request_password_reset`, `reset_password` (Auth Service)
- `find_all_users`, `find_one_user`, `update_user`, `admin_create_user`, `admin_reset_password`, `delete_user`, `change_role` (User Service)
- `user_registered`, `password_reset_requested` (Notification Service Events)
