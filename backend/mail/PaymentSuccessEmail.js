import { mailSender } from "../utils/mailSender.js";

export const sendPaymentSuccessEmail = async (email, name, products, totalAmount, orderId) => {
    const productList = products.map(product => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                <img src="${product.image || 'https://via.placeholder.com/80'}" 
                     alt="${product.name || 'Product'}" 
                     width="80" height="80" style="border-radius: 5px;">
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                <strong>${product.name || 'Unnamed Product'}</strong>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                x${product.quantity}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                $${(product.price).toFixed(2)}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                $${(product.price * product.quantity).toFixed(2)}
            </td>
        </tr>
    `).join("");

    const emailContent = `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Payment Confirmation</title>
          <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
              .container { max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 5px; }
              .logo {
                  max-width: 200px;
                  margin-bottom: 20px;
              }
              .header { font-size: 20px; font-weight: bold; color: #4CAF50; }
              .highlight { font-weight: bold; }
              .support { font-size: 14px; color: #999; margin-top: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #4CAF50; color: white; }
          </style>
      </head>
      <body>
          <div class="container">
           <a href="https://mega-mart-iota.vercel.app/"><img class="logo" src="https://i.ibb.co/23FgWT8n/Mega-Mart-logo-cleaned-1-removebg-preview.png"
                      alt="logo"></a>
              <div class="header">Products Payment Confirmation</div>
              <p>Dear <b>${name}</b>,</p>
              <p>Thank you for your purchase. Your order has been confirmed!</p>
              
              <table>
                  <tr>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>TotalPrice</th>
                  </tr>
                  ${productList}
              </table>

              <p><b>Total Paid After Discount(10%) if applicable:</b> <span class="highlight">$${totalAmount.toFixed(2)}</span></p>
              <p><b>Order ID:</b> <b>${orderId}</b></p>
              
              <div class="support">
                  If you have any questions, contact us at 
                  <a href="mailto:support@MegaMart.com">support@MegaMart.com</a>.
              </div>
          </div>
      </body>
      </html>`;

    await mailSender(email, "Payment Successful - Your Order Confirmation", emailContent);
};
