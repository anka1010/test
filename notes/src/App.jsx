import { useState, useEffect } from "react";
import Note from "./components/Note";
import NoteService from "./services/notes";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    NoteService.getAll().then((initialNotes) => setNotes(initialNotes));
  }, []);

  function toggleImportanceOf(id) {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    NoteService.update(id, changedNote)
      .then((returnedNote) =>
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      )
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => setErrorMessage(null), 5000);
        // alert(`the note ${note.content} was already deleted from the server`);
        setNotes(notes.filter((note) => note.id !== id));
      });
  }

  function addNote(event) {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };

    NoteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  }

  function handleNoteChange(event) {
    setNewNote(event.target.value);
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
}

export default App;
