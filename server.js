const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require("./routes/courseRoutes"); // Fixed variable name
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
