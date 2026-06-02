# ZUCT Lost & Found System

A full-stack web application built for Zambia University College of Technology to help students report and recover lost items on campus.

## Technologies Used
- **React.js** - Frontend Development
- **Express.js** - Backend Development
- **PostgreSQL** - Database Management

## Features
- User Authentication (Register/Login with JWT)
- Post Lost & Found Items
- Image Upload for Items
- Search & Filter Items by Category and Status
- Status Toggle (Mark as Lost/Found)
- Campus Location Tagging
- Contact Info on Posts
- Dashboard Statistics
- Owner-only Delete and Status Controls
- Toast Notifications
- Responsive Design

## How to Run Locally

### Prerequisites
- Node.js installed
- PostgreSQL installed

### Database Setup
Create a PostgreSQL database called lostandfound and run the SQL in the backend/config folder

### Backend
cd backend
npm install
node index.js

### Frontend
cd frontend
npm install
npm start

### Environment Variables
Create a .env file in the backend folder:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lostandfound
DB_USER=postgres
DB_PASSWORD=yourpassword
PORT=5000
JWT_SECRET=lostandfoundsecretkey

## Project Structure
lost-and-found/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── App.js
└── README.md
