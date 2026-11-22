import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthForm } from "./components/AuthForm";
import { NavigationMenu } from "./components/NavigationMenu";
import { UserProfileCard } from "./components/UserProfileCard";
import { WatchlistSection } from "./components/WatchlistSection";
import { SharedWatchlistPage } from "./pages/SharedWatchlistPage";
import { COLORS, FONTS, theme } from "./components/theme";
import { getBack4App, isBack4AppConfigured } from "./lib/back4app";

// Tabs shown after sign-in. Add an entry here (and render it below) for new pages.
const NAV_ITEMS = [
  { id: "Want to Watch", label: "Want to Watch" },
  { id: "Watching", label: "Watching" },
  { id: "Watched", label: "Watched" },
];

export default function App() {
  const [activeView, setActiveView] = useState(NAV_ITEMS[0].id);
  const [user, setUser] = useState(() => {
    if (isBack4AppConfigured) {
      return getBack4App().User.current();
    }
    return null;
  });
  const [signOutError, setSignOutError] = useState("");
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

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
    setMobileMenuAnchor(null);

    try {
      const Parse = getBack4App();
      await Parse.User.logOut();
      setUser(null);
      setActiveView(NAV_ITEMS[0].id);
    } catch {
      setSignOutError("Couldn’t sign out. Try again.");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {shareToken ? (
        <SharedWatchlistPage
          token={shareToken}
          currentUser={user}
          onGoToMyWatchlist={closeSharedView}
          onSignOut={handleSignOut}
        />
      ) : !user ? (
        <Box
          component="main"
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.black,
            p: 3,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 440 }}>
            <AuthForm onAuthenticated={setUser} />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: COLORS.black,
            color: COLORS.cream,
          }}
        >
          <Box
            component="header"
            sx={{
              borderBottom: `1px solid ${COLORS.taupe}33`,
              backgroundColor: COLORS.darkGray,
              px: { xs: 2, md: 4 },
              py: 1.25,
            }}
          >
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                maxWidth: 1200,
                mx: "auto",
                width: "100%",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", color: COLORS.gold }}
              >
                <LocalMoviesIcon sx={{ fontSize: 32 }} />
                <Typography variant="h2" component="span">
                  Popcorn
                </Typography>
              </Stack>

              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <UserProfileCard
                  name={user.get("name")}
                  email={user.get("email")}
                  onSignOut={handleSignOut}
                  sx={{ p: 0.75, width: "auto" }}
                />
              </Box>

              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <IconButton
                  onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
                  aria-label="Open menu"
                  sx={{
                    color: COLORS.cream,
                    border: `1px solid ${COLORS.taupe}66`,
                    borderRadius: 1.5,
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={mobileMenuAnchor}
                  open={Boolean(mobileMenuAnchor)}
                  onClose={() => setMobileMenuAnchor(null)}
                  slotProps={{
                    paper: {
                      sx: {
                        backgroundColor: COLORS.cream,
                        color: COLORS.darkGray,
                        minWidth: 200,
                      },
                    },
                  }}
                >
                  <MenuItem disabled>
                    <Stack>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: FONTS.weights.bold }}
                      >
                        {user.get("name")}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: "14px" }}>
                        {user.get("email")}
                      </Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </Menu>
              </Box>
            </Stack>
          </Box>

          <NavigationMenu
            items={NAV_ITEMS}
            activeView={activeView}
            onViewChange={setActiveView}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: "100%",
              maxWidth: 1200,
              mx: "auto",
              px: { xs: 2, md: 4 },
              py: { xs: 3, md: 4 },
            }}
          >
            <Stack spacing={3}>
              {signOutError && <Alert severity="error">{signOutError}</Alert>}
              <WatchlistSection
                key={user.id}
                user={user}
                onPreviewShared={(token) => openSharedView(token)}
                activeStatus={activeView}
              />
            </Stack>
          </Box>

          <Box
            component="footer"
            sx={{
              borderTop: `1px solid ${COLORS.taupe}33`,
              backgroundColor: COLORS.darkGray,
              px: { xs: 2, md: 4 },
              py: 2.5,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                maxWidth: 1200,
                mx: "auto",
                width: "100%",
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: COLORS.gold, fontWeight: FONTS.weights.bold }}
              >
                Popcorn
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.taupe }}>
                Track, rate, and share your movie watchlist.
              </Typography>
            </Stack>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}
