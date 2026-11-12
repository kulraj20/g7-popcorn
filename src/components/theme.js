import { createTheme } from "@mui/material/styles";

export const COLORS = {
  black: "#101012", // Primary dark surface[cite: 1]
  red: "#D94A4A", // Danger / Accent chip & button[cite: 1]
  gold: "#C9A45C", // Primary accent / Borders / Stars / Links[cite: 1]
  cream: "#F5F0E8", // Light surface / Text / Input background[cite: 1]
  darkGray: "#242327", // Card background / Secondary dark[cite: 1]
  taupe: "#A8A398", // Muted text / Avatar background[cite: 1]
};

export const FONTS = {
  family: 'Calibri, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', //[cite: 3]
  weights: {
    regular: 400, //[cite: 3]
    bold: 700, //[cite: 3]
  },
};

export const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.gold,
      contrastText: COLORS.black,
    },
    error: {
      main: COLORS.red,
      contrastText: COLORS.cream,
    },
    background: {
      default: COLORS.cream,
      paper: COLORS.darkGray,
    },
    text: {
      primary: COLORS.darkGray,
      secondary: COLORS.taupe,
    },
  },
  typography: {
    fontFamily: FONTS.family,
    fontWeightRegular: FONTS.weights.regular,
    fontWeightBold: FONTS.weights.bold,
    // 45px Heading ("Caption 45px" in spec)[cite: 3]
    h1: {
      fontFamily: FONTS.family,
      fontSize: "45px",
      fontWeight: FONTS.weights.bold,
      lineHeight: 1.2,
    },
    // 28px Heading ("Title 28px" in spec)[cite: 3]
    h2: {
      fontFamily: FONTS.family,
      fontSize: "28px",
      fontWeight: FONTS.weights.bold,
      lineHeight: 1.3,
    },
    // 21px Text ("Body 21px" in spec)[cite: 3]
    body1: {
      fontFamily: FONTS.family,
      fontSize: "21px",
      fontWeight: FONTS.weights.regular,
      lineHeight: 1.4,
    },
    // 17px Text ("Caption 17px" in spec)[cite: 3]
    caption: {
      fontFamily: FONTS.family,
      fontSize: "17px",
      fontWeight: FONTS.weights.regular,
      lineHeight: 1.4,
    },
    button: {
      fontFamily: FONTS.family,
      fontSize: "21px",
      fontWeight: FONTS.weights.regular,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 6,
  },
});
