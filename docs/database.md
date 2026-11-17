# Database

## Local setup

1. Create a Back4App backend app and open **App Settings → Security & Keys**.
2. Copy `.env.example` to `.env.local` if the local file does not exist.
3. Fill in `VITE_BACK4APP_APPLICATION_ID` and `VITE_BACK4APP_JAVASCRIPT_KEY` in `.env.local`.
4. Run `npm install` and `npm run dev`. Restart the dev server after changing environment variables.

## Database Structure

The database is hosted on **Back4App (Parse)** and consists of three classes.

### Movie

| Field          | Type               |
| -------------- | ------------------ |
| objectId       | str                |
| createdAt      | date               |
| updatedAt      | date               |
| ACL            | ACL                |
| title          | str                |
| description    | str                |
| genre          | str                |
| runtime_min    | str                |
| status         | str                |
| recommended_by | str                |
| Watchlist_id   | Pointer<Watchlist> |

### Watchlist

| Field     | Type            |
| --------- | --------------- |
| objectId  | str             |
| createdAt | date            |
| updatedAt | date            |
| ACL       | ACL             |
| user      | Pointer<\_User> |

### \_User

Default Back4App class for user authentication and account management.

| Field         | Type   |
| ------------- | ------ |
| objectId      | str    |
| createdAt     | date   |
| updatedAt     | date   |
| ACL           | ACL    |
| username      | str    |
| password      | str    |
| email         | str    |
| emailVerified | bool   |
| authData      | object |

## Usage

The app uses Back4App's Parse database. `src/lib/back4app.js` initializes Parse; import `getBack4App()` wherever database access is needed. It throws a helpful error if the `.env.local` settings are missing. Database calls are asynchronous, so use `await` in `try/catch` blocks and show errors in the UI.

Parse also manages `objectId`, `createdAt`, `updatedAt`, and access control (ACL). Do not set these metadata fields yourself. The app accesses the signed-in user with `Parse.User.current()` and reads fields with `user.get("name")`; signup, login, and logout use `Parse.User` methods (see `src/components/AuthForm.jsx` and `src/App.jsx`).

### CRUD with Parse

```js
import { getBack4App } from "./lib/back4app";

const Parse = getBack4App();
const Movie = Parse.Object.extend("Movie");

// Enumerate/query objects in a class. Add constraints before find() as needed.
const query = new Parse.Query(Movie);
query.limit(100); // Use limit() and skip() to page through larger result sets.
const movies = await query.find();

// Add
const movie = new Movie();
movie.set("title", "Example");
movie.set("status", "planned");
await movie.save();

// Edit: fetch the object, change fields, and save it.
const existing = await query.get(movie.id);
existing.set("status", "watched");
await existing.save();

// Delete
await existing.destroy();
```

Use the exact class and field names from the schema. For pointer fields, set a related Parse object (for example, `movie.set("Watchlist_id", watchlist)`). Queries return Parse objects; read their values with `.get("fieldName")`. Keep the Back4App master key server-side and configure class permissions/ACLs so users can access only the records they should. The browser app uses the application ID and JavaScript key from `.env.local`.
