import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  callId: { type: String, unique: true, required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: String,
  customerName: String,
  customerPhone: String,
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  duration: Number,
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  notes: String,
  recordingUrl: String,
  quality: { type: Number, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Call', callSchema);
