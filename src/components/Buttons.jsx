import React from "react";
import { Button, Typography } from "@mui/material";
import { COLORS, FONTS } from "./theme";

export const NormalButton = ({ children, sx, ...props }) => (
  <Button
    variant="outlined"
    sx={{
      backgroundColor: COLORS.cream,
      color: COLORS.darkGray,
      borderColor: COLORS.darkGray,
      px: 3,
      py: 0.75,
      "&:hover": {
        backgroundColor: "#EAE3D5",
        borderColor: COLORS.black,
      },
      ...sx,
    }}
    {...props}
  >
    <Typography
      variant="body1"
      sx={{ color: "inherit", fontWeight: FONTS.weights.regular }}
    >
      {children}
    </Typography>
  </Button>
);

export const PrimaryButton = ({ children, sx, ...props }) => (
  <Button
    variant="outlined"
    sx={{
      backgroundColor: COLORS.black,
      color: COLORS.gold,
      borderColor: COLORS.gold,
      px: 3,
      py: 0.75,
      "&:hover": {
        backgroundColor: COLORS.darkGray,
        borderColor: COLORS.gold,
      },
      ...sx,
    }}
    {...props}
  >
    <Typography
      variant="body1"
      sx={{ color: "inherit", fontWeight: FONTS.weights.regular }}
    >
      {children}
    </Typography>
  </Button>
);

export const DeleteButton = ({ children, sx, ...props }) => (
  <Button
    variant="contained"
    disableElevation
    sx={{
      backgroundColor: COLORS.red,
      color: COLORS.cream,
      px: 3,
      py: 0.75,
      "&:hover": {
        backgroundColor: "#C03B3B",
      },
      ...sx,
    }}
    {...props}
  >
    <Typography
      variant="body1"
      sx={{ color: "inherit", fontWeight: FONTS.weights.regular }}
    >
      {children}
    </Typography>
  </Button>
);
