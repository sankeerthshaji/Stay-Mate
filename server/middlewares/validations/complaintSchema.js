const yup = require("yup");

const complaintSchema = yup.object().shape({
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

const validateSchema = (schema) => async (req, res, next) => {
    try {
      await schema.validate(req.body.values, { abortEarly: false });
      
      next();
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        return res.status(422).json({ errors });
      }
      res.status(400).json({ error: err.message });
    }
  };
  
  const ComplaintValidationMiddleware = validateSchema(complaintSchema);
  
  module.exports = ComplaintValidationMiddleware;
