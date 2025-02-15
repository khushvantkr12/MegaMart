import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";

const stripePromise = loadStripe("pk_test_51Qo3RoPFIjP95w8RCYH0FKbCvTV9IEkhD4apEoKtKOqxOrZttr98E5AFoqKfFKZ9u4WLPdUrqymOy6ZP7nvAzn9k00OjmRcfrf");

const OrderSummary = () => {
    const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const {user}=useUserStore();

    const savings = subtotal - total;
    const formattedSubtotal = subtotal.toFixed(2);
    const formattedTotal = total.toFixed(2);
    const formattedSavings = savings.toFixed(2);

    const handlePayment = async () => {
		
        setLoading(true);
        try {
            const stripe = await stripePromise;

            // Step 1: Create Checkout Session
            const res = await axios.post("/payments/create-checkout-session", {
                products: cart,
                couponCode: coupon ? coupon.code : null,
            });

            const session = res.data;

            // Step 2: Redirect to Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (result.error) {
                console.error("Error:", result.error);
                toast.error("Payment failed. Please try again.");
            } else {
                // Step 3: Check Payment Status & Trigger Email
                setTimeout(() => {
                    checkPaymentStatus(session.id);
                }, 5000);
            }
        } catch (error) {
            console.error("Payment Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Verify Payment Success and Send Email
    const checkPaymentStatus = async (sessionId) => {
		try {
			const response = await axios.post("/payments/checkout-success", { sessionId });
	
			if (response.data.success) {
				const orderId = response.data.orderId;
	
				// ✅ Call the new API route for sending the email
				await axios.post("/payments/send-payment-success-email", {
					name: user.name, // Replace with actual user name
					email: user.email, // Replace with actual user email
					products: cart.map(p => ({
						id: p._id,
						name: p.name || "Unnamed Product",
						quantity: p.quantity,
						price: p.price,
						image: p.image || "https://via.placeholder.com/80"
					})),
					totalAmount: total,
					orderId,
				});
	
				//toast.success("Payment successful! Confirmation email sent.");
			}
		} catch (error) {
			console.error("Error verifying payment:", error);
			toast.error("Error processing payment confirmation.");
		}
	};
	
	

    return (
        <motion.div
            className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p className="text-xl font-semibold text-emerald-400">Order summary</p>

            <div className="space-y-4">
                <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-300">Original price</dt>
                        <dd className="text-base font-medium text-white">${formattedSubtotal}</dd>
                    </dl>

                    {savings > 0 && (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-300">Savings</dt>
                            <dd className="text-base font-medium text-emerald-400">-${formattedSavings}</dd>
                        </dl>
                    )}

                    {coupon && isCouponApplied && (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-300">Coupon ({coupon.code})</dt>
                            <dd className="text-base font-medium text-emerald-400">-{coupon.discountPercentage}%</dd>
                        </dl>
                    )}
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
                        <dt className="text-base font-bold text-white">Total</dt>
                        <dd className="text-base font-bold text-emerald-400">${formattedTotal}</dd>
                    </dl>
                </div>

                <motion.button
                    className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePayment}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        "Proceed to Checkout"
                    )}
                </motion.button>

                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-normal text-gray-400">or</span>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
                    >
                        Continue Shopping
                        <MoveRight size={16} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderSummary;
