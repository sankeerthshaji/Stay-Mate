import * as yup from "yup";

export const complaintSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf(
      ["Maintenance", "Security", "Cleanliness", "Others"],
      "Complaint Type is required"
    )
    .required("Complaint Type is required"),
  description: yup
    .string()
    .max(500, "Complaint Description should not exceed 500 characters")
    .required("Complaint Description is required"),
});
