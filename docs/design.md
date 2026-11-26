## Design token guide

### Run in the terminal:

```sh
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

### Role of each file

- **theme.js** (Design tokens): Exports the COLORS object (#101012, #D94A4A, #C9A45C, #F5F0E8, #242327, #A8A398) and FONTS weights. Whenever you build a new page or layout, import COLORS from this file instead of hardcoding hex values.
- **Buttons.jsx**, CustomLink.jsx and StatusChip.jsx (Basic UI): Contains NormalButton, PrimaryButton, DeleteButton, CustomLink, and StatusChip. Use these instead of default Material UI <Button> or <Chip> components so all interactive elements share the same borders, colors, and hover states.
- CustomInputs.jsx (Forms and menus): Contains CustomTextField (for forms, search bars, or modals) and CustomMenu (for dropdowns or navigation lists).
- MovieCard.jsx and UserProfileCard.jsx (Templates): Purely prop-driven cards. They do not hold any hardcoded data—you pass titles, ratings, user info, and click handlers (onEdit, onDelete, onSignOut) into them from your parent page.

### Rules to build the rest of the app

- Use Material UI Layout Components: Build page grids, navbars, and modals using MUI's <Box>, <Stack>, <Grid>, and <Dialog> components, styled with the sx prop.
- Stick to the Typography Variants: Use MUI's <Typography variant="..."> to stay locked into our type scale:
  - variant="h1" → 45px Bold (Page headers)
  - variant="h2" → 28px Bold (Section titles)
  - variant="body1" → 21px Regular (Standard text & buttons)
  - variant="caption" → 17px Regular (Subtitles, descriptions, & labels)
- Pass sx for Custom Spacing: All custom components accept an sx prop. If you need extra margin or a different width on a specific page, pass it directly (e.g., <PrimaryButton 2 mt: sx="{{" }}>Save</PrimaryButton>).

### App.jsx template to test the components

``js
export default function App() {
const [rating, setRating] = useState(0);
const [selectedList, setSelectedList] = useState("");

const listOptions = [
{ value: "list_1", label: "List 1" },
{ value: "list_2", label: "List 2" },
{ value: "list_3", label: "List 3" },
];

return (
<ThemeProvider theme={theme}>
<CssBaseline />
<Box sx={{ p: 4 }}>
<Stack spacing={3} alignItems="flex-start">
<MovieCard
title="Movie Title"
status="STATUS"
description="Movie description placeholder text that automatically truncates after two lines if it overflows the container."
rating={rating}
onRatingChange={(newRating) => setRating(newRating)}
onEdit={() => console.log("Edit clicked")}
onDelete={() => console.log("Delete clicked")}
moveOptions={listOptions}
selectedMove={selectedList}
onMoveChange={(newList) => setSelectedList(newList)}
/>

          <UserProfileCard
            name="User Name"
            email="user@example.com"
            onSignOut={() => console.log("Sign out clicked")}
          />
        </Stack>
      </Box>
    </ThemeProvider>

);
}

```

```
