import Parse from "parse";

const applicationId = import.meta.env.VITE_APP_ID;
const javascriptKey = import.meta.env.VITE_JAVASCRIPT_KEY;
const serverURL = import.meta.env.VITE_PARSE_SERVER_URL;
const missingEnvironment = [
  ["VITE_APP_ID", applicationId],
  ["VITE_JAVASCRIPT_KEY", javascriptKey],
  ["VITE_PARSE_SERVER_URL", serverURL],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (!missingEnvironment.length) {
  Parse.initialize(applicationId, javascriptKey);
  Parse.serverURL = serverURL;
}

export const saveMovie = async (movieData) => {
  if (missingEnvironment.length) {
    throw new Error(
      `Missing required Parse configuration: ${missingEnvironment.join(", ")}.`,
    );
  }

  const Movie = Parse.Object.extend("Movie");
  const movie = new Movie();

  Object.entries(movieData).forEach(([field, value]) => {
    movie.set(field, value);
  });

  return movie.save();
};
