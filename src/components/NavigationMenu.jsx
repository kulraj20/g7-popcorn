import { Box, Button, Stack } from "@mui/material";
import { COLORS } from "./theme";

export function NavigationMenu({ items, activeView, onViewChange }) {
  return (
    <Box
      component="nav"
      aria-label="Main navigation"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: COLORS.darkGray,
        borderBottom: `1px solid ${COLORS.taupe}33`,
      }}
    >
      <Stack
        direction="row"
        sx={{ flexWrap: "wrap", maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 } }}
      >
        {items.map(({ id, label }) => {
          const isActive = id === activeView;

          return (
            <Button
              key={id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onViewChange(id)}
              sx={{
                flex: "1 1 auto",
                minWidth: 0,
                minHeight: 48,
                px: 1,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                color: isActive ? COLORS.gold : COLORS.cream,
                borderRadius: 0,
                borderBottom: "2px solid",
                borderColor: isActive ? COLORS.gold : "transparent",
                "&.Mui-focusVisible": {
                  outline: `2px solid ${COLORS.gold}`,
                  outlineOffset: -2,
                },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}
