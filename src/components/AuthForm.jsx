import { useState } from "react";
import { Alert, Stack, Typography } from "@mui/material";
import { BrandLogo } from "./BrandLogo";
import { NormalButton, PrimaryButton } from "./Buttons";
import { CustomTextField } from "./CustomInputs";
import { COLORS } from "./theme";
import { getBack4App } from "../lib/back4app";

export function AuthForm({ onAuthenticated }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email").trim().toLowerCase();
    const password = formData.get("password");

    setError("");

    try {
      const Parse = getBack4App();

      if (isSignUp) {
        const user = new Parse.User();
        user.set("name", formData.get("name").trim());
        user.set("email", email);
        user.set("username", email);
        user.set("password", password);
        await user.signUp();
        onAuthenticated(user);
      } else {
        const user = await Parse.User.logIn(email, password);
        onAuthenticated(user);
      }
    } catch {
      setError(
        isSignUp
          ? "Couldn’t create your account. Check your details and try again."
          : "Couldn’t sign in. Check your details and try again.",
      );
    }
  }

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <Stack
        component="header"
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          width: "100%",
          alignSelf: "center",
          justifyContent: "center",
          position: "relative",
          top: { xs: -32, sm: -48 },
          mb: 1,
          color: COLORS.gold,
        }}
      >
        <BrandLogo />
      </Stack>

      <Typography component="h1" variant="h2" sx={{ color: COLORS.cream }}>
        {isSignUp ? "Create account" : "Sign in"}
      </Typography>

      {isSignUp && (
        <CustomTextField
          label="Name"
          name="name"
          autoComplete="name"
          required
          sx={{ width: "100%" }}
        />
      )}

      <CustomTextField
        label="Email"
        name="email"
        type="email"
        autoComplete="username"
        required
        sx={{ width: "100%" }}
      />

      <CustomTextField
        label="Password"
        name="password"
        type="password"
        autoComplete={isSignUp ? "new-password" : "current-password"}
        required
        sx={{ width: "100%" }}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <PrimaryButton type="submit">
        {isSignUp ? "Create account" : "Sign in"}
      </PrimaryButton>

      <NormalButton
        type="button"
        onClick={() => setIsSignUp((current) => !current)}
        sx={{
          backgroundColor: "transparent",
          color: COLORS.cream,
          borderColor: COLORS.taupe,
          "&:hover": {
            backgroundColor: COLORS.black,
            borderColor: COLORS.gold,
          },
        }}
      >
        {isSignUp ? "Back to sign in" : "Create an account"}
      </NormalButton>
    </Stack>
  );
}
