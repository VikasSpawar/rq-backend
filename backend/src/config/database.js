const mongoose = require('mongoose');
require('dotenv').config()
const connectDB = async () => {
  try {
    const dbURI= process.env.URI
    console.log(dbURI)
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
