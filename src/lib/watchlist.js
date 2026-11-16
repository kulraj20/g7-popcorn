import { getBack4App } from "./back4app";

const watchlistRequests = new Map();

function getOrCreateWatchlist(Parse, user) {
  const pendingRequest = watchlistRequests.get(user.id);
  if (pendingRequest) return pendingRequest;

  const request = (async () => {
    const WatchlistObject = Parse.Object.extend("Watchlist");
    const query = new Parse.Query(WatchlistObject);
    query.equalTo("user", user);

    const existingWatchlist = await query.first();
    if (existingWatchlist) return existingWatchlist;

    const watchlist = new WatchlistObject();
    watchlist.set("user", user);

    const acl = new Parse.ACL();
    acl.setReadAccess(user, true);
    acl.setWriteAccess(user, true);
    watchlist.setACL(acl);

    return watchlist.save();
  })();

  watchlistRequests.set(user.id, request);
  request.then(
    () => watchlistRequests.delete(user.id),
    () => watchlistRequests.delete(user.id),
  );
  return request;
}

export async function getWatchlistMovies(user) {
  const Parse = getBack4App();
  const watchlist = await getOrCreateWatchlist(Parse, user);
  const movieQuery = new Parse.Query("Movie");
  movieQuery.equalTo("Watchlist_id", watchlist);
  return movieQuery.find();
}
