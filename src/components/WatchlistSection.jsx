import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AddMovieForm from "./AddMovieForm";
import { DeleteButton, NormalButton } from "./Buttons";
import { MovieCard } from "./MovieCard";
import { ShareWatchlistPanel } from "./ShareWatchlistPanel";
import { COLORS, FONTS } from "./theme";
import { useWatchlist } from "../hooks/useWatchlist";

const STATUS_OPTIONS = ["Want to Watch", "Watching", "Watched"];

const BASE_GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Serial"];

const QUICK_FILTERS = [
  { value: "All", label: "All ratings" },
  { value: "4", label: "4+ stars" },
  { value: "3", label: "3+ stars" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "title", label: "Title" },
  { value: "rating", label: "Top rated" },
];

const quickChipSx = (selected) => ({
  height: 34,
  borderRadius: "999px",
  borderColor: selected ? COLORS.gold : `${COLORS.taupe}88`,
  backgroundColor: selected ? COLORS.gold : "transparent",
  color: selected ? COLORS.black : COLORS.cream,
  fontFamily: FONTS.family,
  fontWeight: FONTS.weights.bold,
  "&:hover": {
    borderColor: COLORS.gold,
    backgroundColor: selected ? COLORS.gold : `${COLORS.gold}18`,
  },
  "& .MuiChip-label": { px: 1.5 },
});

