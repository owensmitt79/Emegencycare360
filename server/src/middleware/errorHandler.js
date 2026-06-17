export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(e => ({ field: e.path, message: e.message })),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Duplicate entry',
      field: err.errors[0]?.path,
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};
