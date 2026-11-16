import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import { COLORS, FONTS } from "../components/theme";
import { NormalButton, PrimaryButton } from "../components/Buttons";
import { StatusChip } from "../components/StatusChip";
import { UserProfileCard } from "../components/UserProfileCard";
import { fetchSharedWatchlistByToken } from "../lib/sharing";

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

  const badgeStyle = {
    backgroundColor: "transparent",
    border: `1px solid ${COLORS.taupe}`,
    color: COLORS.cream,
  };

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
          <Stack
            direction="row"
            spacing={1}
            onClick={onGoToMyWatchlist}
            sx={{
              alignItems: "center",
              color: COLORS.gold,
              cursor: "pointer",
            }}
          >
            <Typography variant="h2" component="span">
              Popcorn
            </Typography>
          </Stack>

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
                  sx={{
                    backgroundColor: COLORS.darkGray,
                    border: `1px solid ${COLORS.gold}`,
                  }}
                />
                <StatusChip label="Read-only" sx={badgeStyle} />
                <StatusChip label="No sign-in" sx={badgeStyle} />
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: `${COLORS.taupe}44` }} />

            <Stack spacing={3}>
              {SECTIONS.map((section) => {
                const sectionMovies = data.movies.filter(
                  (m) => m.status === section.key,
                );

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
                        <Typography
                          variant="caption"
                          sx={{ color: COLORS.taupe }}
                        >
                          No movies in {section.label.toLowerCase()} yet.
                        </Typography>
                      </Box>
                    ) : (
                      <Stack
                        divider={
                          <Divider sx={{ borderColor: `${COLORS.taupe}22` }} />
                        }
                      >
                        {sectionMovies.map((movie) => (
                          <Stack
                            key={movie.id}
                            direction="row"
                            spacing={2}
                            sx={{
                              justifyContent: "space-between",
                              alignItems: "flex-start",
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
                                <Typography
                                  variant="caption"
                                  sx={{ color: COLORS.taupe }}
                                >
                                  {movie.description}
                                </Typography>
                              )}
                            </Stack>

                            {movie.interest && (
                              <StatusChip label={movie.interest} />
                            )}
                          </Stack>
                        ))}
                      </Stack>
                    )}
                  </Paper>
                );
              })}
            </Stack>
          </Stack>
        )}
      </Box>

      {/* Footer CTA ("Start your own watchlist ->") */}
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
          <Stack>
            <Typography
              variant="body1"
              sx={{ color: COLORS.gold, fontWeight: FONTS.weights.bold }}
            >
              Popcorn
            </Typography>
            <Typography variant="caption" sx={{ color: COLORS.taupe }}>
              Keep a close movie for the right night.
            </Typography>
          </Stack>

          <NormalButton onClick={onGoToMyWatchlist}>
            Start your own watchlist →
          </NormalButton>
        </Stack>
      </Box>
    </Box>
  );
}
