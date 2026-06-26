# 📊 MongoDB Setup Guide - BPO Address Capture System

## Quick Setup (Choose One)

### Option 1: MongoDB Atlas Cloud (Recommended for Production)

**Step 1: Create Account**
1. Visit https://www.mongodb.com/cloud/atlas
2. Sign up with email or Google/GitHub
3. Create free organization

**Step 2: Create Cluster**
1. Click "Build a Database"
2. Select "M0 Sandbox" (free tier)
3. Choose cloud provider (AWS) and region
4. Click "Create Deployment"

**Step 3: Get Connection String**
1. After cluster creation, click "Connect"
2. Select "Connect your application"
3. Choose "Node.js" driver
4. Copy the connection string
5. Replace `<password>` with your database password

**Example Connection String:**
```
mongodb+srv://admin:yourpassword@cluster.mongodb.net/bpo-address-capture?retryWrites=true&w=majority
```

**Step 4: Security Setup**
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0) for development
4. For production: Add only your server IP

**Step 5: Update Environment Variables**
```bash
# In .env or Render dashboard
MONGODB_URI=mongodb+srv://admin:yourpassword@cluster.mongodb.net/bpo-address-capture?retryWrites=true&w=majority
```

---

### Option 2: Local MongoDB (Development)

**Step 1: Install MongoDB**

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Linux:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org
systemctl start mongod
```

**Windows:**
- Download from https://www.mongodb.com/try/download/community
- Run installer
- MongoDB starts automatically

**Step 2: Update .env**
```bash
MONGODB_URI=mongodb://localhost:27017/bpo-address-capture
```

**Step 3: Verify Connection**
```bash
mongosh
# In MongoDB shell:
use bpo-address-capture
db.users.insertOne({test: true})
db.users.find()
```

---

## 🔌 API Integration

### Data Models Created

#### 1. User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  fullName: String,
  role: "agent" | "qa" | "admin" | "supervisor",
  totalCalls: Number,
  totalAddresses: Number,
  qualityScore: Number (0-100),
  isActive: Boolean,
  lastLogin: Date
}
```

#### 2. Call Model
```javascript
{
  callId: String (unique),
  agentId: ObjectId (ref User),
  customerName: String,
  customerPhone: String,
  customerId: String,
  startTime: Date,
  endTime: Date,
  duration: Number (seconds),
  addresses: [ObjectId] (ref Address),
  status: "active" | "completed" | "paused",
  quality: Number (0-5),
  notes: String
}
```

#### 3. Address Model
```javascript
{
  addressId: String (unique),
  callId: ObjectId (ref Call),
  agentId: ObjectId (ref User),
  fullAddress: String,
  
  // Structured fields
  building: String,
  street: String,
  area: String,
  city: String,
  state: String,
  pincode: String,
  country: String,
  
  // Capture details
  captureMethod: "voice" | "text" | "recording" | "manual",
  voiceTranscript: String,
  confidence: Number (0-100),
  
  // QA workflow
  qaStatus: "pending" | "approved" | "rejected",
  qaRemarks: String,
  qaAgent: ObjectId (ref User),
  
  // Location
  latitude: Number,
  longitude: Number
}
```

---

## 📡 API Endpoints

### Agent Routes (`/api/agent/`)

**Start Call:**
```bash
POST /api/agent/call/start
{
  "agentId": "AGENT-001",
  "customerName": "Rajesh Kumar",
  "customerPhone": "+919876543210",
  "customerId": "CUST-001"
}
```

**End Call:**
```bash
POST /api/agent/call/end
{
  "callId": "CALL-123456"
}
```

**Capture Address:**
```bash
POST /api/agent/address/capture
{
  "callId": "CALL-123456",
  "agentId": "AGENT-001",
  "fullAddress": "123 MG Road, Bangalore, KA 560001",
  "captureMethod": "voice",
  "voiceTranscript": "one two three mg road...",
  "confidence": 92
}
```

**Get Agent Stats:**
```bash
GET /api/agent/stats/:agentId
Response:
{
  "totalCalls": 142,
  "totalAddresses": 428,
  "approvedAddresses": 412,
  "qualityScore": 96,
  "avgDuration": 245
}
```

