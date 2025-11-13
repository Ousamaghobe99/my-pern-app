import express from 'express';
import AuthController from '../controllers/authController.js';
import { authenticateToken  } from '../middleware/auth.js';
import { loginValidation,
  registerValidation,
  changePasswordValidation,
  updateProfileValidation,
  handleValidationErrors,
  changePasswordFirstLoginValidation
 } from '../validators/authValidator.js';

const router = express.Router();

// Public routes
router.post('/login', 
  loginValidation, 
  handleValidationErrors, 
  AuthController.login
);
router.post('/change-password-first-login'
  , changePasswordFirstLoginValidation
  , handleValidationErrors
  , AuthController.changePasswordFirstLogin);


router.post('/register', 
  registerValidation, 
  handleValidationErrors, 
  AuthController.register
);

// Protected routes (require authentication)
router.use(authenticateToken);

router.get('/profile', AuthController.getProfile);

router.put('/profile', 
  updateProfileValidation, 
  handleValidationErrors, 
  AuthController.updateProfile
);

router.post('/change-password', 
  changePasswordValidation, 
  handleValidationErrors, 
  AuthController.changePassword
);

router.post('/logout', AuthController.logout);

router.get('/verify', AuthController.verifyToken);

export default router;

