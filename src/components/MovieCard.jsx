import React, { useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Rating,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { COLORS, FONTS } from "./theme";
import { PrimaryButton, DeleteButton } from "./Buttons";
import { StatusChip } from "./StatusChip";

const actionButtonSx = {
  minWidth: 88,
  minHeight: 32,
  px: 1.5,
  py: 0.25,
  "& .MuiTypography-root": {
    fontSize: "14px",
    fontWeight: FONTS.weights.bold,
    whiteSpace: "nowrap",
  },
};

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
  moveOptions = [],
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
          <Stack direction="row" spacing={1.5} justifyContent="center">
            <PrimaryButton onClick={onEdit} sx={actionButtonSx}>
              {editLabel}
            </PrimaryButton>
            <DeleteButton onClick={onDelete} sx={actionButtonSx}>
              {deleteLabel}
            </DeleteButton>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {moveOptions.map((option) => (
              <Button
                key={option.value}
                variant="outlined"
                size="small"
                onClick={() => onMoveChange?.(option.value)}
                aria-label={`Move ${title} to ${option.label}`}
                sx={{
                  flex: "1 1 0",
                  minWidth: 0,
                  minHeight: 34,
                  px: 1,
                  py: 0.5,
                  borderColor: `${COLORS.gold}99`,
                  borderRadius: "4px",
                  backgroundColor: COLORS.black,
                  color: COLORS.gold,
                  fontSize: "13px",
                  fontWeight: FONTS.weights.bold,
                  lineHeight: 1.2,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: COLORS.gold,
                    backgroundColor: `${COLORS.gold}18`,
                  },
                }}
              >
                Move to {option.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
