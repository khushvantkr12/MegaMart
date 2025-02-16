

import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js"; // ✅ Import Product model
import { stripe } from "../lib/stripe.js";
import dotenv from "dotenv";
import { sendPaymentSuccessEmail } from "../mail/PaymentSuccessEmail.js";

dotenv.config();

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // Convert to cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		// ✅ Store only essential data in metadata (productId & quantity)
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `https://mega-mart-rho.vercel.app/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `https://mega-mart-rho.vercel.app/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
					}))
				),
			},
		});

		// ✅ Give user a new coupon if order total exceeds $200
		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
			if (existingOrder) {
				return res.status(200).json({
					success: true,
					message: "Order already exists, no duplicate creation.",
					orderId: existingOrder._id,
				});
			}

			// ✅ Retrieve only product IDs and quantities from metadata
			const productsMeta = JSON.parse(session.metadata.products);

			// ✅ Fetch full product details from DB
			const products = await Product.find({
				_id: { $in: productsMeta.map((p) => p.id) },
			});

			// ✅ Merge with quantity information
			const productsWithQuantity = products.map((product) => {
				const quantity = productsMeta.find((p) => p.id === product._id.toString()).quantity;
				return {
					id: product._id,
					name: product.name,
					quantity,
					price: product.price,
					image: product.image,
				};
			});

			const totalAmount = session.amount_total / 100;

			// ✅ Save new order in DB
			const newOrder = new Order({
				user: session.metadata.userId,
				products: productsWithQuantity.map((product) => ({
					product: product.id,
					name: product.name,
					quantity: product.quantity,
					price: product.price,
					image: product.image,
				})),
				totalAmount,
				stripeSessionId: sessionId,
			});

			await newOrder.save();

			// ✅ Send Payment Success Email
			const userEmail = req.user.email;
			await sendPaymentSuccessEmail(userEmail, req.user.name, productsWithQuantity, totalAmount, newOrder._id);

			res.status(200).json({
				success: true,
				message: "Payment successful, email sent.",
				orderId: newOrder._id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

// ✅ Stripe Coupon Creation
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});
	return coupon.id;
}

// ✅ Create a new user coupon after spending $200
async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();
	return newCoupon;
}
