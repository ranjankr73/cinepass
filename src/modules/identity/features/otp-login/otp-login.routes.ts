import { Router } from 'express';

import { asyncHandler } from '../../../../shared/middleware/async.middleware.js';
import { validate } from '../../../../shared/middleware/validate.middleware.js';
import { requestOtpSchema, verifyOtpSchema } from './otp-login.validation.js';
import {
  otpRequestRateLimiter,
  otpVerifyRateLimiter,
} from '../../../../shared/middleware/rate-limiters/otp-login.ratelimiter.js';
import { requestOTP, verifyOTP } from './otp-login.controller.js';

const router = Router();

// Request a login/registration OTP
router.post(
  '/otp/request',
  validate(requestOtpSchema),
  asyncHandler(otpRequestRateLimiter),
  asyncHandler(requestOTP),
);

// Verify OTP and authenticate the user
router.post(
  '/otp/verify',
  validate(verifyOtpSchema),
  asyncHandler(otpVerifyRateLimiter),
  asyncHandler(verifyOTP),
);

export default router;
