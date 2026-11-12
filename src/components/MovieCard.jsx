import React, { useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Rating,
  Select,
  MenuItem,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { COLORS, FONTS } from "./theme";
import { PrimaryButton, DeleteButton } from "./Buttons";
import { StatusChip } from "./StatusChip";

export const MovieCard = ({
  title,
  status,
  description,
  rating = 0,
  onRatingChange,
  readOnlyRating = false,
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  movePlaceholder = "Move to...",
  moveOptions = [],
  selectedMove = "",
  onMoveChange,
  sx,
}) => {
  return (
    <Card
      sx={{
        backgroundColor: COLORS.darkGray, // #242327[cite: 1, 2]
        borderRadius: 2,
        width: 420,
        border: `1px solid ${COLORS.taupe}33`, // #A8A398[cite: 1]
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={1.75}>
          {/* Header Row: Truncated Title + Optional Status Chip */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1.5}
          >
            <Typography
              variant="body1"
              noWrap
              sx={{
                color: COLORS.cream, // #F5F0E8[cite: 1, 2]
                fontWeight: FONTS.weights.bold, // Calibri Bold 21px[cite: 3]
                flex: 1,
              }}
            >
              {title}
            </Typography>
            {status && <StatusChip label={status} />}
          </Stack>

          {/* Two-line truncated description */}
          {description && (
            <Typography
              variant="caption"
              sx={{
                color: COLORS.cream, // #F5F0E8[cite: 1, 2]
                fontWeight: FONTS.weights.regular, // Calibri Regular 17px[cite: 3]
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </Typography>
          )}

          {/* Star Rating */}
          <Rating
            value={rating}
            precision={0.5}
            readOnly={readOnlyRating}
            onChange={(_, newValue) =>
              onRatingChange && onRatingChange(newValue)
            }
            icon={<StarIcon sx={{ color: COLORS.gold, fontSize: 26 }} />} // #C9A45C[cite: 1, 2]
            emptyIcon={
              <StarBorderIcon sx={{ color: COLORS.taupe, fontSize: 26 }} /> // #A8A398[cite: 1, 2]
            }
          />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <PrimaryButton fullWidth onClick={onEdit}>
              {editLabel}
            </PrimaryButton>
            <DeleteButton fullWidth onClick={onDelete}>
              {deleteLabel}
            </DeleteButton>
          </Stack>

          {/* "Move to..." Select Dropdown */}
          <Select
            value={selectedMove}
            displayEmpty
            onChange={(e) => onMoveChange && onMoveChange(e.target.value)}
            size="small"
            IconComponent={(props) => (
              <ArrowDropDownIcon
                {...props}
                sx={{ color: `${COLORS.gold} !important` }} // #C9A45C[cite: 1, 2]
              />
            )}
            sx={{
              backgroundColor: COLORS.black, // #101012[cite: 1, 2]
              color: COLORS.gold, // #C9A45C[cite: 1, 2]
              py: 0.5,
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.gold,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.gold,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.gold,
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: COLORS.cream, // #F5F0E8[cite: 1, 2]
                  color: COLORS.darkGray, // #242327[cite: 1, 2]
                  mt: 0.5,
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              <Typography
                variant="body1"
                sx={{ color: COLORS.gold, fontWeight: FONTS.weights.regular }}
              >
                {movePlaceholder}
              </Typography>
            </MenuItem>
            {moveOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.darkGray,
                    fontWeight: FONTS.weights.regular,
                  }}
                >
                  {option.label}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </CardContent>
    </Card>
  );
};
