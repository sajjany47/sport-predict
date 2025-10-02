export const getPaymentDetails = (data: any, paymentMode: string) => {
  let details = "";

  if (paymentMode === "UPI") {
    details = `
      <p><strong>Method:</strong> UPI</p>
      <p><strong>UPI ID:</strong> ${data.upi}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Note:</strong> ${data.note}</p>
    `;
  } else if (paymentMode === "NETBANKING") {
    details = `
      <p><strong>Method:</strong> Bank Transfer</p>
      <p><strong>Bank Name:</strong> ${data.bankName}</p>
      <p><strong>Account Number:</strong> ${data.accountNumber}</p>
      <p><strong>IFSC Code:</strong> ${data.ifscCode}</p>
      <p><strong>Account Holder:</strong> ${data.accountHolder}</p>
      <p><strong>Branch:</strong> ${data.branch}</p>
    `;
  } else if (paymentMode === "QRCODE") {
    details = `
      <p><strong>Method:</strong> QR Code</p>
      <p><strong>UPI ID:</strong> ${data.upiId}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <img src="${data.url}" alt="QR Code" style="width:150px; margin-top:10px;" />
    `;
  } else {
    details = `<p><strong>Method:</strong> Unknown</p>`;
  }

  return details;
};

export const getPaymentFailedModeDetails = (data: any, paymentMode: string) => {
  let details = "";

  if (paymentMode === "UPI") {
    details = `
                <div class="detail-row">
                    <div class="detail-label">Payment Method:</div>
                    <div class="detail-value"> ${paymentMode}</div>
                </div>
                 <div class="detail-row">
                    <div class="detail-label">UPI ID:</div>
                    <div class="detail-value"> ${data.upi}</div>
                </div>
                 <div class="detail-row">
                    <div class="detail-label">Name:</div>
                    <div class="detail-value"> ${data.name}</div>
                </div>
                 <div class="detail-row">
                    <div class="detail-label">Note:</div>
                    <div class="detail-value"> ${data.note}</div>
                </div>
    `;
  } else if (paymentMode === "NETBANKING") {
    details = `
                 <div class="detail-row">
                    <div class="detail-label">Payment Method:</div>
                    <div class="detail-value"> ${paymentMode}</div>
                </div>
                 <div class="detail-row">
                    <div class="detail-label">Bank Name:</div>
                    <div class="detail-value"> ${data.bankName}</div>
                </div>
                 <div class="detail-row">
                    <div class="detail-label">Account Number:</div>
                    <div class="detail-value"> ${data.accountNumber}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">IFSC Code:</div>
                    <div class="detail-value"> ${data.ifscCode}</div>
                </div>
                 <div class="detail-row">
                    <div class="detail-label">Account Holder:</div>
                    <div class="detail-value"> ${data.accountHolder}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Branch:</div>
                    <div class="detail-value"> ${data.Branch}</div>
                </div>
      
    `;
  } else if (paymentMode === "QRCODE") {
    details = `
                <div class="detail-row">
                    <div class="detail-label">Payment Method:</div>
                    <div class="detail-value"> ${paymentMode}</div>
                </div>
                 <div class="detail-row">
                    <div class="detail-label">UPI ID:</div>
                    <div class="detail-value"> ${data.upiId}</div>
                </div>
                 <div class="detail-row">
                    <div class="detail-label">Name:</div>
                    <div class="detail-value"> ${data.name}</div>
                </div>
                 <div class="detail-row">
                    <div class="detail-label">QR Code:</div>
                    <div class="detail-value"><img src="${data.url}" alt="QR Code" style="width:150px; margin-top:10px;" /></div>
                </div>
      
    `;
  } else {
    details = `<p><strong>Method:</strong> Unknown</p>`;
  }

  return details;
};
export const UserPaymentConfirmationTemp = (data: any) => {
  let temp = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Submitted - SportPredict</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            color: #555;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(to right, #1a2a6c, #2c3e50);
            padding: 30px 20px;
            color: white;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .header h1 span {
            color: #fdbb2d;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .icon-container {
            text-align: center;
            margin: 20px 0;
        }
        .icon-container img {
            max-width: 150px;
            border-radius: 8px;
        }
        .details {
            background-color: #f0f4ff;
            border: 1px dashed #1a2a6c;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
        .payment-method {
            background-color: #f9f9f9;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #4cd964;
        }
        .button {
            display: block;
            background-color: #1a2a6c;
            color: white;
            text-decoration: none;
            padding: 14px 30px;
            border-radius: 4px;
            font-weight: bold;
            text-align: center;
            margin: 25px 0;
        }
        .footer {
            background-color: #2c3e50;
            padding: 30px 20px;
            color: white;
            text-align: center;
        }
        .footer a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            margin: 0 10px;
        }
        .status-pending {
            display: inline-block;
            background-color: #ff9800;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span>Sport</span>Predict</h1>
            <p>The future of sports predictions</p>
        </div>
        
        <div class="content">
            <div class="icon-container">
                <img src="https://media.istockphoto.com/id/1360536098/vector/payment-date-of-recurring-tax-money-scheduled-on-calendar-icon-success-bill-pay-day-salary.jpg?s=612x612&w=0&k=20&c=G9osXxvAeoIU4DbpMDSQIO6342T7Od3OuR7geqw3GFs=" alt="Payment Submitted">
            </div>
            
            <h2 style="text-align: center; color: #2c3e50;">Payment Details Submitted <span class="status-pending">Pending Approval</span></h2>
            
            <p>Hello <strong>${data.username}</strong>,</p>
            <p>Thank you for your subscription purchase! We have successfully received your payment details.</p>
            
            <div class="details">
                <p><strong>Subscription Plan:</strong> ${
                  data.subscriptionPlan
                }</p>
                <p><strong>Amount:</strong> ₹${data.price}</p>
                <p><strong>Transaction ID:</strong> ${data.paymentId}</p>
                <p><strong>Submitted On:</strong> ${data.paymentDate}</p>
            </div>
            
            <div class="payment-method">
                <h3 style="color: #2c3e50; margin-top: 0;">Payment Method Details</h3>
                <p><strong>Method:</strong> ${data.paymentMode}/p>
                ${getPaymentDetails(data.paymentModeDetails, data.paymentMode)}
            </div>
            
            <p>Your payment is currently being processed and is awaiting approval. You will receive another email once your subscription is activated.</p>
            
            <a href="${
              process.env.NEXT_PUBLIC_API_URL
            }" class="button">View Your Account</a>
            
            <p>If you have any questions, please contact our support team.</p>
            
            <p>Best regards,<br>The SportPredict Team</p>
        </div>
        
        <div class="footer">
            <p>
                <a href="#">Home</a> • 
                <a href="#">About</a> • 
                <a href="#">Privacy Policy</a> • 
                <a href="#">Terms of Service</a> • 
                <a href="#">Contact Us</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px; color: rgba(255, 255, 255, 0.5);">© 2023 SportPredict. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

  return temp;
};

