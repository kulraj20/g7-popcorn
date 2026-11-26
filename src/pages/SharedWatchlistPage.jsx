import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { COLORS, FONTS } from "../components/theme";
import { NormalButton, PrimaryButton } from "../components/Buttons";
import { BrandLogo } from "../components/BrandLogo";
import { StatusChip } from "../components/StatusChip";
import { UserProfileCard } from "../components/UserProfileCard";
import { fetchSharedWatchlistByToken } from "../lib/sharing";
import { getUserMovies, saveMovieToWatchlist } from "../lib/back4app";

const SECTIONS = [
  { key: "want to watch", label: "Want to Watch" },
  { key: "watching", label: "Watching" },
  { key: "watched", label: "Watched" },
];

export function SharedWatchlistPage({
  token,
  currentUser,
  onGoToMyWatchlist,
  onSignOut,
}) {
  const [data, setData] = useState({ watchlistName: "", movies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [ownedTitles, setOwnedTitles] = useState(new Set());
  const [addingId, setAddingId] = useState(null);
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    fetchSharedWatchlistByToken(token)
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        if (mounted)
          setError(err.message || "Could not load this shared watchlist.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!currentUser) {
      setOwnedTitles(new Set());
      return;
    }

    let mounted = true;
    getUserMovies(currentUser)
      .then((userMovies) => {
        if (mounted) {
          setOwnedTitles(
            new Set(
              userMovies.map((m) => (m.title || "").trim().toLowerCase()),
            ),
          );
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  async function handleAddMovieToMyWatchlist(movie) {
    if (!currentUser || addingId) return;

    setAddingId(movie.id);
    try {
      const ownerName = data.watchlistName
        ? data.watchlistName.replace(/'s Watchlist$/i, "").trim()
        : "";

      await saveMovieToWatchlist(currentUser, {
        title: movie.title,
        description: movie.description || "",
        genre: movie.genre || "",
        runtime: movie.runtime_min ? String(movie.runtime_min) : "",
        status: "Want to Watch",
        recommendedBy: ownerName || movie.recommended_by || "",
        rating: 0,
      });

      setOwnedTitles((prev) => {
        const next = new Set(prev);
        next.add((movie.title || "").trim().toLowerCase());
        return next;
      });

      setFeedback({
        open: true,
        message: `"${movie.title}" added to your watchlist!`,
        severity: "success",
      });
    } catch (err) {
      setFeedback({
        open: true,
        message: err?.message || "Could not add this movie to your watchlist.",
        severity: "error",
      });
    } finally {
      setAddingId(null);
    }
  }

  const badgeStyle = {
    backgroundColor: "transparent",
    border: `1px solid ${COLORS.taupe}`,
    color: COLORS.cream,
  };

  function renderMovieRow(movie) {
    const normalizedTitle = (movie.title || "").trim().toLowerCase();
    const alreadyAdded = ownedTitles.has(normalizedTitle);
    const isAdding = addingId === movie.id;

    return (
      <Stack
        key={movie.id}
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          px: 2.5,
          py: 2,
        }}
      >
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              color: COLORS.cream,
              fontWeight: FONTS.weights.bold,
            }}
          >
            {movie.title}
          </Typography>
          {movie.description && (
            <Typography variant="caption" sx={{ color: COLORS.taupe }}>
              {movie.description}
            </Typography>
          )}
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "center",
            flexShrink: 0,
            flexWrap: "wrap",
            rowGap: 1,
          }}
        >
          {movie.interest && <StatusChip label={movie.interest} />}

          {currentUser &&
            (alreadyAdded ? (
              <NormalButton
                disabled
                sx={{
                  py: 0.4,
                  px: 1.75,
                  backgroundColor: "transparent",
                  borderColor: COLORS.taupe,
                  "&.Mui-disabled": {
                    color: COLORS.taupe,
                    borderColor: `${COLORS.taupe}66`,
                  },
                  "& .MuiTypography-root": {
                    fontSize: "16px",
                  },
                }}
              >
                In your watchlist
              </NormalButton>
            ) : (
              <PrimaryButton
                onClick={() => handleAddMovieToMyWatchlist(movie)}
                disabled={Boolean(addingId)}
                sx={{
                  py: 0.4,
                  px: 1.75,
                  "& .MuiTypography-root": {
                    fontSize: "16px",
                  },
                }}
              >
                {isAdding ? "Adding..." : "+ Add to watchlist"}
              </PrimaryButton>
            ))}
        </Stack>
      </Stack>
    );
  }

  function renderSection(section) {
    const sectionMovies = data.movies.filter((m) => m.status === section.key);

    return (
      <Paper
        key={section.key}
        elevation={0}
        sx={{
          backgroundColor: COLORS.darkGray,
          border: `1px solid ${COLORS.taupe}44`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            px: 2.5,
            py: 1.5,
            backgroundColor: COLORS.black,
            borderBottom: `1px solid ${COLORS.taupe}33`,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: COLORS.cream,
              fontWeight: FONTS.weights.bold,
            }}
          >
            {section.label}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: COLORS.gold,
              fontWeight: FONTS.weights.bold,
            }}
          >
            {sectionMovies.length}
          </Typography>
        </Stack>

        {sectionMovies.length === 0 ? (
          <Box sx={{ px: 2.5, py: 2.5 }}>
            <Typography variant="caption" sx={{ color: COLORS.taupe }}>
              No movies in {section.label.toLowerCase()} yet.
            </Typography>
          </Box>
        ) : (
          <Stack
            divider={<Divider sx={{ borderColor: `${COLORS.taupe}22` }} />}
          >
            {sectionMovies.map(renderMovieRow)}
          </Stack>
        )}
      </Paper>
    );
  }

  const renderedSections = SECTIONS.map(renderSection);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLORS.black,
        color: COLORS.cream,
        textAlign: "left",
      }}
    >
      <Box
        component="header"
        sx={{
          borderBottom: `1px solid ${COLORS.taupe}33`,
          px: { xs: 2, md: 4 },
          py: 1.5,
          backgroundColor: COLORS.darkGray,
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 1040,
            mx: "auto",
            width: "100%",
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={onGoToMyWatchlist}
            aria-label="Go to your watchlist"
            sx={{
              border: 0,
              p: 0,
              background: "transparent",
              cursor: "pointer",
              "&:focus-visible": {
                outline: `2px solid ${COLORS.gold}`,
                outlineOffset: 4,
              },
            }}
          >
            <BrandLogo compact />
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <PrimaryButton onClick={onGoToMyWatchlist} sx={{ py: 0.5, px: 2 }}>
              My Watchlist
            </PrimaryButton>
            {currentUser && (
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <UserProfileCard
                  name={currentUser.get("name")}
                  email={currentUser.get("email")}
                  onSignOut={onSignOut}
                  sx={{ p: 0.75, width: "auto" }}
                />
              </Box>
            )}
          </Stack>
        </Stack>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: 860,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
        }}
      >
        {loading ? (
          <Stack sx={{ alignItems: "center", py: 8 }}>
            <CircularProgress sx={{ color: COLORS.gold }} />
          </Stack>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Stack spacing={4}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  sx={{ color: COLORS.gold, textTransform: "uppercase" }}
                >
                  Shared Watchlist
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    color: COLORS.cream,
                    fontSize: { xs: "32px", md: "45px" },
                  }}
                >
                  {data.watchlistName}
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.taupe }}>
                  Browse and explore the movies in this collection.
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  flexWrap: "wrap",
                  rowGap: 1,
                }}
              >
                <StatusChip
                  label={`${data.movies.length} movies`}
                  textColor={COLORS.gold}
                  sx={{
                    backgroundColor: COLORS.darkGray,
                    border: `1px solid ${COLORS.gold}`,
                  }}
                />
                <StatusChip
                  label="Read-only"
                  textColor={COLORS.cream}
                  sx={badgeStyle}
                />
                <StatusChip
                  label="No sign-in"
                  textColor={COLORS.cream}
                  sx={badgeStyle}
                />
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: `${COLORS.taupe}44` }} />

            <Stack spacing={3}>{renderedSections}</Stack>
          </Stack>
        )}
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: `1px solid ${COLORS.taupe}33`,
          px: { xs: 2, md: 4 },
          py: 2.5,
          backgroundColor: COLORS.darkGray,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            maxWidth: 1040,
            mx: "auto",
            width: "100%",
          }}
        >
          <Stack spacing={0.75}>
            <BrandLogo compact />
            <Typography variant="caption" sx={{ color: COLORS.taupe }}>
              Keep a close movie for the right night.
            </Typography>
          </Stack>

          <NormalButton onClick={onGoToMyWatchlist}>
            Start your own watchlist →
          </NormalButton>
        </Stack>
      </Box>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3500}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
          severity={feedback.severity}
          sx={{
            backgroundColor: COLORS.black,
            color: feedback.severity === "success" ? COLORS.gold : COLORS.cream,
            border: `1px solid ${
              feedback.severity === "success" ? COLORS.gold : COLORS.red
            }`,
          }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
