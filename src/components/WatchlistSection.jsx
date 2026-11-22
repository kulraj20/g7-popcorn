import { useRef, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AddMovieForm from "./AddMovieForm";
import { MovieCard } from "./MovieCard";
import { ShareWatchlistPanel } from "./ShareWatchlistPanel";
import { COLORS, FONTS } from "./theme";
import { useWatchlist } from "../hooks/useWatchlist";

const STATUS_OPTIONS = ["Want to Watch", "Watching", "Watched"];

export function WatchlistSection({ user, onPreviewShared }) {
  const { movies, isLoading, error, saveMovie, removeMovie, moveMovie } =
    useWatchlist(user);

  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const boardRef = useRef(null);

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

  const handleScrollToBoard = () => {
    boardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const nextMovie =
    movies.find((m) => m.status === "Want to Watch") || movies[0] || null;

  return (
    <Stack spacing={3.5} sx={{ width: "100%", textAlign: "left" }}>
      <ShareWatchlistPanel
        user={user}
        nextMovie={nextMovie}
        onAddMovieClick={handleOpenAddForm}
        onPreviewShared={onPreviewShared}
        onGoToWatchlist={handleScrollToBoard}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Box id="watchlist-board" ref={boardRef}>
        {isLoading ? (
          <Stack sx={{ alignItems: "center", py: 6 }}>
            <CircularProgress sx={{ color: COLORS.gold }} />
          </Stack>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 3,
              alignItems: "start",
            }}
          >
            {STATUS_OPTIONS.map((statusName) => {
              const columnMovies = movies.filter(
                (m) => m.status === statusName,
              );

              return (
                <Paper
                  key={statusName}
                  elevation={0}
                  sx={{
                    backgroundColor: COLORS.black,
                    border: `1px solid ${COLORS.taupe}44`,
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: COLORS.cream,
                          fontWeight: FONTS.weights.bold,
                        }}
                      >
                        {statusName}
                      </Typography>
                      <Box
                        sx={{
                          minWidth: 30,
                          height: 30,
                          px: 1,
                          borderRadius: "999px",
                          border: `1px solid ${COLORS.gold}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: COLORS.gold,
                            fontWeight: FONTS.weights.bold,
                            lineHeight: 1,
                          }}
                        >
                          {columnMovies.length}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ borderColor: `${COLORS.taupe}33` }} />

                    {columnMovies.length === 0 ? (
                      <Typography
                        variant="caption"
                        sx={{ color: COLORS.taupe, py: 2, textAlign: "center" }}
                      >
                        No movies in {statusName.toLowerCase()}.
                      </Typography>
                    ) : (
                      <Stack spacing={2}>
                        {columnMovies.map((movie) => (
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
                            onMoveChange={(newStatus) =>
                              moveMovie(movie.id, newStatus)
                            }
                            sx={{ width: "100%" }}
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>

      {showForm && (
        <AddMovieForm
          todo={editingMovie}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}
    </Stack>
  );
}
