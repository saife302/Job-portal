import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import comapnyRoutes from './routes/company.routes.js';
import cloudinary from './config/cloudinary.js'
import connectCloudinary from './config/cloudinary.js';

const app = express();

await connectDB();
await connectCloudinary();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Job Portal API is running');
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', comapnyRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})