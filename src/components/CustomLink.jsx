import React from "react";
import { Link, Typography } from "@mui/material";
import { COLORS, FONTS } from "../theme";

export const CustomLink = ({ children, href = "#", sx, ...props }) => (
  <Link
    href={href}
    underline="always"
    sx={{
      color: COLORS.gold,
      textDecorationColor: COLORS.gold,
      cursor: "pointer",
      "&:hover": {
        color: COLORS.black,
      },
      ...sx,
    }}
    {...props}
  >
    <Typography
      variant="caption"
      component="span"
      sx={{ color: "inherit", fontWeight: FONTS.weights.regular }}
    >
      {children}
    </Typography>
  </Link>
);
