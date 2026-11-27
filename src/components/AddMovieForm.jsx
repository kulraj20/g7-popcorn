import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS, FONTS } from "./theme";
import { NormalButton, PrimaryButton } from "./Buttons";
import { CustomTextField } from "./CustomInputs";
import "./AddMovieForm.css";

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
  "Romance",
  "Sci-Fi",
  "Horror",
  "Thriller",
  "Serial",
];

const statusOptions = ["Want to Watch", "Watching", "Watched"];
const ratingOptions = [1, 2, 3, 4, 5];
const movieFieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
    backgroundColor: COLORS.black,
    color: COLORS.cream,
    fontSize: "16px",
    "& fieldset": { borderColor: COLORS.taupe },
    "&:hover fieldset": { borderColor: COLORS.cream },
    "&.Mui-focused fieldset": {
      borderColor: COLORS.gold,
      borderWidth: 1,
    },
    "&.MuiInputBase-multiline": {
      alignItems: "flex-start",
      padding: "8px 12px",
    },
  },
  "& .MuiOutlinedInput-input": { padding: "10px 12px" },
  "& .MuiOutlinedInput-inputMultiline": {
    alignSelf: "flex-start",
    padding: 0,
    textAlign: "left",
  },
  "& .MuiOutlinedInput-input::placeholder": {
    color: COLORS.taupe,
    opacity: 0.75,
  },
};

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
          rating: todo.rating ?? "",
        }
      : initialFormState,
  );
  const [hoverRating, setHoverRating] = useState(0);
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

  const isRatingDisabled = formData.status !== "Watched";
  const activeRating =
    hoverRating || Number(formData.rating) || 0;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
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
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      fullWidth
      maxWidth={false}
      className="add-movie-dialog"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: COLORS.darkGray,
            border: `1px solid ${COLORS.taupe}99`,
            borderRadius: "10px",
            width: "min(620px, calc(100% - 32px))",
            maxHeight: "calc(100dvh - 32px)",
            m: 0,
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.55)",
          },
        },
      }}
    >
      <DialogTitle className="add-movie-dialog-title">
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Stack>
            <Typography
              className="add-movie-kicker"
              sx={{
                color: COLORS.gold,
                fontSize: 14,
                fontWeight: FONTS.weights.bold,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
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
            className="add-movie-close"
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1,
              backgroundColor: COLORS.black,
              color: COLORS.cream,
              "&:hover": {
                backgroundColor: COLORS.red,
                color: COLORS.black,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent className="add-movie-dialog-content">
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2} className="add-movie-form-fields">
            <Box className="add-movie-field">
              <Typography
                component="label"
                htmlFor="movie-title"
                className="add-movie-field-label"
              >
                Movie title
              </Typography>
              <CustomTextField
                id="movie-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What do you want to watch?"
                required
                className="add-movie-text-field"
                sx={movieFieldSx}
              />
            </Box>

            <Box className="add-movie-field">
              <Typography
                component="label"
                htmlFor="movie-description"
                className="add-movie-field-label"
              >
                Description / note
              </Typography>
              <CustomTextField
                id="movie-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Where did you hear about it? Anything to remember?"
                multiline
                minRows={1}
                maxRows={3}
                className="add-movie-text-field"
                sx={movieFieldSx}
              />
            </Box>

            <Box className="add-movie-form-row">
              <Box className="add-movie-field">
                <Typography component="span" className="add-movie-field-label">
                  Genre
                </Typography>
                <Box
                  className="add-movie-choices"
                  role="radiogroup"
                  aria-label="Genre"
                >
                  {formData.genre && !genreOptions.includes(formData.genre) && (
                    <label className="add-movie-choice" key={formData.genre}>
                      <input
                        type="radio"
                        name="genre"
                        value={formData.genre}
                        checked
                        onChange={handleChange}
                      />
                      <span>{formData.genre}</span>
                    </label>
                  )}
                  {genreOptions.map((genre) => {
                    const inputId = `movie-genre-${genre
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}`;

                    return (
                      <label
                        className="add-movie-choice"
                        htmlFor={inputId}
                        key={genre}
                      >
                        <input
                          id={inputId}
                          type="radio"
                          name="genre"
                          value={genre}
                          checked={formData.genre === genre}
                          onChange={handleChange}
                        />
                        <span>{genre}</span>
                      </label>
                    );
                  })}
                </Box>
              </Box>

              <Box className="add-movie-field">
                <Typography
                  component="label"
                  htmlFor="movie-runtime"
                  className="add-movie-field-label"
                >
                  Runtime
                </Typography>
                <CustomTextField
                  id="movie-runtime"
                  name="runtime"
                  type="number"
                  value={formData.runtime}
                  onChange={handleChange}
                  placeholder="e.g. 120 min"
                  className="add-movie-text-field"
                  sx={movieFieldSx}
                />
              </Box>
            </Box>

            <Box className="add-movie-field">
              <Typography component="span" className="add-movie-field-label">
                Status
              </Typography>
              <Box
                className="add-movie-choices"
                role="radiogroup"
                aria-label="Status"
              >
                {statusOptions.map((status) => {
                  const inputId = `movie-status-${status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`;

                  return (
                    <label
                      className="add-movie-choice"
                      htmlFor={inputId}
                      key={status}
                    >
                      <input
                        id={inputId}
                        type="radio"
                        name="status"
                        value={status}
                        checked={formData.status === status}
                        onChange={handleChange}
                        required
                      />
                      <span>{status}</span>
                    </label>
                  );
                })}
              </Box>
            </Box>

            <Box className="add-movie-form-row">
              <Box className="add-movie-field">
                <Typography component="span" className="add-movie-field-label">
                  Your rating
                </Typography>
                <Box
                  className="add-movie-rating"
                  role="radiogroup"
                  aria-label="Your rating"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {ratingOptions.map((rating) => {
                    const inputId = `movie-rating-${rating}`;

                    return (
                      <label
                        className={`add-movie-star ${
                          rating <= activeRating ? "is-filled" : ""
                        } ${isRatingDisabled ? "is-disabled" : ""}`}
                        htmlFor={inputId}
                        key={rating}
                        onMouseEnter={() =>
                          !isRatingDisabled && setHoverRating(rating)
                        }
                      >
                        <input
                          id={inputId}
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={Number(formData.rating) === rating}
                          onChange={handleChange}
                          disabled={isRatingDisabled}
                        />
                        <span aria-hidden="true">★</span>
                      </label>
                    );
                  })}
                </Box>
                <Box className="add-movie-rating-footer">
                  <Typography
                    component="span"
                    className={`add-movie-rating-hint ${
                      isRatingDisabled ? "" : "is-hidden"
                    }`}
                    aria-hidden={!isRatingDisabled}
                    sx={{
                      fontSize: "12px",
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Available when status is Watched
                  </Typography>
                  <button
                    type="button"
                    className={`add-movie-clear-rating ${
                      formData.rating && !isRatingDisabled ? "is-visible" : ""
                    }`}
                    onClick={() =>
                      handleChange({
                        target: { name: "rating", value: "" },
                      })
                    }
                    disabled={!formData.rating || isRatingDisabled}
                    aria-hidden={!formData.rating || isRatingDisabled}
                  >
                    Clear
                  </button>
                </Box>
              </Box>

              <Box className="add-movie-field">
                <Typography
                  component="label"
                  htmlFor="movie-recommended-by"
                  className="add-movie-field-label"
                >
                  Recommended by
                </Typography>
                <CustomTextField
                  id="movie-recommended-by"
                  name="recommendedBy"
                  value={formData.recommendedBy}
                  onChange={handleChange}
                  placeholder="e.g. Maria or a friend"
                  className="add-movie-text-field"
                  sx={movieFieldSx}
                />
              </Box>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {successMessage && (
              <Alert severity="success">{successMessage}</Alert>
            )}

            <Stack
              direction="row"
              spacing={2}
              className="add-movie-actions"
            >
              <NormalButton
                type="button"
                onClick={onClose}
                sx={{
                  backgroundColor: "transparent",
                  color: COLORS.cream,
                  borderColor: COLORS.taupe,
                  "&:hover": {
                    backgroundColor: COLORS.black,
                    borderColor: COLORS.gold,
                  },
                }}
              >
                Cancel
              </NormalButton>
              <PrimaryButton
                type="submit"
                disabled={isSubmitting || Boolean(successMessage)}
                sx={{
                  backgroundColor: COLORS.gold,
                  color: COLORS.black,
                  borderColor: COLORS.gold,
                  "&:hover": {
                    backgroundColor: "#D8B66C",
                    borderColor: "#D8B66C",
                  },
                }}
              >
                {isSubmitting
                  ? "Saving..."
                  : todo
                    ? "Save Movie"
                    : "Add Movie"}
              </PrimaryButton>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddMovieForm;
