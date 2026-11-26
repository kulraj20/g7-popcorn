import React from "react";
import { Chip, Typography } from "@mui/material";
import { COLORS, FONTS } from "./theme";

export const StatusChip = ({
  label,
  sx,
  textColor = COLORS.black,
  ...props
}) => (
  <Chip
    label={
      <Typography
        variant="caption"
        sx={{
          color: textColor,
          fontSize: "13px",
          fontWeight: FONTS.weights.bold,
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    }
    sx={{
      backgroundColor: COLORS.gold,
      borderRadius: "4px",
      height: 26,
      px: 0.75,
      ...sx,
    }}
    {...props}
  />
);
