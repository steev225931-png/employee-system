# Employee App — Assignment 3

A fresh implementation of the Employee App backend-integration assignment. It includes:
- Express + Node.js REST API
- MongoDB Atlas connection using Mongoose
- GET all employees and GET one employee
- POST, PUT, and DELETE employee endpoints
- A simple React/Vite frontend for trying the API

> This is a newly created project because the lecturer's original starter ZIP was not available. If your lecturer requires the exact supplied `dist`/`build` files and an existing `app.js` skeleton to remain unchanged, use those original files if you can obtain them.

## 1. Requirements
- Node.js (LTS)
- A MongoDB Atlas account and database connection string

## 2. Configure MongoDB
1. In MongoDB Atlas, create a database user.
2. In Network Access, allow your current IP address.
3. Click **Connect → Drivers** and copy the connection string.
4. Copy `server/.env.example` to `server/.env`.
5. Put the connection string in `MONGODB_URI`. Replace the password/database placeholders. Do not commit `.env` to GitHub.

## 3. Run the backend
Open a terminal in the `server` folder:
```bash
npm install
```
Create `server/.env` as described above, then run:
```bash
npm run dev
```
The API runs at `http://localhost:5000`.

## 4. Run the frontend
Open a second terminal in the `client` folder:
```bash
npm install
npm run dev
```
Open the local URL Vite prints (usually `http://localhost:5173`).

## API routes
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get one employee by MongoDB ID |
| POST | `/api/employees` | Add an employee |
| PUT | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |

Employee fields: `name`, `designation`, `location`, `salary`.

## Example POST body
```json
{
  "name": "Aqeel",
  "designation": "Developer",
  "location": "Kerala",
  "salary": 30000
}
```

## Important
- `.env` is ignored by Git.
- Never publish your MongoDB password or connection string.
- The frontend is a fresh implementation, not the lecturer's supplied build.
