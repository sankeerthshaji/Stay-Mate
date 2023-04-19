const yup = require("yup");

const leaveLetterSchema = yup.object().shape({
  startDate: yup
    .date()
    .required("Start date is required")
    .min(new Date(), "Start date should be in the future"),
  endDate: yup
    .date()
    .required("End date is required")
    .min(yup.ref("startDate"), "End date should be after start date"),
  comments: yup
    .string()
    .max(500, "Comments should not exceed 500 characters")
    .required("Comments are required"),
});

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body.values, { abortEarly: false });
    console.log("Validation successful");
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

const LeaveLetterValidationMiddleware = validateSchema(leaveLetterSchema);

module.exports = LeaveLetterValidationMiddleware;
