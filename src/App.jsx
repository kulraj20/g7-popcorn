import { useEffect, useState } from "react";
import AddMovieForm from "./components/AddMovieForm.jsx";
import "./App.css";
import {
  Alert,
  Box,
  CircularProgress,
  CssBaseline,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { AuthForm } from "./components/AuthForm";
import { UserProfileCard } from "./components/UserProfileCard";
import { MovieCard } from "./components/MovieCard";
import { theme } from "./components/theme";
import {
  deleteMovie,
  getBack4App,
  getUserMovies,
  isBack4AppConfigured,
  saveMovieToWatchlist,
  updateMovieStatus,
} from "./lib/back4app";

const STATUS_OPTIONS = ["Want to Watch", "Watching", "Watched"];

export default function App() {
  const [user, setUser] = useState(() => {
    if (isBack4AppConfigured) {
      return getBack4App().User.current();
    }

    return null;
  });
  const [signOutError, setSignOutError] = useState("");
  const [movies, setMovies] = useState([]);
  const [loadedUserId, setLoadedUserId] = useState(null);
  const [moviesError, setMoviesError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const isLoadingMovies = Boolean(user) && loadedUserId !== user.id;

  useEffect(() => {
    if (!user) {
      return;
    }

    let isCancelled = false;

    async function loadMovies() {
      try {
        const userMovies = await getUserMovies(user);
        if (!isCancelled) {
          setMovies(userMovies);
          setMoviesError("");
          setLoadedUserId(user.id);
        }
      } catch (err) {
        if (!isCancelled) {
          setMoviesError(err?.message || "Couldn’t load your watchlist.");
          setLoadedUserId(user.id);
        }
      }
    }

    loadMovies();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  async function handleSignOut() {
    setSignOutError("");

    try {
      const Parse = getBack4App();
      await Parse.User.logOut();
      setUser(null);
      setMovies([]);
      setMoviesError("");
      setLoadedUserId(null);
    } catch {
      setSignOutError("Couldn’t sign out. Try again.");
    }
  }

  const handleSaveMovie = async (movieData) => {
    const savedMovie = await saveMovieToWatchlist(
      user,
      movieData,
      editingMovie?.id,
    );

    setMovies((prev) =>
      editingMovie
        ? prev.map((item) => (item.id === savedMovie.id ? savedMovie : item))
        : [savedMovie, ...prev],
    );
  };

  const handleDeleteMovie = async (movieId) => {
    setMoviesError("");

    try {
      await deleteMovie(movieId);
      setMovies((prev) => prev.filter((item) => item.id !== movieId));
    } catch (err) {
      setMoviesError(err?.message || "Couldn’t delete the movie.");
    }
  };

  const handleMoveMovie = async (movieId, newStatus) => {
    if (!newStatus) return;
    setMoviesError("");

    try {
      const updatedMovie = await updateMovieStatus(movieId, newStatus);
      setMovies((prev) =>
        prev.map((item) => (item.id === movieId ? updatedMovie : item)),
      );
    } catch (err) {
      setMoviesError(err?.message || "Couldn’t update movie status.");
    }
  };

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        component="main"
        sx={{ width: "100%", maxWidth: 480, mx: "auto", p: 3 }}
      >
        {user ? (
          <Stack spacing={2.5}>
            <UserProfileCard
              name={user.get("name")}
              email={user.get("email")}
              onSignOut={handleSignOut}
            />
            {signOutError && <Alert severity="error">{signOutError}</Alert>}

            <button
              type="button"
              className="primary btn todo-action-button"
              onClick={handleOpenAddForm}
            >
              + Add Movie
            </button>

            {moviesError && <Alert severity="error">{moviesError}</Alert>}

            {isLoadingMovies ? (
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
                    onDelete={() => handleDeleteMovie(movie.id)}
                    moveOptions={STATUS_OPTIONS.filter(
                      (status) => status !== movie.status,
                    ).map((status) => ({
                      value: status,
                      label: status,
                    }))}
                    selectedMove=""
                    onMoveChange={(newStatus) =>
                      handleMoveMovie(movie.id, newStatus)
                    }
                    sx={{ width: "100%" }}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        ) : (
          <AuthForm onAuthenticated={setUser} />
        )}
      </Box>

      {showForm && (
        <AddMovieForm
          todo={editingMovie}
          onClose={handleCloseForm}
          onSave={handleSaveMovie}
        />
      )}
    </ThemeProvider>
  );
}
