import { useEffect, useState } from "react";
import {
  deleteMovie,
  getUserMovies,
  saveMovieToWatchlist,
  updateMovieStatus,
} from "../services/watchlistService";

export function useWatchlist(user) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadMovies() {
      try {
        const userMovies = await getUserMovies(user);
        if (!isCancelled) {
          setMovies(userMovies);
          setError("");
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err?.message || "Couldn’t load your watchlist.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const saveMovie = async (movieData, movieId = null) => {
    const savedMovie = await saveMovieToWatchlist(user, movieData, movieId);

    setMovies((prev) =>
      movieId
        ? prev.map((item) => (item.id === savedMovie.id ? savedMovie : item))
        : [savedMovie, ...prev],
    );
  };

  const removeMovie = async (movieId) => {
    setError("");

    try {
      await deleteMovie(movieId);
      setMovies((prev) => prev.filter((item) => item.id !== movieId));
    } catch (err) {
      setError(err?.message || "Couldn’t delete the movie.");
    }
  };

  const moveMovie = async (movieId, newStatus) => {
    if (!newStatus) return;
    setError("");

    try {
      const updatedMovie = await updateMovieStatus(movieId, newStatus);
      setMovies((prev) =>
        prev.map((item) => (item.id === movieId ? updatedMovie : item)),
      );
    } catch (err) {
      setError(err?.message || "Couldn’t update movie status.");
    }
  };

  return {
    movies,
    isLoading,
    error,
    saveMovie,
    removeMovie,
    moveMovie,
  };
}
