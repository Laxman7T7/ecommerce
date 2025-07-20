# E-commerce Admin Panel
# E-commerce Admin Panel – Product Module

This is a basic e-commerce admin panel built with Angular (frontend) and Node.js (backend). It includes product management features like adding, editing, and deleting products.

## 🔧 Features

- Product listing with SKU, Name, Price, and multiple images
- Add, Edit, Delete operations
- Angular (v9 or 10) frontend
- Node.js backend with TypeScript
- PostgreSQL database with TypeORM
- REST API for product operations


---

## 🚀 Getting Started

### 📦 Backend Setup
IN Backend folder create a env file 
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ecommerce_db

PORT=3000

1. Go to `backend/` folder

```bash
cd backend

npm install
cp .env.example .env
npm start

Go to frontend/ folder

cd frontend
npm install
ng serve

