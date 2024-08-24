
const express = require('express');
const connectDB = require('./config/database');
const analyticsRoutes = require('./routes/analytics');
const cors=require("cors")
const app = express();

// Connect Database
connectDB();

// Initialize Middleware
app.use(cors())
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/analytics', analyticsRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

