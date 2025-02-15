import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession} from "../controllers/payment.controller.js";
import { sendPaymentSuccessEmailHandler } from "../controllers/email.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);
router.post("/send-payment-success-email", protectRoute, sendPaymentSuccessEmailHandler); 

export default router;
