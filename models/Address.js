import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  addressId: { type: String, unique: true, required: true },
  callId: { type: mongoose.Schema.Types.ObjectId, ref: 'Call', required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullAddress: { type: String, required: true },
  
  // Structured address fields
  building: String,
  street: String,
  area: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: 'India' },
  
  // Capture method
  captureMethod: { type: String, enum: ['voice', 'text', 'recording', 'manual'], default: 'text' },
  voiceTranscript: String,
  confidence: { type: Number, min: 0, max: 100 },
  
  // QA Status
  qaStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  qaRemarks: String,
  qaAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Location data
  latitude: Number,
  longitude: Number,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Address', addressSchema);
