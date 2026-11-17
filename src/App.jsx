import { useState, useEffect } from "react";
import "./App.css";
import { Alert, Box, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { AuthForm } from "./components/AuthForm";
import { UserProfileCard } from "./components/UserProfileCard";
import { ShareWatchlistPanel } from "./components/ShareWatchlistPanel";
import { SharedWatchlistPage } from "./pages/SharedWatchlistPage";
import { WatchlistSection } from "./components/WatchlistSection";
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

  const [shareToken, setShareToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("share") || "";
  });

  useEffect(() => {
    function handlePopState() {
      const params = new URLSearchParams(window.location.search);
      setShareToken(params.get("share") || "");
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function openSharedView(token) {
    const newUrl = `${window.location.pathname}?share=${token}`;
    window.history.pushState({}, "", newUrl);
    setShareToken(token);
  }

  function closeSharedView() {
    window.history.pushState({}, "", window.location.pathname);
    setShareToken("");
  }

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

      <Box
        component="main"
        sx={{ width: "100%", maxWidth: 480, mx: "auto", p: 3 }}
      >
        {user ? (
          <Stack spacing={2.5}>
            <UserProfileCard
              name={user.get("name")}
              email={user.get("email")}
              onSignOut={handleSignOut}
            />
            {signOutError && <Alert severity="error">{signOutError}</Alert>}
            <WatchlistSection key={user.id} user={user} />
          </Stack>
        ) : (
          <AuthForm onAuthenticated={setUser} />
        )}
      </Box>

      {shareToken ? (
        <SharedWatchlistPage
          token={shareToken}
          currentUser={user}
          onGoToMyWatchlist={closeSharedView}
          onSignOut={handleSignOut}
        />
      ) : (
        <Box
          component="main"
          sx={{ width: "100%", maxWidth: 960, mx: "auto", p: 3 }}
        >
          {user ? (
            <Stack spacing={3} alignItems="flex-end">
              <UserProfileCard
                name={user.get("name")}
                email={user.get("email")}
                onSignOut={handleSignOut}
              />
              {signOutError && <Alert severity="error">{signOutError}</Alert>}

              <ShareWatchlistPanel
                user={user}
                onPreviewShared={(token) => openSharedView(token)}
              />
            </Stack>
          ) : (
            <Box sx={{ maxWidth: 480, mx: "auto" }}>
              <AuthForm onAuthenticated={setUser} />
            </Box>
          )}
        </Box>
      )}
    </ThemeProvider>
  );
}
