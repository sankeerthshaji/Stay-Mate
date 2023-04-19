import * as yup from "yup";

export const editReviewSchema = yup.object().shape({
  editRating: yup
    .number()
    .min(1, "Rating should be at least 1")
    .max(5, "Rating should be at most 5")
    .required("Rating is required"),
  editBody: yup
    .string()
    .max(500, "Review should not exceed 500 characters")
    .required("Review is required"),
});
