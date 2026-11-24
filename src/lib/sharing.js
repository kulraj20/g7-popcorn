import { getBack4App } from "./back4app";
import { getOrCreateWatchlist } from "../services/watchlistService";

function generateSecureToken() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return (
      crypto.randomUUID().replace(/-/g, "") +
      crypto.randomUUID().replace(/-/g, "")
    );
  }
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
}

export async function getOrCreateSharedLink(user) {
  const Parse = getBack4App();
  const watchlist = await getOrCreateWatchlist(user);

  if (!watchlist.get("name")) {
    const ownerName = user.get("name") || user.get("username") || "User";
    watchlist.set("name", `${ownerName}'s Watchlist`);
    await watchlist.save();
  }

  const SharedLink = Parse.Object.extend("SharedLink");
  const query = new Parse.Query(SharedLink);
  query.equalTo("watchlist_id", watchlist);
  query.equalTo("is_active", true);

  let sharedLink = await query.first();

  if (!sharedLink) {
    sharedLink = new SharedLink();
    sharedLink.set("watchlist_id", watchlist);
    sharedLink.set("token", generateSecureToken());
    sharedLink.set("is_active", true);

    const acl = new Parse.ACL(user);
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    sharedLink.setACL(acl);

    await sharedLink.save();
  }

  const token = sharedLink.get("token");
  const shareUrl = `${window.location.origin}${window.location.pathname}?share=${token}`;

  return { token, shareUrl, watchlist };
}

export async function fetchSharedWatchlistByToken(token) {
  const Parse = getBack4App();
  const SharedLink = Parse.Object.extend("SharedLink");

  const linkQuery = new Parse.Query(SharedLink);
  linkQuery.equalTo("token", token);
  linkQuery.equalTo("is_active", true);
  linkQuery.include("watchlist_id");

  const sharedLink = await linkQuery.first();
  if (!sharedLink) {
    throw new Error("This shared link is invalid or no longer active.");
  }

  const watchlist = sharedLink.get("watchlist_id");
  if (!watchlist) {
    throw new Error("Watchlist not found.");
  }

  const Movie = Parse.Object.extend("Movie");
  const movieQuery = new Parse.Query(Movie);
  movieQuery.equalTo("Watchlist_id", watchlist);
  movieQuery.descending("createdAt");

  const movieObjects = await movieQuery.find();

  const movies = movieObjects.map((m) => ({
    id: m.id,
    title: m.get("title") || "Untitled Movie",
    description: m.get("description") || "",
    genre: m.get("genre") || "",
    runtime_min: m.get("runtime_min") || null,
    status: (m.get("status") || "want to watch").toLowerCase(),
    rating: m.get("rating") || 0,
    interest: m.get("interest") || "",
    recommended_by: m.get("recommended_by") || "",
  }));

  return {
    watchlistName: watchlist.get("name") || "Shared Watchlist",
    movies,
  };
}
