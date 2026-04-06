import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import companyRoutes from './routes/company.routes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/job.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

try {
  await connectDB();
  await connectCloudinary();
} catch (error) {
  console.error(error);
  process.exit(1);
}

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Job Portal API is running');
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})