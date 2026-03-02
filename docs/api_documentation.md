# Event Management & Ticketing System API Documentation

This documentation outlines the endpoints, request formats, and response structures for the Event Management and Ticketing System API.

## General Information

### Base URL
`http://localhost:8000`

### Default Headers
All requests should include the following headers:
- `Content-Type: application/json`
- `Accept: application/json`

### Authentication
Endpoints marked as **Required** in the Auth column expect a Bearer Token in the `Authorization` header:
- `Authorization: Bearer <JWT_TOKEN>`

---

## Global Error Responses

Unless otherwise specified, error responses follow this structure:

| Status Code | Description | Example Message |
| :--- | :--- | :--- |
| `400` | Bad Request | "All fields are required" / "Invalid ID" |
| `401` | Unauthorized | "Not authorized" / "Invalid token" |
| `403` | Forbidden | "You are not allowed to edit this event" |
| `404` | Not Found | "Event not found" |
| `500` | Internal Server Error | "Something went wrong on our end" |

**Error Schema:**
```json
{
  "message": "Error description here"
}
```

---

## 1. Authentication (`/api/auth`)

### Register User
Create a new user account.
- **Endpoint:** `POST /api/auth/register`
- **Auth:** None
- **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | String | Yes | Full name of the user |
  | `email` | String | Yes | Unique email address |
  | `password` | String | Yes | Minimum 6 characters |
  | `role` | String | No | Defaults to `user`. Options: `user`, `organizer`, `admin` |

- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful! Please check your email to verify your account.",
    "data": { "id": "...", "name": "...", "email": "...", "role": "..." }
  }
  ```

### Login
Authenticate a user and receive a JWT token.
- **Endpoint:** `POST /api/auth/login`
- **Auth:** None
- **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | String | Yes | Registered email |
  | `password` | String | Yes | User password |

- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": { "token": "...", "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }
  }
  ```

### Verify Email
Verify a user's email via a token sent during registration.
- **Endpoint:** `GET /api/auth/verify/:token`
- **Auth:** None
- **Path Parameters:**
  - `token`: The verification token received in email.

- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Email verified successfully! You can now log in.",
    "data": { "user": { ... } }
  }
  ```

### Forgot Password
Initiate password reset process.
- **Endpoint:** `POST /api/auth/forgot-password`
- **Auth:** None
- **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | String | Yes | Registered email address |

- **Response (200 OK):**
  ```json
  {
    "message": "If your email exists in our system, you will receive a password reset link."
  }
  ```

### Reset Password
Reset password using a token.
- **Endpoint:** `POST /api/auth/reset-password/:token`
- **Auth:** None
- **Path Parameters:**
  - `token`: Reset token received via email.
- **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `password` | String | Yes | New password |

- **Response (200 OK):**
  ```json
  {
    "message": "Password updated successfully! You can now log in with your new password."
  }
  ```

### User Profile
Get authenticated user data.
- **Endpoint:** `GET /api/auth/me`
- **Auth:** Required
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }
  }
  ```

---

## 2. Admin Dashboard (`/api/admin-dashboard`)
*All endpoints require the `admin` role.*

### List All Tickets
Get a paginated list of all tickets sold.
- **Endpoint:** `GET /api/admin-dashboard/tickets`
- **Auth:** Required (Admin)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { "pages": 5, "tickets": [...] }
  }
  ```

### Get Ticket Detail
Retrieve specific ticket information.
- **Endpoint:** `GET /api/admin-dashboard/tickets/:ticketId`
- **Auth:** Required (Admin)
- **Path Parameters:**
  - `ticketId`: Unique ID of the ticket.

### Event Revenue
Get revenue for a specific event.
- **Endpoint:** `GET /api/admin-dashboard/event-revenue/:eventId`
- **Auth:** Required (Admin)
- **Path Parameters:**
  - `eventId`: Unique ID of the event.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { "Event Title": 5000 }
  }
  ```

### Total Revenue
Get revenue summary for all events.
- **Endpoint:** `GET /api/admin-dashboard/event-revenue`
- **Auth:** Required (Admin)

---

## 3. Events (`/api/event`)

### Create Event
- **Endpoint:** `POST /api/event/create-event`
- **Auth:** Required (Organizer)
- **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `title` | String | Yes | Event title |
  | `desc` | String | Yes | Detailed description |
  | `date` | String | Yes | ISO format (e.g., "2024-12-31") |
  | `venue` | String | Yes | Location name |
  | `ticketPrice` | Number | Yes | Price per ticket |
  | `ticketQuantityLimit` | Number | Yes | Max tickets available |

### List Events
Get all events (limited to 10).
- **Endpoint:** `GET /api/event/all-events`
- **Auth:** Required

### Update Event
Partial or full update of an event.
- **Endpoint:** `PUT /api/event/:id`
- **Auth:** Required (Admin or Owner)
- **Request Body:** All fields in 'Create Event' are optional here.

### Update Event Status
Publish or cancel an event.
- **Endpoint:** `PUT /api/event/:id/:action`
- **Auth:** Required (Admin or Owner)
- **Path Parameters:**
  - `id`: Event ID
  - `action`: `publish` or `cancel`

### Delete Event
- **Endpoint:** `DELETE /api/event/:id`
- **Auth:** Required (Admin or Owner)

---

## 4. Payments (`/payment`)

### Initialize Payment
Generate a Paystack checkout URL.
- **Endpoint:** `POST /payment/initialize`
- **Auth:** Required
- **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `eventId` | String | Yes | ID of event to buy for |
  | `tickets` | Number | Yes | Quantity of tickets |
  | `amount` | Number | Yes | Total currency amount |

- **Response (200 OK):**
  ```json
  {
    "message": "Payment initialized",
    "paymentUrl": "https://checkout.paystack.com/...",
    "reference": "ORDER_17..."
  }
  ```

### Verify Payment
Verify transaction status.
- **Endpoint:** `GET /payment/verify`
- **Auth:** None
- **Query Parameters:**
  - `reference`: Payment reference string.

### Webhook
Paystack server-to-server callback.
- **Endpoint:** `POST /payment/webhook`
- **Auth:** None (Internal use by Paystack)

---

## 5. Tickets (`/api/tickets`)

### Purchase Ticket
Direct purchase (bypass payment gateway if allowed by business logic).
- **Endpoint:** `POST /api/tickets/buy/:eventId`
- **Auth:** Required

### Verify Ticket Check-in
Used by staff at the venue to validate a ticket.
- **Endpoint:** `GET /api/tickets/verify`
- **Auth:** Required (Admin)
- **Request Format:** 
  > [!IMPORTANT]
  > This endpoint uses a **GET** method with a **JSON body**. While non-standard, this is the current implementation requirements.
- **Request Body:**
  | Field | Type | Required |
  | :--- | :--- | :--- |
  | `ticketId` | String | Yes |
  | `ticketEvent` | String | Yes |
  | `ticketPrice` | Number | Yes |
  | `ticketOwner` | String | Yes |
  | `ticketCode` | String | Yes |
