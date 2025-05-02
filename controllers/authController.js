const User = require('../models/User');

// Get all users (email only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Register a new user
exports.register = async (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: 'Login failed' });
  }
};
