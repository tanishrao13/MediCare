// For Initialzing the express server - Connecting to server.ts further for running HTTP!
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRouts.js")
const appointmentRoutes = require("./routes/appointmentRoutes.js")
const doctorRoutes = require("./routes/doctorRoutes.js")
const slotRoutes = require("./routes/slotRoutes.js")
const profileRoutes = require("./routes/profileRoutes.js")
const notificationRoutes = require("./routes/notificationRoutes.js")

const app = express();

const allowedOrigins = ['https://medi-care-pied-two.vercel.app', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

// Basic GET route
app.get('/', (req, res) => {
  res.json({ message: 'MediLink Backend API is running!', status: 'OK' });
});

// API Routes
app.use("/api/auth/", authRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/slots", slotRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/notifications", notificationRoutes)

module.exports = app;