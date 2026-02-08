# event-management-and-ticketing-system
A backend event management and ticketing system built with Node.js and MongoDB, allowing organizers to create events, manage tickets, and handle registrations efficiently.


Quick guide to get this backend running locally.
---

## 1. Clone the Repo
```bash
git clone <repo_url>
cd event-ticketing-backend

## 2. Install Dependencies
npm install

## 3. Environment Variables

Create a .env file in the root:

PORT=8000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

Each developer should use their own MongoDB database user.

## 4. Start the Server

Development (hot reload):
npm run dev



Server will run on http://localhost:8000.

## 5. Folder Structure Overview
src/
├── src/server.js      # DB connection + start server
├── src/pp.js         # Express app config
├── src/db/            # MongoDB connection
├── controllers/   # Route handlers
├── models/        # DB schemas
├── routes/        # API routes
├── middleware/    # Auth, validation, error handling
└── utils/         # Helpers (tokens, logging, etc)

## 6. Team Rules

No DB logic in controllers — use models/services

One listen() location — server.js only

Commit package-lock.json, ignore node_modules/ & .env

One feature = one owner (prevent conflicts)
