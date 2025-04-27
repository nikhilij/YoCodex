const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectDB = require('./config/database');

connectDB();
app.use(express.json());



module.exports = app;
