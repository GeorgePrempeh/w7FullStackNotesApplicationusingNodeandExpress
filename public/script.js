const notesList = document.getElementById('notes-list');
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
let editingId = null;

function fetchNotes() {
  fetch('/api/notes')
    .then(res => res.json())
    .then(notes => {
      notesList.innerHTML = '';
      notes.forEach(note => {
        const li = document.createElement('li');
        li.className = 'note';
        li.innerHTML = `
          <div class="note-title">${note.title}</div>
          <div class="note-content">${note.content}</div>
          <div class="note-actions">
            <button class="edit" onclick="editNote('${note.id}')">Edit</button>
            <button onclick="deleteNote('${note.id}')">Delete</button>
          </div>
        `;
        notesList.appendChild(li);
      });
    });
}

noteForm.onsubmit = function(e) {
  e.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) return;
  if (editingId) {
    fetch(`/api/notes/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    }).then(() => {
      editingId = null;
      noteForm.reset();
      fetchNotes();
    });
  } else {
    fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    }).then(() => {
      noteForm.reset();
      fetchNotes();
    });
  }
};

window.editNote = function(id) {
  fetch(`/api/notes`)
    .then(res => res.json())
    .then(notes => {
      const note = notes.find(n => n.id === id);
      if (note) {
        titleInput.value = note.title;
        contentInput.value = note.content;
        editingId = id;
      }
    });
};

window.deleteNote = function(id) {
  fetch(`/api/notes/${id}`, { method: 'DELETE' })
    .then(() => fetchNotes());
};

fetchNotes();
