import { useState } from "react";
import AddMovieForm from "./components/AddMovieForm.jsx";
import "./App.css";
import { saveMovie } from "./services/parseClient.js";

function App() {
  const [showForm, setShowForm] = useState(false);

  const handleSaveMovie = (movie) => saveMovie(movie);

  return (
    <>
      <button
        type="button"
        className="primary btn todo-action-button"
        onClick={() => setShowForm(true)}
      >
        + Add Movie
      </button>

      {showForm && (
        <AddMovieForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveMovie}
        />
      )}
    </>
  );
}

export default App;
