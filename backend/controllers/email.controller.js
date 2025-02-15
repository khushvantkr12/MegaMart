import { sendPaymentSuccessEmail } from "../mail/PaymentSuccessEmail.js";

export const sendPaymentSuccessEmailHandler = async (req, res) => {
    try {
        const { email, name, products, totalAmount, orderId } = req.body;

        if (!email || !name || !products || !totalAmount || !orderId) {
            return res.status(400).json({ success: false, message: "Missing required parameters" });
        }

        // ✅ Send email
        await sendPaymentSuccessEmail(email, name, products, totalAmount, orderId);

        res.status(200).json({ success: true, message: "Payment success email sent successfully" });
    } catch (error) {
        console.error("Error sending payment success email:", error);
        res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
    }
};
