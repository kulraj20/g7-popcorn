import { useEffect, useState } from "react";

const initialFormState = {
  title: "",
  description: "",
  genre: "",
  runtime: "",
  recommendedBy: "",
  status: "",
  rating: "",
};

const genreOptions = [
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Horror",
  "Serial",
];

const statusOptions = ["Want to Watch", "Watching", "Watched"];
const ratingOptions = [1, 2, 3, 4, 5];

const AddMovieForm = ({ todo = null, onClose, onSave }) => {
  const [formData, setFormData] = useState(() =>
    todo
      ? {
          title: todo.title || "",
          description: todo.description || "",
          genre: todo.genre || "",
          runtime: todo.runtime || "",
          recommendedBy: todo.recommendedBy || "",
          status: todo.status || "",
          rating: todo.rating ?? "",
        }
      : initialFormState,
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const closeTimer = setTimeout(onClose, 2000);
    return () => clearTimeout(closeTimer);
  }, [successMessage, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updatedForm = {
        ...previous,
        [name]: value,
      };

      if (name === "status" && value !== "Watched") {
        updatedForm.rating = "";
      }

      return updatedForm;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title) {
      setError("Enter a movie title.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      if (typeof onSave === "function") {
        await onSave({
          ...formData,
          title,
          description,
          genre: formData.genre.trim(),
          runtime: formData.runtime.trim(),
          recommendedBy: formData.recommendedBy.trim(),
          rating: formData.rating ? Number(formData.rating) : null,
        });
        setSuccessMessage("Movie added");
      }
    } catch (err) {
      setError(err?.message || "Unable to save this movie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="todo-modal-overlay" onClick={onClose}>
      <div className="todo-modal" onClick={(event) => event.stopPropagation()}>
        <div className="todo-modal-header">
          <div>
            <p className="form-kicker">Watchlist</p>
            <h3>{todo ? "Edit movie" : "Add movie"}</h3>
          </div>
          <button
            type="button"
            className="todo-close-button"
            onClick={onClose}
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="movie-title">Movie title</label>
            <input
              id="movie-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="What do you want to watch?"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="movie-description">Description / note</label>
            <textarea
              id="movie-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Where did you hear about it? Anything to remember?"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-field compact-field">
              <label htmlFor="movie-genre">Genre</label>
              <select
                id="movie-genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              >
                <option value="">Select a genre</option>
                {formData.genre && !genreOptions.includes(formData.genre) && (
                  <option value={formData.genre}>{formData.genre}</option>
                )}
                {genreOptions.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field compact-field">
              <label htmlFor="movie-runtime">Runtime</label>
              <input
                id="movie-runtime"
                name="runtime"
                type="text"
                value={formData.runtime}
                onChange={handleChange}
                placeholder="e.g. 120 min"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field compact-field">
              <label htmlFor="movie-status">Status</label>
              <select
                id="movie-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field compact-field">
              <label htmlFor="movie-rating">Your rating</label>
              <select
                id="movie-rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                disabled={formData.status !== "Watched"}
              >
                <option value="">Not rated</option>
                {ratingOptions.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} {rating === 1 ? "star" : "stars"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="movie-recommended-by">Recommended by</label>
            <input
              id="movie-recommended-by"
              name="recommendedBy"
              type="text"
              value={formData.recommendedBy}
              onChange={handleChange}
              placeholder="e.g. Maria or a friend"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="profile-editor-actions">
            {successMessage && (
              <p className="success-message" role="status">
                {successMessage}
              </p>
            )}
            <button type="button" className="secondary btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="primary btn"
              disabled={isSubmitting || Boolean(successMessage)}
            >
              {successMessage ||
                (isSubmitting
                  ? "Saving..."
                  : todo
                    ? "Save Movie"
                    : "Add Movie")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieForm;