export const AdminPaymentConfirmationTemp = (data: any) => {
  let temp = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Payment Submission - SportPredict</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            color: #555;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(to right, #1a2a6c, #2c3e50);
            padding: 30px 20px;
            color: white;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .header h1 span {
            color: #fdbb2d;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .icon-container {
            text-align: center;
            margin: 20px 0;
        }
        .icon-container img {
            max-width: 150px;
            border-radius: 8px;
        }
        .details {
            background-color: #fff5f5;
            border-left: 4px solid #b21f1f;
            padding: 15px;
            margin: 20px 0;
        }
        .payment-method {
            background-color: #f3f9ff;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #1a2a6c;
        }
        .button {
            display: block;
            background-color: #1a2a6c;
            color: white;
            text-decoration: none;
            padding: 14px 30px;
            border-radius: 4px;
            font-weight: bold;
            text-align: center;
            margin: 25px 0;
        }
        .footer {
            background-color: #2c3e50;
            padding: 30px 20px;
            color: white;
            text-align: center;
        }
        .footer a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            margin: 0 10px;
        }
        .status-new {
            display: inline-block;
            background-color: #ff9800;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span>Sport</span>Predict</h1>
            <p>The future of sports predictions</p>
        </div>
        
        <div class="content">
            <div class="icon-container">
                <img src="https://media.istockphoto.com/id/1360536098/vector/payment-date-of-recurring-tax-money-scheduled-on-calendar-icon-success-bill-pay-day-salary.jpg?s=612x612&w=0&k=20&c=G9osXxvAeoIU4DbpMDSQIO6342T7Od3OuR7geqw3GFs=" alt="New Payment">
            </div>
            
            <h2 style="text-align: center; color: #2c3e50;">New Payment Submission <span class="status-new">Action Required</span></h2>
            
            <p>Hello Admin,</p>
            <p>A user has submitted payment details for a subscription plan.</p>
            
            <div class="details">
                <p><strong>Username:</strong> ${data.username}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Subscription Plan:</strong> ${
                  data.subscriptionPlan
                }</p>
                <p><strong>Amount:</strong> ₹${data.price}</p>
                <p><strong>Transaction ID:</strong> ${data.paymentId}</p>
                <p><strong>Submitted On:</strong> ${data.paymentDate}</p>
            </div>
            
            <div class="payment-method">
                <h3 style="color: #2c3e50; margin-top: 0;">Payment Method Details</h3>
                 <p><strong>Method:</strong> ${data.paymentMode}</p>
                ${getPaymentDetails(data.paymentModeDetails, data.paymentMode)}
            </div>
            
            <p>Please review and approve this payment to activate the user's subscription.</p>
            
            <a href="${
              process.env.NEXT_PUBLIC_API_URL
            }" class="button">Review Payment</a>
            
            <p>Thank you,<br>SportPredict System</p>
        </div>
        
        <div class="footer">
            <p>
                <a href="#">Admin Portal</a> • 
                <a href="#">User Management</a> • 
                <a href="#">Payment Review</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px; color: rgba(255, 255, 255, 0.5);">© 2023 SportPredict. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

  return temp;
};

