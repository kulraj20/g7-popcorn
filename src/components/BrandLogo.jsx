import { Box, Stack, Typography } from "@mui/material";
import { COLORS, FONTS } from "./theme";

export function BrandLogo({ compact = false }) {
  const markSize = compact ? 38 : 52;

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <Box
        component="img"
        src="/favicon.png"
        alt=""
        aria-hidden="true"
        sx={{
          width: markSize,
          height: markSize,
          objectFit: "contain",
          flexShrink: 0,
        }}
      />
      <Typography
        component="span"
        sx={{
          fontFamily: FONTS.family,
          fontSize: compact ? 24 : 30,
          fontWeight: FONTS.weights.bold,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        <Box component="span" sx={{ color: COLORS.cream }}>
          Pop
        </Box>
        <Box component="span" sx={{ color: COLORS.gold }}>
          corn
        </Box>
      </Typography>
    </Stack>
  );
}
