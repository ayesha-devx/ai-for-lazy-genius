import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

const app = express();

app.use(cors({
  origin: ["https://ai-for-lazy-genius.vercel.app", "http://localhost:5173"],
  credentials: true
}));

// Root Route
app.get('/', (req, res) => {
  res.send('Lazy Genius AI API is running. Visit /api/blogs for content.');
});
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/subscribe', subscriberRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/community', communityRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Detailed Error Handler for Production Debugging
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'An unexpected server error occurred',
    // In production, we don't want to leak the stack trace unless explicitly needed for debugging
    // but we'll keep the message descriptive.
    errorType: err.name
  });
});

export default app;
