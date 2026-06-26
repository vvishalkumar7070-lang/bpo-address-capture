import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'express-async-errors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import agentRoutes from './routes/agent.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(join(__dirname, 'public')));

// MongoDB Connection
const connectDB = async () => {
  try {
    // Use MongoDB Atlas or local MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bpo-address-capture';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.log('⚠️ MongoDB Connection Failed (non-critical, API still works):', err.message);
    // Don't crash server if MongoDB isn't available
  }
};

connectDB();

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/agent', agentRoutes);
app.use('/api/admin', adminRoutes);

// Portal Routes
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.get('/agent', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'agent.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'admin.html'));
});

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BPO System LIVE on port ${PORT}`);
  console.log(`📱 Agent Portal: http://localhost:${PORT}/agent`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`🏠 Home: http://localhost:${PORT}`);
});
