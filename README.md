E-commerce Admin Panel – Product Module
This is a basic e-commerce admin panel built with Angular (frontend) and Node.js (backend). It includes product management features like adding, editing, and deleting products.

🔧 Features
Product listing with SKU, Name, Price, and multiple images

Add, Edit, Delete operations

Angular (v9 or v10) frontend

Node.js backend with TypeScript

PostgreSQL database with TypeORM

REST API for product operations

🚀 Getting Started
📦 Backend Setup
Go to the backend/ folder:

bash
Copy
Edit
cd backend
Create a .env file in the backend folder with the following content:

ini
Copy
Edit
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ecommerce_db

PORT=3000
Install dependencies and start the backend server:

bash
Copy
Edit
npm install
npm start
🌐 Frontend Setup
Go to the frontend/ folder:

bash
Copy
Edit
cd frontend
Install dependencies and start the frontend server:

bash
Copy
Edit
npm install
ng serve
Open your browser at http://localhost:4200 to see the app.

