const yup = require("yup");

const vacatingLetterSchema = yup.object().shape({
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

const VacatingLetterValidationMiddleware = validateSchema(vacatingLetterSchema);

module.exports = VacatingLetterValidationMiddleware;
