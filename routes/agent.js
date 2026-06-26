import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Call from '../models/Call.js';
import Address from '../models/Address.js';

const router = express.Router();

// Start new call
router.post('/call/start', async (req, res) => {
  try {
    const { agentId, customerName, customerPhone, customerId } = req.body;
    
    const call = new Call({
      callId: uuidv4(),
      agentId,
      customerName,
      customerPhone,
      customerId,
      status: 'active'
    });
    
    await call.save();
    res.json({ success: true, call });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// End call
router.post('/call/end', async (req, res) => {
  try {
    const { callId } = req.body;
    const call = await Call.findOneAndUpdate(
      { callId },
      { 
        status: 'completed',
        endTime: new Date(),
        duration: Math.round((new Date() - new Date(call.startTime)) / 1000)
      },
      { new: true }
    );
    res.json({ success: true, call });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Capture address
router.post('/address/capture', async (req, res) => {
  try {
    const { callId, agentId, fullAddress, captureMethod, voiceTranscript, confidence } = req.body;
    
    const address = new Address({
      addressId: uuidv4(),
      callId,
      agentId,
      fullAddress,
      captureMethod,
      voiceTranscript,
      confidence
    });
    
    await address.save();
    
    // Update call with address
    await Call.findOneAndUpdate(
      { callId },
      { $push: { addresses: address._id } }
    );
    
    res.json({ success: true, address });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get agent stats
router.get('/stats/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    const totalCalls = await Call.countDocuments({ agentId });
    const totalAddresses = await Address.countDocuments({ agentId });
    const approvedAddresses = await Address.countDocuments({ 
      agentId, 
      qaStatus: 'approved' 
    });
    
    const calls = await Call.find({ agentId }).select('duration');
    const avgDuration = calls.length > 0 
      ? calls.reduce((sum, c) => sum + (c.duration || 0), 0) / calls.length 
      : 0;
    
    const qualityScore = totalAddresses > 0 
      ? Math.round((approvedAddresses / totalAddresses) * 100)
      : 0;
    
    res.json({
      totalCalls,
      totalAddresses,
      approvedAddresses,
      qualityScore,
      avgDuration: Math.round(avgDuration)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recent calls
router.get('/calls/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const calls = await Call.find({ agentId })
      .populate('addresses')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(calls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
