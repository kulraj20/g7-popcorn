import { useState } from "react";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import AddMovieForm from "./AddMovieForm";
import { MovieCard } from "./MovieCard";
import { useWatchlist } from "../hooks/useWatchlist";

const STATUS_OPTIONS = ["Want to Watch", "Watching", "Watched"];

export function WatchlistSection({ user }) {
  const { movies, isLoading, error, saveMovie, removeMovie, moveMovie } =
    useWatchlist(user);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const handleOpenAddForm = () => {
    setEditingMovie(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMovie(null);
  };

  const handleSave = (movieData) => saveMovie(movieData, editingMovie?.id);

  return (
    <>
      <button
        type="button"
        className="primary btn todo-action-button"
        onClick={handleOpenAddForm}
      >
        + Add Movie
      </button>

      {error && <Alert severity="error">{error}</Alert>}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : movies.length === 0 ? (
        <Typography variant="body2" sx={{ opacity: 0.75 }}>
          Your watchlist is empty. Add your first movie above.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              status={movie.status}
              description={movie.description}
              rating={movie.rating}
              readOnlyRating
              onEdit={() => handleOpenEditForm(movie)}
              onDelete={() => removeMovie(movie.id)}
              moveOptions={STATUS_OPTIONS.filter(
                (status) => status !== movie.status,
              ).map((status) => ({
                value: status,
                label: status,
              }))}
              selectedMove=""
              onMoveChange={(newStatus) => moveMovie(movie.id, newStatus)}
              sx={{ width: "100%" }}
            />
          ))}
        </Stack>
      )}

      {showForm && (
        <AddMovieForm
          todo={editingMovie}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}
    </>
  );
}
