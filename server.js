const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieparser = require('cookie-parser');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const classRoutes = require('./routes/classRoutes');

dotenv.config();

const app = express();
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// Enable CORS with credentials support
app.use(
  cors({
    origin: 'http://localhost:4200', // Replace with frontend URL
    credentials: true, // Allows cookies to be sent
  })
);

// Serve static files (Uploads & Public folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Swagger Configuration (Safe Loading)
let swaggerDocument;
try {
  swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));
} catch (err) {
  console.error('⚠️ Error loading Swagger JSON:', err.message);
  swaggerDocument = {}; // Avoid crashing if file is missing
}
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1); // Exit process if MongoDB fails
  }
};
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}/`);
});
