import Parse from "parse";

const applicationId = import.meta.env.VITE_BACK4APP_APPLICATION_ID;
const javascriptKey = import.meta.env.VITE_BACK4APP_JAVASCRIPT_KEY;
const serverURL =
  import.meta.env.VITE_BACK4APP_SERVER_URL || "https://parseapi.back4app.com/";

export const isBack4AppConfigured = Boolean(applicationId && javascriptKey);

console.group("[Back4App] Init Diagnostics");
console.log("isBack4AppConfigured:", isBack4AppConfigured);
console.log(
  "APP_ID:",
  applicationId
    ? `${applicationId.slice(0, 4)}... (len: ${applicationId.length})`
    : "MISSING",
);
console.log(
  "JS_KEY:",
  javascriptKey
    ? `${javascriptKey.slice(0, 4)}... (len: ${javascriptKey.length})`
    : "MISSING",
);
console.log("SERVER_URL:", serverURL);
console.groupEnd();

if (isBack4AppConfigured) {
  Parse.initialize(applicationId, javascriptKey);
  Parse.serverURL = serverURL;
}

function logParseError(context, err) {
  console.error(`[Back4App Error] ${context}:`, {
    code: err?.code ?? "NO_CODE",
    message: err?.message ?? String(err),
    raw: err,
  });
}

export function getBack4App() {
  if (!isBack4AppConfigured) {
    const err = new Error(
      "Set the Back4App Application ID and JavaScript Key in .env.local (or GitHub Secrets), then rebuild.",
    );
    logParseError("getBack4App", err);
    throw err;
  }

  return Parse;
}

function createOwnerWritePublicReadACL(ParseInstance, currentUser) {
  const acl = new ParseInstance.ACL(currentUser);
  acl.setPublicReadAccess(true);
  acl.setPublicWriteAccess(false);
  return acl;
}

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
  try {
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
      console.log("[Back4App] Found existing watchlist:", existingWatchlist.id);
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

    const saved = await newWatchlist.save();
    console.log("[Back4App] Created new watchlist:", saved.id);
    return saved;
  } catch (err) {
    logParseError("getOrCreateWatchlist", err);
    throw err;
  }
}

export async function getUserMovies(user) {
  try {
    const ParseInstance = getBack4App();
    const currentUser = user || ParseInstance.User.current();

    console.log(
      "[Back4App] getUserMovies for user:",
      currentUser?.id ?? "NOT_SIGNED_IN",
    );

    if (!currentUser) {
      return [];
    }

    const Watchlist = ParseInstance.Object.extend("Watchlist");
    const watchlistQuery = new ParseInstance.Query(Watchlist);
    watchlistQuery.equalTo("user", currentUser);

    const watchlist = await watchlistQuery.first();
    if (!watchlist) {
      console.log("[Back4App] No watchlist found for user:", currentUser.id);
      return [];
    }

    const Movie = ParseInstance.Object.extend("Movie");
    const movieQuery = new ParseInstance.Query(Movie);
    movieQuery.equalTo("Watchlist_id", watchlist);
    movieQuery.descending("createdAt");
    movieQuery.limit(100);

    const results = await movieQuery.find();
    console.log(
      `[Back4App] Loaded ${results.length} movies from watchlist ${watchlist.id}`,
    );
    return results.map(mapMovieObject);
  } catch (err) {
    logParseError("getUserMovies", err);
    throw err;
  }
}

export async function saveMovieToWatchlist(user, movieData, movieId = null) {
  try {
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
    console.log("[Back4App] Saved movie:", savedMovie.id);
    return mapMovieObject(savedMovie);
  } catch (err) {
    logParseError("saveMovieToWatchlist", err);
    throw err;
  }
}

export async function updateMovieStatus(movieId, newStatus) {
  try {
    const ParseInstance = getBack4App();
    const Movie = ParseInstance.Object.extend("Movie");
    const query = new ParseInstance.Query(Movie);

    const movie = await query.get(movieId);
    movie.set("status", newStatus);

    const updatedMovie = await movie.save();
    console.log("[Back4App] Updated movie status:", movieId, "->", newStatus);
    return mapMovieObject(updatedMovie);
  } catch (err) {
    logParseError("updateMovieStatus", err);
    throw err;
  }
}

export async function deleteMovie(movieId) {
  try {
    const ParseInstance = getBack4App();
    const Movie = ParseInstance.Object.extend("Movie");
    const query = new ParseInstance.Query(Movie);

    const movie = await query.get(movieId);
    await movie.destroy();
    console.log("[Back4App] Deleted movie:", movieId);
  } catch (err) {
    logParseError("deleteMovie", err);
    throw err;
  }
}
