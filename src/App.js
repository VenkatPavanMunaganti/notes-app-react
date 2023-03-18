import React, { useState, useEffect } from 'react';

function App() {
  const [notes, setNotes] = useState([]);

  // Fetch all notes and add them to the list
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notes');
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error occurred while fetching notes:', error);
      }
    };
    fetchNotes();
  }, []);

  // Handle form submission to add a new note
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const note = {
      content: formData.get('content'),
      important: formData.get('important') === 'on',
    };
    try {
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: JSON.stringify(note),
      });
      const data = await response.json();
      setNotes([...notes, data]);
      event.target.reset();
    } catch (error) {
      console.error('Error occurred while adding note:', error);
    }
  };

  // Handle delete note button click
  const handleDelete = async (id, event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error occurred while deleting note:', error);
    }
  };

  return (
    <div id="main-container">
      <h1>Notes</h1>
      <div id="content-container">
        <ul id="notes">
          {notes.map((note) => (
            <li key={note.id} className={note.important ? 'important' : ''}>
              {note.content}
              <a href={`http://localhost:5000/api/notes/${note.id}`} onClick={(event) => handleDelete(note.id, event)}>
                Delete
              </a>
            </li>
          ))}
        </ul>
        <div id="addform">
          <h2>Add a Note</h2>
          <form id="note-form" onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="content">Content:</label>
                  </td>
                  <td>
                    <input type="text" id="content" name="content" required />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="important">Important:</label>
                  </td>
                  <td>
                    <input type="checkbox" id="important" name="important" />
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <button type="submit">Add Note</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
