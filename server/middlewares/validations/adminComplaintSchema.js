const yup = require('yup');

const adminComplaintSchema = yup.object().shape({
    status: yup.string()
        .oneOf(['New', 'In Progress', 'Resolved'], 'Complaint Status is required')
        .required('Complaint Status is required'),
    adminResponse: yup.string()
        .max(500, 'Response should not exceed 500 characters')
        .required('Response is required'),
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
  
  const AdminComplaintValidationMiddleware = validateSchema(adminComplaintSchema);
  
  module.exports = AdminComplaintValidationMiddleware;
