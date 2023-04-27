import * as Yup from "yup";

export const adminComplaintSchema = Yup.object().shape({
  status: Yup.string()
    .oneOf(["New", "In Progress", "Resolved"], "Complaint Status is required")
    .required("Complaint Status is required"),
  adminResponse: Yup.string()
    .trim()
    .max(500, "Admin Response should not exceed 500 characters")
    .required("Admin Response is required"),
});
