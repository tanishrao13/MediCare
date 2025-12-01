# MediLink – Online Appointment Booking System

🏥 **A comprehensive web-based platform that connects patients and doctors, enabling seamless appointment scheduling, management, and notifications.**

## 🌐 Live Demo

- **Frontend (Live App)**: [https://medi-care-pied-two.vercel.app/](https://medi-care-pied-two.vercel.app/)
- **Backend API**: [https://medicare-s009.onrender.com](https://medicare-s009.onrender.com)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [API Overview](#-api-overview)
- [Quick Start Guide](#-quick-start-guide)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Usage Examples](#-usage-examples)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement

Scheduling doctor appointments manually often leads to significant inefficiencies:

- **Missed Bookings**: Phone-based scheduling leads to communication gaps
- **Overlapping Schedules**: Double bookings and scheduling conflicts
- **Long Waiting Times**: Inefficient queue management
- **Poor Patient Experience**: Lack of real-time updates and notifications
- **Administrative Overhead**: Manual record keeping and appointment management

### 💡 Solution

**MediLink** addresses these challenges by providing:

- **Digital Appointment Booking**: Patients can book appointments 24/7 online
- **Real-time Availability**: Live doctor schedule updates
- **Automated Notifications**: Email/SMS alerts for confirmations and reminders
- **Streamlined Operations**: Centralized dashboard for doctors and administrators
- **Enhanced Patient Experience**: Easy rescheduling, cancellation, and appointment tracking

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- User registration and login system
- JWT-based authentication
- Role-based access control (Patient/Doctor/Admin)
- Secure password handling
- Session management

### 📊 CRUD Operations
- **Create**: New appointments, doctor profiles, availability slots
- **Read**: View appointments, doctor information, patient history
- **Update**: Modify appointments, update profiles, change availability
- **Delete**: Cancel appointments, remove outdated information

### 🧭 Frontend Routing
- **Home Page**: Landing page with platform overview
- **Authentication**: Login and registration pages
- **Dashboard**: Personalized user dashboard
- **Appointments**: Booking and management interface
- **Doctor Profiles**: Detailed doctor information and specializations
- **Admin Panel**: Administrative controls and analytics

### 🔍 Advanced Search & Filter
- **Search Doctors**: By name, specialization, location, or rating
- **Filter Appointments**: By date, status, doctor, or specialty
- **Sort Results**: By relevance, rating, availability, or distance
- **Pagination**: Efficient handling of large datasets

### 📅 Calendar Integration
- Interactive calendar view for doctors
- Appointment slot management
- Availability scheduling
- Conflict detection and resolution

### 🔔 Smart Notifications
- **Email Alerts**: Booking confirmations, reminders, cancellations
- **SMS Notifications**: Critical updates and appointment reminders
- **In-app Notifications**: Real-time updates within the platform
- **Automated Reminders**: 24-hour and 1-hour appointment reminders

---

## 🏗️ System Architecture

### Architecture Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │───▶│   Backend   │───▶│  Database   │
│  (Next.js)  │    │ (Node.js +  │    │ (PostgreSQL)│
│             │    │  Express)   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Hosting   │    │     API     │    │   Cloud     │
│   (Vercel)  │    │  Endpoints  │    │  Database   │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Technology Stack Overview

**Frontend Layer**
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS for responsive design
- **State Management**: React Hooks and Context API
- **HTTP Client**: Fetch API for backend communication
- **Routing**: Next.js App Router for seamless navigation

**Backend Layer**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Input validation and sanitization
- **Security**: CORS, rate limiting, and data encryption

**Database Layer**
- **Primary**: MongoDB (NoSQL) / PostgreSQL (SQL)
- **ODM/ORM**: Mongoose (MongoDB) / Prisma (PostgreSQL)
- **Hosting**: MongoDB Atlas / ElephantSQL

**Deployment & Hosting**
- **Frontend**: Vercel (Automatic deployments)
- **Backend**: Render (Container-based hosting)
- **Database**: Cloud-hosted solutions
- **CDN**: Integrated content delivery

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js, React.js, TailwindCSS, React Router |
| **Backend** | Node.js, Express.js, JWT Authentication |
| **Database** | MongoDB / PostgreSQL |
| **Authentication** | JWT, bcrypt for password hashing |
| **API Communication** | RESTful APIs, Fetch API |
| **Hosting** | Vercel (Frontend), Render (Backend) |
| **Version Control** | Git, GitHub |
| **Development Tools** | VS Code, Postman, MongoDB Compass |

---

## 🔌 API Overview

### Authentication Endpoints
| Endpoint | Method | Description | Access Level |
|----------|--------|-------------|-------------|
| `/api/auth/signup` | POST | Register new user (patient/doctor) | Public |
| `/api/auth/login` | POST | Authenticate user and generate JWT | Public |
| `/api/auth/logout` | POST | Invalidate user session | Authenticated |
| `/api/auth/verify` | GET | Verify JWT token validity | Authenticated |

### Doctor Management
| Endpoint | Method | Description | Access Level |
|----------|--------|-------------|-------------|
| `/api/doctors` | GET | Get all doctors with filters | Authenticated |
| `/api/doctors/:id` | GET | Get doctor profile and availability | Authenticated |
| `/api/doctors/:id/slots` | GET | Get available appointment slots | Authenticated |
| `/api/admin/doctors` | POST | Add/verify doctor profiles | Admin Only |

### Appointment Management
| Endpoint | Method | Description | Access Level |
|----------|--------|-------------|-------------|
| `/api/appointments` | POST | Book new appointment | Patient |
| `/api/appointments` | GET | Get user's appointments | Authenticated |
| `/api/appointments/:id` | PUT | Update/reschedule appointment | Authenticated |
| `/api/appointments/:id` | DELETE | Cancel appointment | Authenticated |
| `/api/appointments/:id/status` | PATCH | Update appointment status | Doctor/Admin |

### Notification System
| Endpoint | Method | Description | Access Level |
|----------|--------|-------------|-------------|
| `/api/notifications/send` | POST | Send email/SMS notifications | Admin/Doctor |
| `/api/notifications/history` | GET | Get notification history | Authenticated |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git for version control
- Code editor (VS Code recommended)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd medicare
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# If you have a separate backend folder
cd backend
npm install
cd ..
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://medicare-s009.onrender.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Installation & Setup

### Detailed Setup Instructions

#### Frontend Setup (Next.js)
```bash
# Navigate to project directory
cd medicare

# Install dependencies
npm install

# Install additional packages if needed
npm install axios react-router-dom tailwindcss

# Start development server
npm run dev
```

#### Backend Setup (if running locally)
```bash
# Clone backend repository or navigate to backend folder
cd backend

# Install backend dependencies
npm install express mongoose jsonwebtoken bcryptjs cors dotenv

# Set up environment variables
cp .env.example .env

# Start backend server
npm start
```

#### Database Setup
```bash
# For MongoDB
# Install MongoDB locally or use MongoDB Atlas
# Update connection string in backend .env file

# For PostgreSQL
# Install PostgreSQL or use cloud service
# Update database URL in backend configuration
```

---

## 📁 Project Structure

```
medicare/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.js
│   │   │   └── signup/
│   │   │       └── page.js
│   │   ├── dashboard/
│   │   │   └── page.js
│   │   ├── appointments/
│   │   │   └── page.js
│   │   ├── doctors/
│   │   │   └── page.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   └── layout/
│   └── lib/
│       ├── utils.js
│       └── api.js
├── public/
│   ├── images/
│   └── icons/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🔧 Environment Variables

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://medicare-s009.onrender.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics and monitoring
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string
# OR for PostgreSQL
DATABASE_URL=your_postgresql_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email Service (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMS Service (optional)
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
```

---

## 💡 Usage Examples

### Patient Workflow
1. **Registration**: Create account with email and basic information
2. **Browse Doctors**: Search by specialty, location, or availability
3. **Book Appointment**: Select time slot and confirm booking
4. **Receive Confirmation**: Get email/SMS confirmation
5. **Manage Appointments**: View, reschedule, or cancel bookings

### Doctor Workflow
1. **Profile Setup**: Complete professional profile and credentials
2. **Set Availability**: Define working hours and appointment slots
3. **Manage Schedule**: View upcoming appointments in calendar
4. **Patient Communication**: Send updates and notifications
5. **Update Status**: Mark appointments as completed or rescheduled

### Admin Workflow
1. **User Management**: Oversee patient and doctor registrations
2. **System Monitoring**: Track platform usage and performance
3. **Content Management**: Update platform information and policies
4. **Analytics**: Generate reports on bookings and user activity

---

## 🤝 Contributing

This is a personal learning project, but contributions and suggestions are welcome!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📚 Learning Resources

This project is perfect for learning:

- **Full-stack Development**: Frontend and backend integration
- **Authentication Systems**: JWT implementation and security
- **Database Design**: Schema design and data relationships
- **API Development**: RESTful API design and implementation
- **Modern React**: Next.js App Router and React Hooks
- **Deployment**: Cloud hosting and CI/CD pipelines

### Recommended Next Steps
1. Explore the codebase and understand the architecture
2. Try adding new features like appointment ratings
3. Implement additional notification channels
4. Add data analytics and reporting features
5. Enhance the UI/UX with animations and transitions

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📞 Support

If you have questions or need help getting started:

1. Check the [Issues](../../issues) section for common problems
2. Review the documentation and code comments
3. Create a new issue for bugs or feature requests

---

**Built with ❤️ for learning and improving healthcare accessibility**
