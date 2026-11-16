import React, { useState, useEffect } from "react";
import { Paper, Stack, Typography, Snackbar, Alert, Box } from "@mui/material";
import { COLORS, FONTS } from "./theme";
import { NormalButton, PrimaryButton } from "./Buttons";
import { CustomLink } from "./CustomLink";
import { getOrCreateSharedLink } from "../lib/sharing";

export function ShareWatchlistPanel({
  user,
  onAddMovieClick,
  onPreviewShared,
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
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
        }}
      >
        <Stack spacing={1.5} sx={{ flex: 1 }}>
          <Typography
            variant="h2"
            sx={{ color: COLORS.cream, fontWeight: FONTS.weights.bold }}
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

        <Stack spacing={1.5} sx={{ minWidth: { xs: "100%", md: 220 } }}>
          <NormalButton onClick={handleCopyShareLink} disabled={loading}>
            {loading ? "Generating link..." : "Share Watchlist"}
          </NormalButton>
          {onAddMovieClick && (
            <PrimaryButton onClick={onAddMovieClick}>+ Add Movie</PrimaryButton>
          )}
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={copiedOpen}
        autoHideDuration={3000}
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
