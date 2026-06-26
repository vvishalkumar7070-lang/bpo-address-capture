import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use(express.static(join(__dirname, 'public')));

console.log('📁 Serving static files from:', join(__dirname, 'public'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.get('/', (req, res) => {
  console.log('📍 Serving index.html');
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.get('/agent', (req, res) => {
  console.log('📍 Serving agent.html');
  res.sendFile(join(__dirname, 'public', 'agent.html'));
});

app.get('/admin', (req, res) => {
  console.log('📍 Serving admin.html');
  res.sendFile(join(__dirname, 'public', 'admin.html'));
});

// API endpoints for testing
app.get('/api/status', (req, res) => {
  res.json({
    status: 'active',
    agents: 12,
    calls: 247,
    addresses: 245,
    timestamp: new Date()
  });
});

app.post('/api/agent/call/start', (req, res) => {
  res.json({ success: true, callId: 'CALL-' + Date.now() });
});

app.post('/api/agent/address/capture', (req, res) => {
  res.json({ success: true, addressId: 'ADDR-' + Date.now() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 BPO Address Capture System LIVE on http://localhost:${PORT}`);
  console.log(`📞 Agent Portal: http://localhost:${PORT}/agent`);
  console.log(`👨‍💼 Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`✅ Health Check: http://localhost:${PORT}/health`);
});
