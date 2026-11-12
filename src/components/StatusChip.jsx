import React from "react";
import { Chip, Typography } from "@mui/material";
import { COLORS, FONTS } from "./theme";

export const StatusChip = ({ label, sx, ...props }) => (
  <Chip
    label={
      <Typography
        variant="caption"
        sx={{
          color: COLORS.cream,
          fontWeight: FONTS.weights.regular,
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    }
    sx={{
      backgroundColor: COLORS.red,
      borderRadius: "999px",
      height: 30,
      px: 0.75,
      ...sx,
    }}
    {...props}
  />
);
