
// Import required modules
const path = require('path');
const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const session = require('express-session');
// Initialize Express app
const app = express();
// File paths for user and note data
const USERS_FILE = path.join(__dirname, 'users.json');
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
// Serve landing page as default route
app.get('/', (req, res) => {
  // Send landing.html for root URL
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// Session middleware for authentication
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
// Parse JSON bodies
app.use(express.json());
// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Read users from users.json
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write users to users.json
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Register endpoint: creates a new user with hashed password
app.post('/api/register', (req, res) => {
  const { username, password, firstName } = req.body;
  // Validate input
  if (!username || !password || !firstName) return res.json({ success: false, error: 'Username, password, and first name required.' });
  const users = readUsers();
  // Check for duplicate username
  if (users.find(u => u.username === username)) return res.json({ success: false, error: 'Username already exists.' });
  // Hash password for security
  const hashed = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashed, firstName });
  writeUsers(users);
  res.json({ success: true });
});

// Login endpoint: authenticates user and starts session
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  // Find user by username
  const user = users.find(u => u.username === username);
  // Check password
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.json({ success: false, error: 'Invalid credentials.' });
  }
  // Store user info in session
  req.session.user = { username, firstName: user.firstName || '' };
  res.json({ success: true, firstName: user.firstName || '' });
});

// Logout endpoint: destroys session
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Auth check endpoint: verifies if user is logged in
app.get('/api/auth-check', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});
// ...existing code...

// Read notes from data.json
function readNotes() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write notes to data.json
function writeNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

// Get all notes endpoint: returns all notes
app.get('/api/notes', (req, res) => {
  res.json(readNotes());
});

// Create a new note endpoint
app.post('/api/notes', (req, res) => {
  const notes = readNotes();
  const { title, content } = req.body;
  // Validate input
  if (!title || !content) return res.status(400).json({ error: 'Title and content required.' });
  // Generate metadata for note
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dateString = now.toLocaleDateString();
  const dayString = days[now.getDay()];
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // Create note object
  const newNote = {
    id: Date.now().toString(),
    title,
    content,
    date: dateString,
    day: dayString,
    time: timeString
  };
  notes.push(newNote);
  writeNotes(notes);
  res.status(201).json(newNote);
});

// Update a note endpoint
app.put('/api/notes/:id', (req, res) => {
  const notes = readNotes();
  const { id } = req.params;
  const { title, content } = req.body;
  // Find note by id
  const note = notes.find(n => n.id === id);
  if (!note) return res.status(404).json({ error: 'Note not found.' });
  // Update note fields
  note.title = title || note.title;
  note.content = content || note.content;
  // Ensure date, day, and time are preserved
  note.date = note.date || new Date().toLocaleDateString();
  note.day = note.day || ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  note.time = note.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  writeNotes(notes);
  res.json(note);
});

// Delete a note endpoint
app.delete('/api/notes/:id', (req, res) => {
  let notes = readNotes();
  const { id } = req.params;
  const initialLength = notes.length;
  // Remove note by id
  notes = notes.filter(n => n.id !== id);
  if (notes.length === initialLength) return res.status(404).json({ error: 'Note not found.' });
  writeNotes(notes);
  res.status(204).end();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
