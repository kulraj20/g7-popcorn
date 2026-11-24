import { getBack4App, createOwnerWritePublicReadACL } from "../lib/back4app";

function mapMovieObject(movie) {
  return {
    id: movie.id,
    title: movie.get("title") || "",
    description: movie.get("description") || "",
    genre: movie.get("genre") || "",
    runtime: movie.get("runtime_min") || "",
    status: movie.get("status") || "",
    recommendedBy: movie.get("recommended_by") || "",
    rating: movie.get("rating") ?? 0,
  };
}

export async function getOrCreateWatchlist(user) {
  const ParseInstance = getBack4App();
  const currentUser = user || ParseInstance.User.current();

  if (!currentUser) {
    throw new Error("You must be signed in to access a watchlist.");
  }

  const Watchlist = ParseInstance.Object.extend("Watchlist");
  const query = new ParseInstance.Query(Watchlist);
  query.equalTo("user", currentUser);

  const existingWatchlist = await query.first();
  if (existingWatchlist) {
    return existingWatchlist;
  }

  const ownerName =
    currentUser.get("name") || currentUser.get("username") || "User";

  const newWatchlist = new Watchlist();
  newWatchlist.set("user", currentUser);
  newWatchlist.set("name", `${ownerName}'s Watchlist`);
  newWatchlist.setACL(
    createOwnerWritePublicReadACL(ParseInstance, currentUser),
  );

  return await newWatchlist.save();
}

export async function getUserMovies(user) {
  const ParseInstance = getBack4App();
  const currentUser = user || ParseInstance.User.current();

  if (!currentUser) return [];

  const Watchlist = ParseInstance.Object.extend("Watchlist");
  const watchlistQuery = new ParseInstance.Query(Watchlist);
  watchlistQuery.equalTo("user", currentUser);

  const watchlist = await watchlistQuery.first();
  if (!watchlist) return [];

  const Movie = ParseInstance.Object.extend("Movie");
  const movieQuery = new ParseInstance.Query(Movie);
  movieQuery.equalTo("Watchlist_id", watchlist);
  movieQuery.descending("createdAt");
  movieQuery.limit(100);

  const results = await movieQuery.find();
  return results.map(mapMovieObject);
}

export async function saveMovieToWatchlist(user, movieData, movieId = null) {
  const ParseInstance = getBack4App();
  const currentUser = user || ParseInstance.User.current();

  if (!currentUser) {
    throw new Error("You must be signed in to save a movie.");
  }

  const Movie = ParseInstance.Object.extend("Movie");
  let movie;

  if (movieId) {
    const query = new ParseInstance.Query(Movie);
    movie = await query.get(movieId);
  } else {
    const watchlist = await getOrCreateWatchlist(currentUser);
    movie = new Movie();
    movie.set("Watchlist_id", watchlist);
    movie.setACL(createOwnerWritePublicReadACL(ParseInstance, currentUser));
  }

  movie.set("title", movieData.title);
  movie.set("description", movieData.description || "");
  movie.set("genre", movieData.genre || "");
  movie.set("runtime_min", movieData.runtime || "");
  movie.set("status", movieData.status);
  movie.set("recommended_by", movieData.recommendedBy || "");
  movie.set("rating", movieData.rating ? Number(movieData.rating) : 0);

  const savedMovie = await movie.save();
  return mapMovieObject(savedMovie);
}

export async function updateMovieStatus(movieId, newStatus) {
  const ParseInstance = getBack4App();
  const Movie = ParseInstance.Object.extend("Movie");
  const query = new ParseInstance.Query(Movie);

  const movie = await query.get(movieId);
  movie.set("status", newStatus);

  const updatedMovie = await movie.save();
  return mapMovieObject(updatedMovie);
}

export async function deleteMovie(movieId) {
  const ParseInstance = getBack4App();
  const Movie = ParseInstance.Object.extend("Movie");
  const query = new ParseInstance.Query(Movie);

  const movie = await query.get(movieId);
  await movie.destroy();
}
