const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read notes
function readNotes() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to write notes
function writeNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

// Get all notes
app.get('/api/notes', (req, res) => {
  res.json(readNotes());
});

// Create a new note
app.post('/api/notes', (req, res) => {
  const notes = readNotes();
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required.' });
  const newNote = { id: Date.now().toString(), title, content };
  notes.push(newNote);
  writeNotes(notes);
  res.status(201).json(newNote);
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
  const notes = readNotes();
  const { id } = req.params;
  const { title, content } = req.body;
  const note = notes.find(n => n.id === id);
  if (!note) return res.status(404).json({ error: 'Note not found.' });
  note.title = title || note.title;
  note.content = content || note.content;
  writeNotes(notes);
  res.json(note);
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  let notes = readNotes();
  const { id } = req.params;
  const initialLength = notes.length;
  notes = notes.filter(n => n.id !== id);
  if (notes.length === initialLength) return res.status(404).json({ error: 'Note not found.' });
  writeNotes(notes);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
