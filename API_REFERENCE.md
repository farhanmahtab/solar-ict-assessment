# API Reference: User Management System

This document describes the public API endpoints exposed by the API Gateway (Port 3000) and the internal microservice message patterns.

## Base URL
`http://localhost:3000`

---

## Authentication API

### Register User
Create a new user account.
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
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
- **Auth Required**: No
- **Body**:
  ```json
  {
    "username": "johndoe",
    "password": "password123"
  }
  ```

### Refresh Token
Get a new access token using a refresh token.
- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Auth Required**: No
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
- **Auth Required**: Yes (JWT)

### Verify Email
Verify account via token sent to email.
- **URL**: `/auth/verify-email`
- **Method**: `GET`
- **Auth Required**: No
- **Query Params**: `token=string`

### Request Password Reset
Request a reset OTP via email.
- **URL**: `/auth/request-password-reset`
- **Method**: `POST`
- **Auth Required**: No
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
- **Auth Required**: No
- **Body**:
  ```json
  {
    "token": "string",
    "newPassword": "password123"
  }
  ```

---

## User Management API
*All endpoints in this section require a valid JWT Access Token.*

### List All Users
- **URL**: `/users`
- **Method**: `GET`
- **Auth Required**: Yes (JWT)

### Get User Details
- **URL**: `/users/:id`
- **Method**: `GET`
- **Auth Required**: Yes (JWT)

### Update User
Update email, username, or permissions.
- **URL**: `/users/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (JWT)
- **Body**:
  ```json
  {
    "email": "new@example.com",
    "username": "newusername",
    "permissions": ["READ", "WRITE"]
  }
  ```

### Delete User
- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (JWT)

### Change User Role
Change a user's role (Global Admin, Admin, Member).
- **URL**: `/users/:id/role`
- **Method**: `POST`
- **Auth Required**: Yes (JWT)
- **Body**:
  ```json
  {
    "role": "ADMIN"
  }
  ```

---

## Internal Microservice Patterns (TCP)

Services communicate internally via NestJS TCP transport on the following ports:
- **API Gateway**: 3000 (HTTP)
- **Auth Service**: 3006 (TCP)
- **User Service**: 3002 (TCP)
- **Notification Service**: 3003 (TCP)

### Key Event Patterns
- `user_registered`: Triggered when a user registers.
- `password_reset_requested`: Triggered when a reset is requested.
