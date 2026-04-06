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


The project structure is:
.
├── client/       # React frontend (Vite)
├── server/       # Node.js/Express backend
└── README.md
