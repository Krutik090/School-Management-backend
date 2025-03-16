const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieparser = require('cookie-parser');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// Enable CORS with credentials support
app.use(
  cors({
      origin: 'http://localhost:4200', // Replace with frontend URL
      credentials: true, //  Allows cookies to be sent
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Access the student Routes
app.use('/api/student', studentRoutes);

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
.catch((err)=> console.error('MongoDB Connection Error', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

