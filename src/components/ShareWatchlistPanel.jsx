import React, { useState, useEffect } from "react";
import { Paper, Stack, Typography, Snackbar, Alert, Box } from "@mui/material";
import { COLORS, FONTS } from "./theme";
import { NormalButton, PrimaryButton } from "./Buttons";
import { CustomLink } from "./CustomLink";
import { getOrCreateSharedLink } from "../lib/sharing";

export function ShareWatchlistPanel({
  user,
  nextMovie = null,
  onAddMovieClick,
  onPreviewShared,
  onGoToWatchlist,
}) {
  const [shareData, setShareData] = useState({ token: "", shareUrl: "" });
  const [loading, setLoading] = useState(false);
  const [copiedOpen, setCopiedOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    if (user) {
      getOrCreateSharedLink(user)
        .then((data) => {
          if (mounted) setShareData(data);
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [user]);

  async function handleCopyShareLink() {
    setError("");
    setLoading(true);
    try {
      const data = shareData.shareUrl
        ? shareData
        : await getOrCreateSharedLink(user);
      setShareData(data);
      await navigator.clipboard.writeText(data.shareUrl);
      setCopiedOpen(true);
    } catch {
      setError("Could not generate or copy the share link.");
    } finally {
      setLoading(false);
    }
  }

  async function handleViewSharedPage(e) {
    e.preventDefault();
    setError("");
    try {
      const data = shareData.token
        ? shareData
        : await getOrCreateSharedLink(user);
      setShareData(data);
      onPreviewShared(data.token);
    } catch {
      setError("Could not open your shared page preview.");
    }
  }

  function handleGoToWatchlistClick(e) {
    e.preventDefault();
    if (onGoToWatchlist) {
      onGoToWatchlist();
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: COLORS.darkGray,
        border: `1px solid ${COLORS.taupe}44`,
        borderRadius: 2,
        p: { xs: 2.5, md: 3.5 },
        width: "100%",
        textAlign: "left",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr auto 1fr" },
          gap: 3,
          alignItems: "center",
        }}
      >
        <Stack spacing={1}>
          <Typography
            variant="caption"
            sx={{ color: COLORS.gold, textTransform: "uppercase" }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="h1"
            sx={{
              color: COLORS.cream,
              fontWeight: FONTS.weights.bold,
              fontSize: { xs: "30px", md: "38px" },
              lineHeight: 1.15,
            }}
          >
            What are you watching next?
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.taupe }}>
            Keep the good recommendations close.
          </Typography>
          <Box sx={{ pt: 0.5 }}>
            <CustomLink href="#view-shared" onClick={handleViewSharedPage}>
              View shared page →
            </CustomLink>
          </Box>
        </Stack>

        <Stack
          spacing={1.5}
          sx={{
            minWidth: { xs: "100%", md: 210 },
            flexDirection: { xs: "column-reverse", md: "column" },
          }}
        >
          <NormalButton onClick={handleCopyShareLink} disabled={loading}>
            {loading ? "Generating..." : "Share Watchlist"}
          </NormalButton>
          <PrimaryButton onClick={onAddMovieClick}>+ Add Movie</PrimaryButton>
        </Stack>
        <Box
          sx={{
            border: `1.5px dashed ${COLORS.taupe}88`,
            borderRadius: 2,
            p: 2,
            backgroundColor: COLORS.black,
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="caption"
              sx={{
                color: COLORS.gold,
                fontWeight: FONTS.weights.bold,
              }}
            >
              Your Next Watchlist
            </Typography>
            <Typography variant="caption" sx={{ color: COLORS.cream }}>
              {nextMovie
                ? `Up next: ${nextMovie.title}${nextMovie.genre ? ` (${nextMovie.genre})` : ""}`
                : "No movies queued yet. Add a title to start planning your next movie night."}
            </Typography>
            <Box sx={{ pt: 0.5 }}>
              <CustomLink
                href="#watchlist-board"
                onClick={handleGoToWatchlistClick}
              >
                Go to Watchlist
              </CustomLink>
            </Box>
          </Stack>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={copiedOpen}
        autoHideDuration={3500}
        onClose={() => setCopiedOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setCopiedOpen(false)}
          severity="success"
          sx={{ backgroundColor: COLORS.black, color: COLORS.gold }}
        >
          Private watchlist link copied to clipboard!
        </Alert>
      </Snackbar>
    </Paper>
  );
}
