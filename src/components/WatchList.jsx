import { useEffect, useState } from "react";
import { Alert, CircularProgress, Stack, Typography } from "@mui/material";
import { MovieCard } from "./MovieCard";
import { COLORS } from "./theme";
import { getWatchlistMovies } from "../lib/watchlist";

export function WatchList({ user }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const userMovies = await getWatchlistMovies(user);
        if (isActive) setMovies(userMovies);
      } catch {
        if (isActive) setError("Couldn't load your watchlist. Try again.");
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadMovies();
    return () => {
      isActive = false;
    };
  }, [user]);

  return (
    <Stack spacing={2} sx={{ mt: 3 }}>
      <Typography variant="h2" sx={{ color: COLORS.cream }}>
        My Watchlist
      </Typography>
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : loading ? (
        <CircularProgress sx={{ alignSelf: "center" }} />
      ) : movies.length ? (
        movies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.get("title") || "Untitled movie"}
            status={movie.get("status")}
            description={movie.get("description")}
            readOnlyRating
            readOnly
            sx={{ width: "100%" }}
          />
        ))
      ) : (
        <Typography variant="caption" sx={{ color: COLORS.taupe }}>
          Your watchlist is empty.
        </Typography>
      )}
    </Stack>
  );
}
