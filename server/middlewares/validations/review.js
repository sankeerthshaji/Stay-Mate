const yup = require("yup");

const reviewSchema = yup.object().shape({
  rating: yup
    .number()
    .min(1, "Rating should be at least 1")
    .max(5, "Rating should be at most 5")
    .required("Rating is required"),
  body: yup
    .string()
    .max(500, "Review should not exceed 500 characters")
    .required("Review is required"),
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

const reviewValidationMiddleware = validateSchema(reviewSchema);

module.exports = reviewValidationMiddleware;
