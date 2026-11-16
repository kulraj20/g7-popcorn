import React from "react";
import { Paper, Stack, Avatar, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { COLORS, FONTS } from "./theme";
import { NormalButton } from "./Buttons";

export const UserProfileCard = ({
  name,
  email,
  avatarUrl,
  onSignOut,
  signOutLabel = "Sign out",
  sx,
}) => (
  <Paper
    elevation={0}
    sx={{
      backgroundColor: COLORS.darkGray, // #242327[cite: 1, 2]
      borderRadius: 1.5,
      p: 2,
      width: 350,
      ...sx,
    }}
  >
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Avatar
          src={avatarUrl}
          sx={{
            backgroundColor: COLORS.taupe, // #A8A398[cite: 1, 2]
            color: COLORS.cream, // #F5F0E8[cite: 1, 2]
            width: 44,
            height: 44,
          }}
        >
          {!avatarUrl && <PersonIcon />}
        </Avatar>
        <Stack>
          <Typography
            variant="body1"
            sx={{
              color: COLORS.cream,
              fontWeight: FONTS.weights.regular, // Calibri Regular 21px[cite: 3]
              lineHeight: 1.15,
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: COLORS.taupe,
              fontWeight: FONTS.weights.regular, // Calibri Regular 17px[cite: 3]
              lineHeight: 1.2,
            }}
          >
            {email}
          </Typography>
        </Stack>
      </Stack>

      <NormalButton
        onClick={onSignOut}
        sx={{
          py: 0.5,
          px: 2,
          borderColor: "transparent",
        }}
      >
        {signOutLabel}
      </NormalButton>
    </Stack>
  </Paper>
);
