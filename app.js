/**
 * Node Core Module
 */
const path = require('path');

/**
 * NPM import
 */
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidV4 = require('uuid/v4');
const helmet = require('helmet');

/**
 * Local import
 */
// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');

/**
 * Code
 */
// Environment variables (.env / .env.dist)
dotenv.config();

// Initialize express
const app = express();

// Multer file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const fileName = `${uuidV4()}-${file.originalname}`;
    callback(null, fileName);
  },
});

// Multer file filter
const fileFilter = (req, file, callback) => {
  if (
    // Types
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    // Accept
    callback(null, true);
  } else {
    // Reject
    callback(null, false);
  }
};

/**
 * Middlewares
 */
// Parser (Parsing the incoming JSON data)
// ! This middleware should always be placed first
app.use(bodyParser.json());

// Initialize Multer file upload
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

// Access to the images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Setting response CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Initialize helmet (set HTTP response header for security purpose)
app.use(helmet());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/project', projectRoutes);

// Error Handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message, data } = error;
  res.status(status).json({ message, data });
});

/**
 * Database connexion with Mongoose
 */
// Database env variables
const {
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_DEFAULT_DATABASE,
} = process.env;

// Database URI
const DB_URI = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster-trip-planner-t7elm.mongodb.net/${MONGO_DB_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

mongoose
  .connect(DB_URI, { useNewUrlParser: true })
  .then(response => {
    console.log('Connected');
    // Starting the server
    app.listen(process.env.PORT || 8000);
  })
  .catch(err => console.log(err));
