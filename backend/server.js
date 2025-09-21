const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/videos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  }
});

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock database (in production, use MongoDB or PostgreSQL)
const users = [];
const testResults = [];
const adminUsers = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
    role: 'admin'
  }
];

// Utility functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Check admin users first
    const adminUser = adminUsers.find(u => u.username === username);
    if (adminUser && await bcrypt.compare(password, adminUser.password)) {
      const token = generateToken(adminUser);
      return res.json({
        success: true,
        token,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          role: adminUser.role
        }
      });
    }

    // Check regular users
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = generateToken(user);
      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, username, password, age, gender, height, weight } = req.body;

    // Validation
    if (!name || !email || !username || !password || !age || !gender || !height || !weight) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    if (users.find(u => u.username === username || u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      username,
      password: hashedPassword,
      age: parseInt(age),
      gender,
      height: parseInt(height),
      weight: parseInt(weight),
      role: 'athlete',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Test submission
app.post('/api/tests/submit', authenticateToken, upload.single('video'), (req, res) => {
  try {
    const { testId, testName, result, analysisData } = req.body;
    const videoFile = req.file;

    if (!testId || !testName || !result) {
      return res.status(400).json({ error: 'Test data required' });
    }

    const testResult = {
      id: testResults.length + 1,
      userId: req.user.id,
      testId,
      testName,
      result: JSON.parse(result),
      analysisData: analysisData ? JSON.parse(analysisData) : null,
      videoPath: videoFile ? videoFile.path : null,
      submittedAt: new Date().toISOString(),
      status: 'pending_review'
    };

    testResults.push(testResult);

    res.json({
      success: true,
      message: 'Test submitted successfully',
      testResultId: testResult.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's test results
app.get('/api/tests/results', authenticateToken, (req, res) => {
  try {
    const userResults = testResults.filter(tr => tr.userId === req.user.id);
    res.json({
      success: true,
      results: userResults
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leaderboard
app.get('/api/tests/leaderboard', (req, res) => {
  try {
    const { testId, limit = 50 } = req.query;
    
    let filteredResults = testResults;
    if (testId) {
      filteredResults = testResults.filter(tr => tr.testId === testId);
    }

    // Sort by score and limit results
    const sortedResults = filteredResults
      .sort((a, b) => (b.result.score || 0) - (a.result.score || 0))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      leaderboard: sortedResults
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const stats = {
      totalUsers: users.length,
      totalTests: testResults.length,
      averageScore: testResults.length > 0 
        ? testResults.reduce((sum, tr) => sum + (tr.result.score || 0), 0) / testResults.length 
        : 0,
      activeUsers: users.filter(u => {
        const lastActivity = new Date(u.lastActivity || 0);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return lastActivity > oneDayAgo;
      }).length,
      pendingReviews: testResults.filter(tr => tr.status === 'pending_review').length,
      flaggedTests: testResults.filter(tr => tr.result.cheatDetected).length,
      systemHealth: 98.5,
      lastUpdate: new Date().toISOString()
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      users: usersWithoutPasswords
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all test results (admin only)
app.get('/api/admin/results', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    res.json({
      success: true,
      results: testResults
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
