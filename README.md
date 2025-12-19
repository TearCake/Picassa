# Picassa

A full-stack Pinterest-inspired application for creating, sharing, and organizing visual content with an integrated image editor.
Live Demo : https://picassa-frontend.vercel.app

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-443E38?style=for-the-badge)
![Axios](https://img.shields.io/badge/Axios-1-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![ImageKit](https://img.shields.io/badge/ImageKit-0078FF?style=for-the-badge)

## Features

- 📌 Create and manage pins
- 📋 Organize content into boards
- 🎨 Built-in image editor with layers
- 👥 Follow users and social interactions
- 💬 Comments and likes
- 🔍 Search functionality
- 🔐 JWT authentication

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB
- ImageKit account

### Installation

**1. Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

**2. Frontend Setup**
```bash
cd frontend
npm install
```

### Run Application

**Backend** (http://localhost:3000)
```bash
cd backend
npm run dev
```

**Frontend** (http://localhost:5173)
```bash
cd frontend
npm run dev
```

## Build for Production

```bash
cd frontend
npm run build
```

---

Built with ❤️ using React and Node.js