**Get Recent Calls:**
```bash
GET /api/agent/calls/:agentId
```

---

### Admin Routes (`/api/admin/`)

**Get Dashboard Metrics:**
```bash
GET /api/admin/metrics
Response:
{
  "totalCalls": 1247,
  "totalAddresses": 3841,
  "pendingQA": 156,
  "approvedAddresses": 3685,
  "totalAgents": 18,
  "avgQuality": 94,
  "activeCalls": 24
}
```

**Get All Agents:**
```bash
GET /api/admin/agents
```

**Get Pending Addresses:**
```bash
GET /api/admin/addresses/pending
```

**Process QA Decision:**
```bash
POST /api/admin/address/qa
{
  "addressId": "60d5ec49c1234567890abc12",
  "status": "approved" | "rejected",
  "remarks": "Address verified and formatted correctly",
  "qaAgentId": "QA-001"
}
```

**Get Analytics:**
```bash
GET /api/admin/analytics
Response:
{
  "dailyStats": [...],
  "topAgents": [...],
  "last7DaysAddresses": 2847
}
```

---

## 🗄️ Database Management

### Initialize Database with Sample Data

```javascript
// You can run this in MongoDB shell or via API
db.users.insertMany([
  {
    username: "agent001",
    email: "agent1@bpo.com",
    password: "hashed_password",
    fullName: "Rajesh Kumar",
    role: "agent",
    isActive: true,
    totalCalls: 0,
    totalAddresses: 0,
    qualityScore: 0
  }
])
```

### Backup & Export

**Export to JSON:**
```bash
mongoexport --uri "mongodb://localhost:27017/bpo-address-capture" --collection calls --out calls.json
```

**Backup All Collections:**
```bash
mongodump --uri "mongodb://localhost:27017/bpo-address-capture" --out ./backup
```

---

## 🔍 Monitoring & Optimization

### Connection Pool Settings
```javascript
const mongoUri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};
```

### Query Optimization

Create indexes on frequently queried fields:
```javascript
// In MongoDB shell:
db.calls.createIndex({ "agentId": 1, "createdAt": -1 })
db.addresses.createIndex({ "qaStatus": 1, "createdAt": -1 })
db.addresses.createIndex({ "agentId": 1, "callId": 1 })
```

### Monitor Connection:
```bash
mongosh "mongodb://localhost:27017"
db.adminCommand({connectionStatus: 1})
```

---

## 🚨 Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Network access configured (whitelist IPs)
- [ ] Connection string added to Render environment
- [ ] Database backups enabled
- [ ] Monitoring alerts set up
- [ ] User roles and permissions configured
- [ ] Data validation rules enforced
- [ ] Query performance optimized with indexes
- [ ] SSL/TLS encryption enabled (Atlas default)

---

## 📚 Sample Queries

### Get all calls for an agent:
```javascript
db.calls.find({ agentId: ObjectId("...") })
  .sort({ createdAt: -1 })
  .limit(10)
```

### Get pending QA addresses:
```javascript
db.addresses.find({ qaStatus: "pending" })
  .populate("agentId", "fullName email")
  .populate("callId", "customerName")
```

### Calculate agent statistics:
```javascript
db.addresses.aggregate([
  { $match: { agentId: ObjectId("...") } },
  { $group: {
    _id: "$agentId",
    totalAddresses: { $sum: 1 },
    approved: { $sum: { $cond: [{ $eq: ["$qaStatus", "approved"] }, 1, 0] } }
  }}
])
```

---

## 🆘 Troubleshooting

**Connection Refused:**
- Verify MongoDB is running: `mongosh`
- Check connection string
- Verify IP whitelist (Atlas)

**Slow Queries:**
- Create indexes on frequently used fields
- Use `explain()` to analyze queries
- Limit result sets with pagination

**Authentication Failed:**
- Verify username/password
- Check character encoding in connection string
- Ensure user has database access permissions

---

**Status:** ✅ Ready for production use
