import express from 'express';
import User from '../models/User.js';
import Call from '../models/Call.js';
import Address from '../models/Address.js';

const router = express.Router();

// Get dashboard metrics
router.get('/metrics', async (req, res) => {
  try {
    const totalCalls = await Call.countDocuments();
    const totalAddresses = await Address.countDocuments();
    const pendingQA = await Address.countDocuments({ qaStatus: 'pending' });
    const approvedAddresses = await Address.countDocuments({ qaStatus: 'approved' });
    const totalAgents = await User.countDocuments({ role: 'agent', isActive: true });
    
    const avgQuality = totalAddresses > 0 
      ? Math.round((approvedAddresses / totalAddresses) * 100)
      : 0;
    
    const activeCalls = await Call.countDocuments({ status: 'active' });
    
    res.json({
      totalCalls,
      totalAddresses,
      pendingQA,
      approvedAddresses,
      totalAgents,
      avgQuality,
      activeCalls
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all agents with stats
router.get('/agents', async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    const agentsWithStats = await Promise.all(agents.map(async (agent) => {
      const calls = await Call.countDocuments({ agentId: agent._id });
      const addresses = await Address.countDocuments({ agentId: agent._id });
      const approved = await Address.countDocuments({ 
        agentId: agent._id, 
        qaStatus: 'approved' 
      });
      const quality = addresses > 0 ? Math.round((approved / addresses) * 100) : 0;
      
      return {
        ...agent.toObject(),
        totalCalls: calls,
        totalAddresses: addresses,
        qualityScore: quality
      };
    }));
    
    res.json(agentsWithStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get pending addresses for QA
router.get('/addresses/pending', async (req, res) => {
  try {
    const addresses = await Address.find({ qaStatus: 'pending' })
      .populate('agentId', 'fullName email')
      .populate('callId', 'customerName')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve/Reject address
router.post('/address/qa', async (req, res) => {
  try {
    const { addressId, status, remarks, qaAgentId } = req.body;
    
    const address = await Address.findByIdAndUpdate(
      addressId,
      { qaStatus: status, qaRemarks: remarks, qaAgent: qaAgentId },
      { new: true }
    );
    
    res.json({ success: true, address });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const dailyStats = await Call.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          calls: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const topAgents = await User.aggregate([
      { $match: { role: 'agent', isActive: true } },
      { $sort: { totalCalls: -1 } },
      { $limit: 5 }
    ]);
    
    const addressTrend = await Address.countDocuments({ createdAt: { $gte: last7Days } });
    
    res.json({
      dailyStats,
      topAgents,
      last7DaysAddresses: addressTrend
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