// Payment Verified Email Template Function
export const PaymentVerifiedTem = (data: any) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Verified - SportPredict</title>
     <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        .container {
            max-width: 650px;
            width: 100%;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        
        .header {
            background: linear-gradient(to right, #1a2a6c, #2c3e50);
            padding: 30px;
            color: white;
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header h1 span {
            color: #fdbb2d;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .icon-container {
            text-align: center;
            margin: 20px 0;
        }
        
        .icon-container img {
            max-width: 180px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .status-badge {
            display: inline-block;
            background: #4cd964;
            color: white;
            padding: 8px 16px;
            border-radius: 50px;
            font-weight: bold;
            margin-left: 10px;
            font-size: 14px;
        }
        
        .details-card {
            background: #f0f4ff;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
            border: 1px dashed #1a2a6c;
        }
        
        .details-card h3 {
            color: #1a2a6c;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #d6e0ff;
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 12px;
        }
        
        .detail-label {
            flex: 1;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .detail-value {
            flex: 2;
            color: #555;
        }
        
        .button {
            display: block;
            background: #1a2a6c;
            color: white;
            text-align: center;
            padding: 16px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin: 30px 0;
            transition: all 0.3s ease;
        }
        
        .button:hover {
            background: #2c3e50;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .footer {
            background: #2c3e50;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }
        
        .footer-links a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            margin: 0 12px;
            font-size: 14px;
            transition: color 0.3s;
        }
        
        .footer-links a:hover {
            color: #fdbb2d;
        }
        
        .copyright {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            margin-top: 10px;
        }
        
        .highlight {
            color: #1a2a6c;
            font-weight: 600;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 25px;
            }
            
            .detail-row {
                flex-direction: column;
                margin-bottom: 15px;
            }
            
            .detail-label {
                margin-bottom: 5px;
            }
            
            .footer-links {
                flex-direction: column;
                gap: 10px;
            }
            
            .footer-links a {
                margin: 5px 0;
            }
        }

    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span>Sport</span>Predict</h1>
            <p>The future of sports predictions</p>
        </div>
        
        <div class="content">
            <div class="icon-container">
                <img src="https://cdn3d.iconscout.com/3d/premium/thumb/payment-success-3d-icon-png-download-8662347.png" alt="Payment Verified">
            </div>
            
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">
                Payment Verified Successfully <span class="status-badge">COMPLETED</span>
            </h2>
            
            <p>Hello <strong>${data.username}</strong>,</p>
            <p>We're pleased to inform you that your payment has been successfully verified and your subscription is now active.</p>
            
            <div class="details-card">
                <h3>Subscription Details</h3>
                
                <div class="detail-row">
                    <div class="detail-label">Subscription Plan:</div>
                    <div class="detail-value">${data.subscriptionPlan}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Amount Paid:</div>
                    <div class="detail-value">${data.price}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Transaction ID:</div>
                    <div class="detail-value">${data.paymentId}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Payment Method:</div>
                    <div class="detail-value">${data.paymentMode}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Verification Date:</div>
                    <div class="detail-value">${data.verificationDate}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Subscription Valid Until:</div>
                    <div class="detail-value">${data.validUntil}</div>
                </div>
            </div>
            
            <p>Your subscription is now active and you have full access to all Premium features. Thank you for choosing SportPredict!</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">Access Your Premium Account</a>
            
            <p>If you have any questions about your subscription or need assistance, please contact our support team.</p>
            
            <p>Best regards,<br><strong>The SportPredict Team</strong></p>
        </div>
        
        <div class="footer">
            <div class="footer-links">
                <a href="#">Home</a>
                <a href="#">About Us</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Support</a>
            </div>
            <p class="copyright">© 2023 SportPredict. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

export const PaymentFailedTem = (data: any) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Failed - SportPredict</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            padding: 20px;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        .container {
            max-width: 650px;
            width: 100%;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        
        .header {
            background: linear-gradient(to right, #1a2a6c, #2c3e50);
            padding: 30px;
            color: white;
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header h1 span {
            color: #fdbb2d;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .icon-container {
            text-align: center;
            margin: 20px 0;
        }
        
        .icon-container img {
            max-width: 180px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .status-badge {
            display: inline-block;
            background: #e53e3e;
            color: white;
            padding: 8px 16px;
            border-radius: 50px;
            font-weight: bold;
            margin-left: 10px;
            font-size: 14px;
        }
        
        .error-card {
            background: #fff5f5;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
            border: 1px dashed #e53e3e;
        }
        
        .error-card h3 {
            color: #c53030;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #fed7d7;
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 12px;
        }
        
        .detail-label {
            flex: 1;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .detail-value {
            flex: 2;
            color: #555;
        }
        
        .reason-box {
            background: white;
            border-left: 4px solid #e53e3e;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        
        .button {
            display: block;
            background: #1a2a6c;
            color: white;
            text-align: center;
            padding: 16px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin: 30px 0;
            transition: all 0.3s ease;
        }
        
        .button:hover {
            background: #2c3e50;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .support-note {
            background: #f0f4ff;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #1a2a6c;
        }
        
        .footer {
            background: #2c3e50;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }
        
        .footer-links a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            margin: 0 12px;
            font-size: 14px;
            transition: color 0.3s;
        }
        
        .footer-links a:hover {
            color: #fdbb2d;
        }
        
        .copyright {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            margin-top: 10px;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 25px;
            }
            
            .detail-row {
                flex-direction: column;
                margin-bottom: 15px;
            }
            
            .detail-label {
                margin-bottom: 5px;
            }
            
            .footer-links {
                flex-direction: column;
                gap: 10px;
            }
            
            .footer-links a {
                margin: 5px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span>Sport</span>Predict</h1>
            <p>The future of sports predictions</p>
        </div>
        
        <div class="content">
            <div class="icon-container">
                <img src="https://static.vecteezy.com/system/resources/previews/004/968/453/non_2x/failed-to-make-payment-by-credit-card-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-vector.jpg" alt="Transaction Failed">
            </div>
            
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">
                Transaction Failed <span class="status-badge">DECLINED</span>
            </h2>
            
            <p>Hello <strong>${data.username}</strong>,</p>
            <p>We're sorry to inform you that your recent payment attempt was unsuccessful. Please review the details below.</p>
            
            <div class="error-card">
                <h3>Transaction Details</h3>
                
                <div class="detail-row">
                    <div class="detail-label">Subscription Plan:</div>
                    <div class="detail-value">${data.subscriptionPlan}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Amount:</div>
                    <div class="detail-value">₹${data.price}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Payment Date:</div>
                    <div class="detail-value">${data.paymentDate}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Transaction ID:</div>
                    <div class="detail-value">${data.paymentId}</div>
                </div>
                ${getPaymentFailedModeDetails(
                  data.paymentModeDetails,
                  data.paymentMode
                )}
                
                
                <div class="detail-row">
                    <div class="detail-label">Date & Time:</div>
                    <div class="detail-value">${data.verificationDate}</div>
                </div>
            </div>
            
            <div class="reason-box">
                <h3 style="color: #c53030; margin-top: 0;">Failure Reason</h3>
                <p><strong>${data.reason}</strong> </p>
            </div>
            
            <div class="support-note">
                <h3 style="color: #1a2a6c; margin-top: 0;">Need Help?</h3>
                <p>If you continue to experience issues with your payment, please contact our support team for assistance. Common solutions include:</p>
                <ul style="margin: 10px 0 10px 20px;">
                    <li>Verifying your payment details</li>
                    <li>Ensuring sufficient funds are available</li>
                    <li>Contacting your bank or payment provider</li>
                    <li>Trying a different payment method</li>
                </ul>
            </div>
            
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL
            }/payment-retry" class="button">Try Payment Again</a>
            
            <p>If you believe this is an error or need further assistance, please contact our support team.</p>
            
            <p>Best regards,<br><strong>The SportPredict Team</strong></p>
        </div>
        
        <div class="footer">
            <div class="footer-links">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}">Home</a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/about">About Us</a>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }/privacy">Privacy Policy</a>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }/terms">Terms of Service</a>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }/support">Contact Support</a>
            </div>
            <p class="copyright">© 2023 SportPredict. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};
