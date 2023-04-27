import * as yup from "yup";

export const vacatingLetterSchema = yup.object().shape({
  departureDate: yup
    .date()
    .required("Departure date is required")
    .min(new Date(), "Departure date should be in the future"),

  reason: yup
    .string()
    .trim()
    .required("Reason is required")
    .max(500, "Reason should not exceed 500 characters"),
});
