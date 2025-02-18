🚀 # Megamart - MERN Stack eCommerce Platform

📝 ## Overview
Megamart is a full-stack eCommerce web application built using the **MERN stack** with additional integrations for authentication, payments, image storage, and email notifications. The platform offers robust admin and customer functionalities, ensuring a seamless shopping experience.

🛠️ ## Tech Stack
### Frontend:
- React.js
- Zustand (State Management)
- Tailwind CSS

### Backend:
- Node.js
- Express.js
- MongoDB
- Redis (for session management and caching)

### Additional Integrations:
- Cloudinary (for image storage)
- Stripe (for payment processing)
- Nodemailer (for email notifications)
- JWT (for authentication and authorization)

🌟 ## Key Features
👨‍💼 ### Admin Features:
- **Product Management**: Admins can **add**, **delete**, and **feature (star)** products to highlight them on the platform.
- **Analytics Dashboard**: Admins can track **total users, payments, revenue, and products** to monitor business performance and trends.

🛍️ ### Customer Features:
- **Product Browsing**: Customers can explore products categorized into different sections and view **featured products** marked by the admin.
- **Cart Section**: Customers can see **most bought products** as recommendations and apply **random discount coupons** for savings.
- **Secure Checkout**: Customers can securely **make payments via Stripe Payment Gateway**, ensuring a smooth and safe transaction experience.
- **Order Confirmation**: After a successful payment, customers receive an **automated email confirmation** with details of their purchase, including product names, quantity, and total amount paid.

⚡ ## Performance Enhancements
- **Optimized API design and MongoDB indexing** for faster product retrieval.
- **Redis caching** to improve authentication and session management.
- **Cloudinary integration** for efficient image storage and delivery.

💳 ## Test Payment Credentials

📩 **After successful payment, check your mail in the spam folder if you don't see the confirmation email!**
To test the payment feature, use the following test card details:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry Date**: Any future date
- **CVC**: Any 3-digit number

🛠️ ## Installation & Setup
### Prerequisites:
- Node.js
- MongoDB

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/megamart.git
   cd megamart
   ```
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
3. Set up environment variables (`.env` file for both frontend & backend):
4. Start the backend server:
   ```bash
   npm run server
   ```
5. Start the frontend:
   ```bash
   cd client
   npm start
   ```
6. Open the application in your browser at `http://localhost:3000`

📜 ## License
This project is open-source and available under the MIT License.

