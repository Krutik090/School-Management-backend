const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieparser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieparser());

app.use(cors({
  origin: 'http://localhost:4200', // Add multiple allowed origins
  credentials: true // Required for cookies (JWT in HttpOnly cookies)
}));

app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
.catch((err)=> console.error('MongoDB Connection Error', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

