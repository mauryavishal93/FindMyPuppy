
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5174;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Connecting to 'findmypuppy' cluster, 'findmypuppy' database, 'user' collection
const MONGO_URI = "mongodb+srv://vimaurya24_db_user:jrPF6GqaTX9H40s1@findmypuppy.q6hlrak.mongodb.net/findmypuppy?appName=findmypuppy";
const COLLECTION_NAME = "user"; // As requested

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schema Definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hints: { type: Number, default: 0 }, // Total hints bought with money or points
  points: { type: Number, default: 0 }, // Points earned/used (separate from score)
  premium: { type: Boolean, default: false }, // Premium subscription status
  levelPassedEasy: { type: Number, default: 0 }, // Number of levels passed in Easy difficulty
  levelPassedMedium: { type: Number, default: 0 }, // Number of levels passed in Medium difficulty
  levelPassedHard: { type: Number, default: 0 }, // Number of levels passed in Hard difficulty
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
}, { collection: COLLECTION_NAME });

const User = mongoose.model('User', userSchema);

// --- ROUTES ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found. Please sign up." });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Login successful!", 
      user: { 
        username: user.username, 
        email: user.email,
        hints: user.hints || 0,
        points: user.points || 0,
        premium: user.premium || false,
        levelPassedEasy: user.levelPassedEasy || 0,
        levelPassedMedium: user.levelPassedMedium || 0,
        levelPassedHard: user.levelPassedHard || 0
      } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
});

// Signup Endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Username, email, and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Username or Email already exists." });
    }

    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      hints: 0,
      points: 0,
      premium: false,
      levelPassedEasy: 0,
      levelPassedMedium: 0,
      levelPassedHard: 0
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "Account created successfully!", user: { username, email } });
  } catch (error) {
    console.error('Signup Error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Username or Email already exists." });
    }
    res.status(500).json({ success: false, message: "Server error during signup." });
  }
});

// Update User Hints Endpoint
app.post('/api/user/update-hints', async (req, res) => {
  try {
    const { username, hints } = req.body;

    if (!username || hints === undefined) {
      return res.status(400).json({ success: false, message: "Username and hints are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.hints = hints;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Hints updated successfully!", 
      hints: user.hints 
    });
  } catch (error) {
    console.error('Update Hints Error:', error);
    res.status(500).json({ success: false, message: "Server error updating hints." });
  }
});

// Update User Points Endpoint
app.post('/api/user/update-points', async (req, res) => {
  try {
    const { username, points } = req.body;

    if (!username || points === undefined) {
      return res.status(400).json({ success: false, message: "Username and points are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.points = points;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Points updated successfully!", 
      points: user.points 
    });
  } catch (error) {
    console.error('Update Points Error:', error);
    res.status(500).json({ success: false, message: "Server error updating points." });
  }
});

// Update User Premium Status Endpoint
app.post('/api/user/update-premium', async (req, res) => {
  try {
    const { username, premium } = req.body;

    if (!username || premium === undefined) {
      return res.status(400).json({ success: false, message: "Username and premium status are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.premium = premium;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Premium status updated successfully!", 
      premium: user.premium 
    });
  } catch (error) {
    console.error('Update Premium Error:', error);
    res.status(500).json({ success: false, message: "Server error updating premium status." });
  }
});

// Update User Level Passed Endpoint
app.post('/api/user/update-level-passed', async (req, res) => {
  try {
    const { username, difficulty, levelPassed } = req.body;

    if (!username || !difficulty || levelPassed === undefined) {
      return res.status(400).json({ success: false, message: "Username, difficulty, and levelPassed are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Update the appropriate difficulty field
    if (difficulty === 'Easy') {
      user.levelPassedEasy = levelPassed;
    } else if (difficulty === 'Medium') {
      user.levelPassedMedium = levelPassed;
    } else if (difficulty === 'Hard') {
      user.levelPassedHard = levelPassed;
    } else {
      return res.status(400).json({ success: false, message: "Invalid difficulty. Must be 'Easy', 'Medium', or 'Hard'." });
    }

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Level passed count updated successfully!", 
      levelPassedEasy: user.levelPassedEasy,
      levelPassedMedium: user.levelPassedMedium,
      levelPassedHard: user.levelPassedHard
    });
  } catch (error) {
    console.error('Update Level Passed Error:', error);
    res.status(500).json({ success: false, message: "Server error updating level passed count." });
  }
});

// Get User Data Endpoint
app.get('/api/user/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ 
      success: true, 
      user: { 
        username: user.username, 
        email: user.email,
        hints: user.hints || 0,
        points: user.points || 0,
        premium: user.premium || false,
        levelPassedEasy: user.levelPassedEasy || 0,
        levelPassedMedium: user.levelPassedMedium || 0,
        levelPassedHard: user.levelPassedHard || 0
      } 
    });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ success: false, message: "Server error fetching user data." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
  
  // Start the frontend dev server
  console.log('📦 Starting frontend dev server...');
  const viteProcess = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });
  
  viteProcess.on('error', (error) => {
    console.error('❌ Failed to start frontend dev server:', error);
  });
  
  viteProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Frontend dev server exited with code ${code}`);
    }
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    viteProcess.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down servers...');
    viteProcess.kill();
    process.exit(0);
  });
});
