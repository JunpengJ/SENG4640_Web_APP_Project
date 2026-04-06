# E‑Commerce Web Application

This is a full‑stack e‑commerce platform built with the **MERN stack** (MongoDB, Express, React, Node.js) plus **Redis** for queue‑based flash sale processing.  
It supports user authentication (JWT), product browsing, shopping cart, order placement, and a high‑concurrency flash sale mechanism that prevents overselling.

## 📋 Prerequisites

Make sure you have the following installed on your development machine:

- **Node.js** (v18 or later) + **npm** (comes with Node.js)  
  [Download Node.js](https://nodejs.org/)
- **Git**  
  [Download Git](https://git-scm.com/)
- **MongoDB Atlas** account (free tier is sufficient) – or a local MongoDB instance
- **Redis** – must be running (instructions for Ubuntu below)

> The project is designed to work with **MongoDB Atlas** (cloud database) and **Redis** for the flash sale queue.  
> A local Redis server is required – you can also use a cloud Redis service, but the instructions assume a local Ubuntu‑based Redis.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/JunpengJ/SENG4640_Web_APP_Project.git
cd SENG4640_Web_APP_Project
```

The project structure is:
.
├── client/       # React frontend (Vite)
├── server/       # Node.js/Express backend
└── README.md

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Set up environment variables
#### Backend (.env file in server/)
Create a file named .env inside the server folder with the following content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_random_string
REDIS_URL=redis://localhost:6379
```
MONGODB_URI – Get this from your MongoDB Atlas cluster.
JWT_SECRET – Generate a strong random string (e.g. openssl rand -base64 32 or use an online generator).
REDIS_URL – For local Redis, keep redis://localhost:6379.

#### Frontend (.env file in client/)
Create a file named .env inside the client folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Install and run Redis (Ubuntu / WSL)
If you are on Windows and using WSL2 with Ubuntu, run these commands inside the WSL terminal.

```bash
# Update package list
sudo apt update

# Install Redis
sudo apt install redis-server -y

# Start Redis service
sudo service redis-server start

# Verify Redis is running
redis-cli ping
```
You should see PONG.
To stop Redis later: sudo service redis-server stop.
To check status: sudo service redis-server status.

If you are on a native Linux machine, the same commands work.
For macOS, use brew install redis and brew services start redis.

### 6. Seed the database (optional but recommended)
You can insert initial products and a flash sale record using MongoDB Compass or the Atlas web interface.
Example product data can be found in the project documentation (or you can create your own).

## ▶️ Running the Application
You need to run three processes simultaneously: backend API, worker, and frontend. Open three terminal windows/tabs.

### Terminal 1 – Backend API
```bash
cd server
node src/app.js
```
You should see:

```text
Server running on port 5000
MongoDB atlas connected
```

### Terminal 2 – Worker (for flash sale queue processing)
```bash
cd server
node src/worker.js
```
No output is normal – the worker will wait for jobs.

### Terminal 3 – Frontend (React)
```bash
cd client
npm run dev
```
The frontend will be available at http://localhost:5173.

## 🧪 Testing the Application
1. __Register__ a new user account.

2. __Login__ with that account.

3. Browse products, add them to the cart, and proceed to checkout.

4. To test flash sale:
    - Make sure Redis and the worker are running.
    - Insert a flash sale record in MongoDB (flashsales collection) with a valid productId, startTime in the past, endTime in the future, and initialStock > 0.
    - Visit the /flash-sale page and click the “Flash Sale Buy” button.

## 📦 Production Build (optional)
- Frontend: cd client && npm run build – creates a dist folder for static hosting.
- Backend: can be deployed to services like Render, Railway, or Google Cloud Run (make sure to set the same environment variables).

## 🛠 Troubleshooting
### “Cannot find module X”
Run npm install in the respective folder (server or client).

### Redis connection refused
- Ensure Redis is running: sudo service redis-server status (Ubuntu) or redis-cli ping.
- Check REDIS_URL in .env – use redis://localhost:6379 for local Redis.

### MongoDB connection error
- Verify your MONGODB_URI is correct.
- If you have DNS issues on Windows, add the following code at the very top of server/src/app.js and server/src/worker.js:

```javascript
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');
```

### Flash sale button does nothing
- Make sure the worker process is running.
- Check that Redis is running and REDIS_URL is correct.

## 📄 License
This project is for educational purposes as part of SENG 4640 – Software Engineering for Web Apps.