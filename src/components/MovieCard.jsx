import { useId, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Rating,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { COLORS, FONTS } from "./theme";
import { PrimaryButton } from "./Buttons";
import { StatusChip } from "./StatusChip";

const actionButtonSx = {
  width: 96,
  minWidth: 96,
  minHeight: 38,
  px: 1.25,
  py: 0.25,
  flex: "0 0 96px",
  "& .MuiTypography-root": {
    fontSize: "14px",
    fontWeight: FONTS.weights.bold,
    whiteSpace: "nowrap",
  },
};

const menuPaperSx = {
  backgroundColor: COLORS.darkGray,
  border: `1px solid ${COLORS.taupe}66`,
  borderRadius: 1.5,
  color: COLORS.cream,
  minWidth: 140,
};

export const MovieCard = ({
  title,
  genre,
  status,
  description,
  rating = 0,
  onRatingChange,
  readOnlyRating = false,
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  moveOptions = [],
  onMoveChange,
  sx,
}) => {
  const menuId = `movie-actions-${useId()}`;
  const moveMenuId = `${menuId}-move`;
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [moveMenuAnchor, setMoveMenuAnchor] = useState(null);
  const isMenuOpen = Boolean(menuAnchor);
  const isMoveMenuOpen = Boolean(moveMenuAnchor);

  const handleDelete = () => {
    setMenuAnchor(null);
    onDelete?.();
  };

  return (
    <Card
      sx={{
        backgroundColor: COLORS.darkGray, // #242327[cite: 1, 2]
        borderRadius: 2,
        width: "100%",
        border: `1px solid ${COLORS.taupe}33`,
        borderLeft: `3px solid ${COLORS.gold}`,
        transition: "border-color 160ms ease, transform 160ms ease",
        "&:hover": {
          borderColor: `${COLORS.gold}88`,
          transform: "translateY(-1px)",
        },
        ...sx,
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, md: 2.25 },
          "&:last-child": { pb: { xs: 2, md: 2.25 } },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 1.5, md: 3 }}
          alignItems="stretch"
        >
          <Stack spacing={1} sx={{ flex: 1, minWidth: 0, py: 0.5 }}>
            <Stack
              direction="row"
              useFlexGap
              flexWrap="wrap"
              alignItems="center"
              spacing={1}
            >
              <Typography
                variant="body1"
                title={title}
                sx={{
                  color: COLORS.cream,
                  fontWeight: FONTS.weights.bold,
                  flex: "0 1 auto",
                  minWidth: 0,
                  maxWidth: { xs: "100%", sm: "65%" },
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ flexShrink: 0, ml: { xs: 0, sm: 1 } }}
              >
                {genre && <StatusChip label={genre} />}
                {status === "Watched" && rating > 0 && (
                  <Rating
                    value={rating}
                    precision={0.5}
                    readOnly={readOnlyRating}
                    onChange={(_, newValue) =>
                      onRatingChange && onRatingChange(newValue)
                    }
                    icon={
                      <StarIcon sx={{ color: COLORS.gold, fontSize: 22 }} />
                    }
                    emptyIcon={
                      <StarBorderIcon
                        sx={{ color: COLORS.taupe, fontSize: 22 }}
                      />
                    }
                  />
                )}
              </Stack>
            </Stack>

            {description && (
              <Typography
                variant="caption"
                sx={{
                  color: COLORS.cream,
                  fontWeight: FONTS.weights.regular,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {description}
              </Typography>
            )}
          </Stack>

          <Stack
            spacing={1.5}
            sx={{
              width: { xs: "100%", md: 320 },
              maxWidth: "100%",
              flexShrink: 0,
              borderTop: {
                xs: `1px solid ${COLORS.taupe}33`,
                md: "none",
              },
              borderLeft: {
                xs: "none",
                md: `1px solid ${COLORS.taupe}33`,
              },
              pt: { xs: 1.5, md: 0 },
              pl: { xs: 0, md: 2.5 },
            }}
          >
            <Stack
              direction="row"
              useFlexGap
              flexWrap="wrap"
              spacing={1.5}
              alignItems="center"
            >
              {moveOptions.length > 0 && (
                <>
                  <Button
                    variant="outlined"
                    endIcon={<ExpandMoreIcon />}
                    aria-label={`Move ${title} to another status`}
                    aria-haspopup="menu"
                    aria-expanded={isMoveMenuOpen}
                    aria-controls={isMoveMenuOpen ? moveMenuId : undefined}
                    onClick={(event) =>
                      setMoveMenuAnchor(event.currentTarget)
                    }
                    sx={{
                      minWidth: 112,
                      minHeight: 38,
                      px: 1.25,
                      borderColor: `${COLORS.gold}99`,
                      borderRadius: 1.5,
                      color: COLORS.gold,
                      fontSize: "12px",
                      fontWeight: FONTS.weights.bold,
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        borderColor: COLORS.gold,
                        backgroundColor: `${COLORS.gold}18`,
                      },
                      "& .MuiButton-endIcon": { ml: 0.5 },
                    }}
                  >
                    Move to
                  </Button>
                  <Menu
                    id={moveMenuId}
                    anchorEl={moveMenuAnchor}
                    open={isMoveMenuOpen}
                    onClose={() => setMoveMenuAnchor(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    slotProps={{ paper: { sx: menuPaperSx } }}
                  >
                    {moveOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => {
                          setMoveMenuAnchor(null);
                          onMoveChange?.(option.value);
                        }}
                        sx={{ fontSize: "14px" }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ flex: "0 0 auto", minWidth: 0 }}
              >
                <PrimaryButton onClick={onEdit} sx={actionButtonSx}>
                  {editLabel}
                </PrimaryButton>
                <IconButton
                  aria-label={`More actions for ${title}`}
                  aria-haspopup="menu"
                  aria-expanded={isMenuOpen}
                  aria-controls={isMenuOpen ? menuId : undefined}
                  onClick={(event) => setMenuAnchor(event.currentTarget)}
                  sx={{
                    width: 38,
                    height: 38,
                    color: COLORS.cream,
                    border: `1px solid ${COLORS.taupe}66`,
                    borderRadius: 1.5,
                    "&:hover": {
                      color: COLORS.gold,
                      borderColor: COLORS.gold,
                      backgroundColor: `${COLORS.gold}12`,
                    },
                  }}
                >
                  <MoreHorizIcon />
                </IconButton>
                <Menu
                  id={menuId}
                  anchorEl={menuAnchor}
                  open={isMenuOpen}
                  onClose={() => setMenuAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  slotProps={{
                    paper: { sx: { ...menuPaperSx, mt: 0.75 } },
                  }}
                >
                  <MenuItem
                    onClick={handleDelete}
                    sx={{
                      mx: 0.5,
                      my: 0.5,
                      px: 1.5,
                      borderRadius: 1,
                      border: `1px solid ${COLORS.red}66`,
                      color: COLORS.red,
                      backgroundColor: `${COLORS.red}24`,
                      fontWeight: FONTS.weights.bold,
                      fontSize: "14px",
                      "&:hover": { backgroundColor: `${COLORS.red}38` },
                    }}
                  >
                    <DeleteOutlineIcon
                      fontSize="small"
                      aria-hidden="true"
                      sx={{ mr: 1 }}
                    />
                    {deleteLabel}
                  </MenuItem>
                </Menu>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
