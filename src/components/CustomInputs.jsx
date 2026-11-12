import React from "react";
import {
  Paper,
  MenuList,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";
import { COLORS, FONTS } from "../theme";

export const CustomMenu = ({ items = [], onSelect, sx }) => (
  <Paper
    elevation={4}
    sx={{
      backgroundColor: COLORS.cream,
      borderRadius: 1.5,
      width: 340,
      py: 1,
      ...sx,
    }}
  >
    <MenuList>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => onSelect && onSelect(item)}
          sx={{
            py: 1,
            px: 2.5,
            "&:hover": {
              backgroundColor: "rgba(36, 35, 39, 0.08)",
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: COLORS.darkGray,
              fontWeight: FONTS.weights.regular,
            }}
          >
            {item}
          </Typography>
        </MenuItem>
      ))}
    </MenuList>
  </Paper>
);

export const CustomTextField = ({ label, value, onChange, sx, ...props }) => (
  <TextField
    label={label}
    value={value}
    onChange={onChange}
    variant="outlined"
    sx={{
      width: 240,
      "& .MuiOutlinedInput-root": {
        backgroundColor: COLORS.cream,
        color: COLORS.darkGray,
        fontFamily: FONTS.family,
        fontSize: "21px", // Body 21px[cite: 3]
        fontWeight: FONTS.weights.regular,
        "& fieldset": {
          borderColor: COLORS.darkGray,
        },
        "&:hover fieldset": {
          borderColor: COLORS.black,
        },
        "&.Mui-focused fieldset": {
          borderColor: COLORS.gold,
        },
      },
      "& .MuiInputLabel-root": {
        color: COLORS.darkGray,
        backgroundColor: COLORS.cream,
        fontFamily: FONTS.family,
        fontSize: "17px", // Caption 17px[cite: 3]
        fontWeight: FONTS.weights.regular,
        px: 0.5,
        "&.Mui-focused": {
          color: COLORS.black,
        },
      },
      ...sx,
    }}
    {...props}
  />
);
