import * as yup from "yup";

export const leaveLetterSchema = yup.object().shape({
  startDate: yup
    .date()
    .required("Start date is required")
    .min(new Date(), "Start date must be today or later"),
  endDate: yup
    .date()
    .required("End date is required")
    .min(yup.ref("startDate"), "End date must be after start date"),
  comments: yup
    .string()
    .max(500, "Comments should not exceed 500 characters")
    .required("Comments is required"),
});
