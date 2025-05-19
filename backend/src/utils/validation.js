import { body, validationResult } from 'express-validator';

export const validateRegisterInput = [
  body('name').trim().notEmpty().withMessage('Name is required'),

  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isAlphanumeric()
    .withMessage('Username must be alphanumeric'),

  body('mobile')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid mobile number'),

  body('address').trim().notEmpty().withMessage('Address is required'),

  body('email').trim().isEmail().withMessage('Invalid email'),
 
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const validateLoginInput = [
  body('email').trim().isEmail().withMessage('Invalid email'),

  body('password').trim().notEmpty().withMessage('Password is required'),
];

export const validateTodoInput = [
  body('title').trim().notEmpty().withMessage('Title is required'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
