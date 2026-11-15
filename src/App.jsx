import { useState } from "react";
import { Alert, Box, CssBaseline, ThemeProvider } from "@mui/material";
import { AuthForm } from "./components/AuthForm";
import { UserProfileCard } from "./components/UserProfileCard";
import { theme } from "./components/theme";
import { getBack4App, isBack4AppConfigured } from "./lib/back4app";

export default function App() {
  const [user, setUser] = useState(() => {
    if (isBack4AppConfigured) {
      return getBack4App().User.current();
    }

    return null;
  });
  const [signOutError, setSignOutError] = useState("");

  async function handleSignOut() {
    setSignOutError("");

    try {
      const Parse = getBack4App();
      await Parse.User.logOut();
      setUser(null);
    } catch {
      setSignOutError("Couldn’t sign out. Try again.");
    }
  }

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Box component="main" sx={{ width: "100%", maxWidth: 480, mx: "auto", p: 3 }}>
          {user ? (
              <>
                <UserProfileCard
                    name={user.get("name")}
                    email={user.get("email")}
                    onSignOut={handleSignOut}
                />
                {signOutError && <Alert severity="error">{signOutError}</Alert>}
              </>
          ) : (
              <AuthForm onAuthenticated={setUser} />
          )}
        </Box>
      </ThemeProvider>
  );
}