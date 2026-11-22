import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS, FONTS } from "./theme";
import { NormalButton, PrimaryButton } from "./Buttons";
import { CustomTextField } from "./CustomInputs";

const initialFormState = {
  title: "",
  description: "",
  genre: "",
  runtime: "",
  recommendedBy: "",
  status: "Want to Watch",
  rating: "",
};

const genreOptions = [
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Horror",
  "Serial",
];

const statusOptions = ["Want to Watch", "Watching", "Watched"];
const ratingOptions = [1, 2, 3, 4, 5];

const AddMovieForm = ({ todo = null, onClose, onSave }) => {
  const [formData, setFormData] = useState(() =>
    todo
      ? {
          title: todo.title || "",
          description: todo.description || "",
          genre: todo.genre || "",
          runtime: todo.runtime || "",
          recommendedBy: todo.recommendedBy || "",
          status: todo.status || "Want to Watch",
          rating: todo.rating || "",
        }
      : initialFormState,
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const closeTimer = setTimeout(onClose, 1200);
    return () => clearTimeout(closeTimer);
  }, [successMessage, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updatedForm = {
        ...previous,
        [name]: value,
      };

      if (name === "status" && value !== "Watched") {
        updatedForm.rating = "";
      }

      return updatedForm;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title) {
      setError("Enter a movie title.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      if (typeof onSave === "function") {
        await onSave({
          ...formData,
          title,
          description,
          genre: formData.genre.trim(),
          runtime: String(formData.runtime).trim(),
          recommendedBy: formData.recommendedBy.trim(),
          rating: formData.rating ? Number(formData.rating) : 0,
        });
        setSuccessMessage(todo ? "Movie updated" : "Movie added");
      }
    } catch (err) {
      setError(err?.message || "Unable to save this movie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: COLORS.darkGray,
            border: `1px solid ${COLORS.gold}66`,
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Stack>
            <Typography
              variant="caption"
              sx={{ color: COLORS.gold, textTransform: "uppercase" }}
            >
              Watchlist
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: COLORS.cream, fontWeight: FONTS.weights.bold }}
            >
              {todo ? "Edit movie" : "Add movie"}
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            aria-label="Close form"
            sx={{ color: COLORS.cream }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: "16px !important" }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <CustomTextField
              label="Movie title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What do you want to watch?"
              required
              sx={{ width: "100%" }}
            />

            <CustomTextField
              label="Description / note"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Where did you hear about it? Anything to remember?"
              multiline
              rows={3}
              sx={{ width: "100%" }}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <CustomTextField
                select
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                sx={{ width: "100%" }}
              >
                <MenuItem value="">Select a genre</MenuItem>
                {formData.genre && !genreOptions.includes(formData.genre) && (
                  <MenuItem value={formData.genre}>{formData.genre}</MenuItem>
                )}
                {genreOptions.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </CustomTextField>

              <CustomTextField
                label="Runtime"
                name="runtime"
                value={formData.runtime}
                onChange={handleChange}
                placeholder="e.g. 120 min"
                sx={{ width: "100%" }}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <CustomTextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                sx={{ width: "100%" }}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </CustomTextField>

              <CustomTextField
                select
                label="Your rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                disabled={formData.status !== "Watched"}
                sx={{ width: "100%" }}
              >
                <MenuItem value="">Not rated</MenuItem>
                {ratingOptions.map((rating) => (
                  <MenuItem key={rating} value={rating}>
                    {rating} {rating === 1 ? "star" : "stars"}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Box>

            <CustomTextField
              label="Recommended by"
              name="recommendedBy"
              value={formData.recommendedBy}
              onChange={handleChange}
              placeholder="e.g. Maria or a friend"
              sx={{ width: "100%" }}
            />

            {error && <Alert severity="error">{error}</Alert>}
            {successMessage && (
              <Alert severity="success">{successMessage}</Alert>
            )}

            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "flex-end", pt: 1 }}
            >
              <NormalButton type="button" onClick={onClose}>
                Cancel
              </NormalButton>
              <PrimaryButton
                type="submit"
                disabled={isSubmitting || Boolean(successMessage)}
              >
                {successMessage ||
                  (isSubmitting
                    ? "Saving..."
                    : todo
                      ? "Save Movie"
                      : "Add Movie")}
              </PrimaryButton>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddMovieForm;
