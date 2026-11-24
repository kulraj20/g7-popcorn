import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import AddMovieForm from "./AddMovieForm";
import { NormalButton } from "./Buttons";
import { MovieCard } from "./MovieCard";
import { ShareWatchlistPanel } from "./ShareWatchlistPanel";
import { COLORS, FONTS } from "./theme";
import { useWatchlist } from "../hooks/useWatchlist";

const STATUS_OPTIONS = ["Want to Watch", "Watching", "Watched"];

const BASE_GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Serial"];

const selectSx = {
  backgroundColor: COLORS.cream,
  color: COLORS.darkGray,
  fontFamily: FONTS.family,
  fontSize: "17px",
  borderRadius: 1.5,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: COLORS.taupe,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: COLORS.gold,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: COLORS.gold,
  },
};

export function WatchlistSection({ user, onPreviewShared }) {
  const { movies, isLoading, error, saveMovie, removeMovie, moveMovie } =
    useWatchlist(user);

  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [genreFilter, setGenreFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [runtimeFilter, setRuntimeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

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

  const handleResetFilters = () => {
    setGenreFilter("All");
    setRatingFilter("All");
    setRuntimeFilter("All");
    setSortBy("newest");
  };

  const hasActiveFilters =
    genreFilter !== "All" ||
    ratingFilter !== "All" ||
    runtimeFilter !== "All" ||
    sortBy !== "newest";

  const availableGenres = useMemo(() => {
    const customGenres = movies.map((m) => m.genre).filter(Boolean);
    return Array.from(new Set([...BASE_GENRES, ...customGenres]));
  }, [movies]);

  const processedMovies = useMemo(() => {
    const filtered = movies.filter((movie) => {
      if (genreFilter !== "All" && movie.genre !== genreFilter) {
        return false;
      }

      if (ratingFilter !== "All") {
        const minRating = Number(ratingFilter);
        if ((movie.rating || 0) < minRating) {
          return false;
        }
      }

      if (runtimeFilter !== "All") {
        const mins = parseInt(movie.runtime, 10);
        if (Number.isNaN(mins)) return false;
        if (runtimeFilter === "short" && mins >= 90) return false;
        if (runtimeFilter === "medium" && (mins < 90 || mins > 120))
          return false;
        if (runtimeFilter === "long" && mins <= 120) return false;
      }

      return true;
    });

    const sorted = [...filtered];

    switch (sortBy) {
      case "title-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-desc":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "runtime-asc":
        sorted.sort((a, b) => {
          const minsA = parseInt(a.runtime, 10);
          const minsB = parseInt(b.runtime, 10);
          return (
            (Number.isNaN(minsA) ? Infinity : minsA) -
            (Number.isNaN(minsB) ? Infinity : minsB)
          );
        });
        break;
      default:
        break;
    }

    return sorted;
  }, [movies, genreFilter, ratingFilter, runtimeFilter, sortBy]);

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

      <Paper
        elevation={0}
        sx={{
          backgroundColor: COLORS.darkGray,
          border: `1px solid ${COLORS.taupe}44`,
          borderRadius: 2,
          p: { xs: 2, md: 2.5 },
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: 36,
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: COLORS.cream, fontWeight: FONTS.weights.bold }}
            >
              Filters and sorting
            </Typography>
            {hasActiveFilters && (
              <NormalButton
                onClick={handleResetFilters}
                sx={{ py: 0.25, px: 2 }}
              >
                Reset
              </NormalButton>
            )}
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: 2,
            }}
          >
            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                sx={{ color: COLORS.taupe, fontSize: "14px" }}
              >
                GENRE
              </Typography>
              <Select
                size="small"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                sx={selectSx}
              >
                <MenuItem value="All">All genres</MenuItem>
                {availableGenres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                sx={{ color: COLORS.taupe, fontSize: "14px" }}
              >
                RATING
              </Typography>
              <Select
                size="small"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                sx={selectSx}
              >
                <MenuItem value="All">All ratings</MenuItem>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <MenuItem key={rating} value={String(rating)}>
                    {rating}+ stars
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                sx={{ color: COLORS.taupe, fontSize: "14px" }}
              >
                RUNTIME
              </Typography>
              <Select
                size="small"
                value={runtimeFilter}
                onChange={(e) => setRuntimeFilter(e.target.value)}
                sx={selectSx}
              >
                <MenuItem value="All">All runtimes</MenuItem>
                <MenuItem value="short">Under 90 min</MenuItem>
                <MenuItem value="medium">90 – 120 min</MenuItem>
                <MenuItem value="long">Over 120 min</MenuItem>
              </Select>
            </Stack>

            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                sx={{ color: COLORS.taupe, fontSize: "14px" }}
              >
                SORT BY
              </Typography>
              <Select
                size="small"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={selectSx}
              >
                <MenuItem value="newest">Newest added</MenuItem>
                <MenuItem value="title-asc">Title (A–Z)</MenuItem>
                <MenuItem value="title-desc">Title (Z–A)</MenuItem>
                <MenuItem value="rating-desc">Highest rated</MenuItem>
                <MenuItem value="runtime-asc">Shortest runtime</MenuItem>
              </Select>
            </Stack>
          </Box>
        </Stack>
      </Paper>

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
              const columnMovies = processedMovies.filter(
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