export function WatchlistSection({
  user,
  onPreviewShared,
  activeStatus,
  onViewChange,
}) {
  const { movies, isLoading, error, saveMovie, removeMovie, moveMovie } =
    useWatchlist(user);

  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [genreFilter, setGenreFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [sortDirection, setSortDirection] = useState("desc");

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

  const handleConfirmDelete = async () => {
    if (!movieToDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);
    await removeMovie(movieToDelete.id);
    setIsDeleting(false);
    setMovieToDelete(null);
  };

  const handleScrollToBoard = () => {
    onViewChange?.("Want to Watch");
    boardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setGenreFilter("All");
    setRatingFilter("All");
    setSortBy("newest");
    setSortDirection("desc");
  };

  const handleSortChange = (nextSortBy) => {
    if (sortBy === nextSortBy) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(nextSortBy);
    setSortDirection(nextSortBy === "title" ? "asc" : "desc");
  };

  const hasActiveFilters =
    genreFilter !== "All" ||
    ratingFilter !== "All" ||
    sortBy !== "newest" ||
    sortDirection !== "desc";

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

      return true;
    });

    const sorted = [...filtered];

    switch (sortBy) {
      case "title": {
        const direction = sortDirection === "asc" ? 1 : -1;
        sorted.sort(
          (a, b) => direction * a.title.localeCompare(b.title),
        );
        break;
      }
      case "rating": {
        const direction = sortDirection === "desc" ? -1 : 1;
        sorted.sort(
          (a, b) => direction * ((a.rating || 0) - (b.rating || 0)),
        );
        break;
      }
      case "newest":
        if (sortDirection === "asc") {
          sorted.reverse();
        }
        break;
      default:
        break;
    }

    return sorted;
  }, [movies, genreFilter, ratingFilter, sortBy, sortDirection]);

  const nextMovies = movies
    .filter((movie) => movie.status === "Want to Watch")
    .slice(0, 2);
  const visibleStatuses = activeStatus ? [activeStatus] : STATUS_OPTIONS;

  return (
    <Stack spacing={3.5} sx={{ width: "100%", textAlign: "left" }}>
      <ShareWatchlistPanel
        user={user}
        nextMovies={nextMovies}
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
          </Stack>

          <Stack spacing={2}>
            <Stack spacing={0.75}>
              <Typography
                variant="caption"
                sx={{ color: COLORS.taupe, fontSize: "14px" }}
              >
                GENRE
              </Typography>
              <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
                {["All", ...availableGenres].map((genre) => {
                  const selected = genreFilter === genre;
                  return (
                    <Chip
                      key={genre}
                      label={genre === "All" ? "All genres" : genre}
                      clickable
                      aria-pressed={selected}
                      onClick={() => setGenreFilter(genre)}
                      variant={selected ? "filled" : "outlined"}
                      sx={quickChipSx(selected)}
                    />
                  );
                })}
              </Stack>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 3 }}
              alignItems={{ xs: "flex-start", sm: "flex-end" }}
            >
              <Stack spacing={0.75}>
                <Typography
                  variant="caption"
                  sx={{ color: COLORS.taupe, fontSize: "14px" }}
                >
                  RATING
                </Typography>
                <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
                  {QUICK_FILTERS.map(({ value, label }) => {
                    const selected = ratingFilter === value;
                    return (
                      <Chip
                        key={value}
                        label={label}
                        clickable
                        aria-pressed={selected}
                        onClick={() => setRatingFilter(value)}
                        variant={selected ? "filled" : "outlined"}
                        sx={quickChipSx(selected)}
                      />
                    );
                  })}
                </Stack>
              </Stack>

              <Stack spacing={0.75}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ minHeight: 20 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.taupe, fontSize: "14px" }}
                  >
                    SORT BY
                  </Typography>
                </Stack>
                <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
                  {SORT_OPTIONS.map(({ value, label }) => {
                    const selected = sortBy === value;
                    const directionLabel =
                      sortDirection === "asc" ? "ascending" : "descending";
                    const chipLabel = selected
                      ? `${label} ${sortDirection === "asc" ? "↑" : "↓"}`
                      : label;
                    return (
                      <Chip
                        key={value}
                        label={chipLabel}
                        clickable
                        aria-pressed={selected}
                        aria-label={
                          selected
                            ? `${label}, sorted ${directionLabel}. Click to reverse order.`
                            : `Sort by ${label}`
                        }
                        onClick={() => handleSortChange(value)}
                        variant={selected ? "filled" : "outlined"}
                        sx={quickChipSx(selected)}
                      />
                    );
                  })}
                  {hasActiveFilters && (
                    <Chip
                      label="Reset All"
                      clickable
                      onClick={handleResetFilters}
                      aria-label="Reset filters and sorting"
                      variant="outlined"
                      sx={{
                        height: 34,
                        ml: 2,
                        borderStyle: "dashed",
                        borderColor: `${COLORS.gold}99`,
                        backgroundColor: `${COLORS.gold}12`,
                        color: COLORS.gold,
                        fontFamily: FONTS.family,
                        fontSize: "13px",
                        fontWeight: FONTS.weights.bold,
                        "&:hover": {
                          borderColor: COLORS.gold,
                          backgroundColor: `${COLORS.gold}24`,
                          color: COLORS.cream,
                        },
                        "& .MuiChip-label": {
                          px: 1.75,
                          fontWeight: FONTS.weights.bold,
                        },
                      }}
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
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
                md: "1fr",
              },
              gap: 3,
              alignItems: "start",
            }}
          >
            {visibleStatuses.map((statusName) => {
              const columnMovies = processedMovies.filter(
                (m) => m.status === statusName,
              );

              return (
                <Paper
                  key={statusName}
                  elevation={0}
                  sx={{
                    backgroundColor: "transparent",
                    p: 0,
                  }}
                >
                  <Stack spacing={1.5}>
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
                      <Stack
                        spacing={2}
                        sx={{ alignItems: "stretch" }}
                      >
                        {columnMovies.map((movie) => (
                          <MovieCard
                            key={movie.id}
                            title={movie.title}
                            genre={movie.genre}
                            status={movie.status}
                            description={movie.description}
                            rating={movie.rating}
                            readOnlyRating
                            onEdit={() => handleOpenEditForm(movie)}
                            onDelete={() => setMovieToDelete(movie)}
                            moveOptions={STATUS_OPTIONS.filter(
                              (status) => status !== movie.status,
                            ).map((status) => ({
                              value: status,
                              label: status,
                            }))}
                            onMoveChange={(newStatus) =>
                              moveMovie(movie.id, newStatus)
                            }
                            sx={{
                              width: "100%",
                            }}
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

      <Dialog
        open={Boolean(movieToDelete)}
        onClose={() => {
          if (!isDeleting) {
            setMovieToDelete(null);
          }
        }}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-movie-dialog-title"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: COLORS.darkGray,
              border: `1px solid ${COLORS.taupe}66`,
              borderRadius: 2,
              color: COLORS.cream,
            },
          },
        }}
      >
        <DialogTitle id="delete-movie-dialog-title">Delete movie?</DialogTitle>
        <DialogContent>
          <Typography variant="caption" sx={{ color: COLORS.taupe }}>
            Are you sure you want to delete{" "}
            <strong>{movieToDelete?.title}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <NormalButton
            onClick={() => setMovieToDelete(null)}
            disabled={isDeleting}
            sx={{
              px: 2,
              py: 0.5,
              "& .MuiTypography-root": { fontSize: "14px" },
            }}
          >
            Cancel
          </NormalButton>
          <DeleteButton
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            sx={{
              px: 2,
              py: 0.5,
              "& .MuiTypography-root": { fontSize: "14px" },
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </DeleteButton>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
