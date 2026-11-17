import Parse from "parse";
const applicationId = import.meta.env.VITE_BACK4APP_APPLICATION_ID;
const javascriptKey = import.meta.env.VITE_BACK4APP_JAVASCRIPT_KEY;

export const isBack4AppConfigured = Boolean(applicationId && javascriptKey);

if (isBack4AppConfigured) {
  Parse.initialize(applicationId, javascriptKey);
  Parse.serverURL =
    import.meta.env.VITE_BACK4APP_SERVER_URL ||
    "https://parseapi.back4app.com/";
}

export function getBack4App() {
  if (!isBack4AppConfigured) {
    throw new Error(
      "Set the Back4App Application ID and JavaScript Key in .env.local, then restart Vite.",
    );
  }

  return Parse;
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

  const newWatchlist = new Watchlist();
  newWatchlist.set("user", currentUser);
  newWatchlist.setACL(new ParseInstance.ACL(currentUser));

  return await newWatchlist.save();
}

export async function saveMovieToWatchlist(user, movieData) {
  const ParseInstance = getBack4App();
  const currentUser = user || ParseInstance.User.current();

  if (!currentUser) {
    throw new Error("You must be signed in to add a movie.");
  }

  const watchlist = await getOrCreateWatchlist(currentUser);
  const Movie = ParseInstance.Object.extend("Movie");
  const movie = new Movie();

  movie.set("title", movieData.title);
  movie.set("description", movieData.description || "");
  movie.set("genre", movieData.genre || "");
  movie.set("runtime_min", movieData.runtime || "");
  movie.set("status", movieData.status);
  movie.set("recommended_by", movieData.recommendedBy || "");
  movie.set("Watchlist_id", watchlist);
  movie.setACL(new ParseInstance.ACL(currentUser));

  return await movie.save();
}
