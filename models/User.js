import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: String,
  role: { type: String, enum: ['agent', 'qa', 'admin', 'supervisor'], default: 'agent' },
  
  // Agent metrics
  totalCalls: { type: Number, default: 0 },
  totalAddresses: { type: Number, default: 0 },
  qualityScore: { type: Number, default: 0, min: 0, max: 100 },
  
  // Status
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  
  // Performance
  avgAddressesPerCall: { type: Number, default: 0 },
  avgCallDuration: { type: Number, default: 0 },
  qaApprovalRate: { type: Number, default: 0, min: 0, max: 100 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
