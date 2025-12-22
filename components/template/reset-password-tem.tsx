export const ResetPasswordTem = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sportpredict.com";
  const supportEmail =
    process.env.NEXT_PUBLIC_EMAIL || "support@sportpredict.com";
  const supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (888) 123-4567";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Password Reset OTP - SportPredict</title>
    
    <style>
        /* Reset and Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
            color: #333333;
        }
        
        .wrapper {
            width: 100%;
            max-width: 600px;
            background: #ffffff;
            margin: 0 auto;
            border-radius: 12px;
            border: 1px solid #e0e0e0;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .center-table {
            margin-left: auto;
            margin-right: auto;
        }
        
        /* PERFECT HEADER - Same as AdminFreeCreditsEmail */
        .header {
            background: linear-gradient(135deg, #1a2a6c 0%, #2c3e50 100%);
            padding: 32px 24px;
            text-align: center;
            color: #ffffff;
        }
        
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 8px 0;
            letter-spacing: 0.5px;
        }
        
        .header span {
            color: #fdbb2d;
            font-weight: 800;
        }
        
        .header p {
            font-size: 15px;
            opacity: 0.9;
            margin: 0;
            font-weight: 300;
        }
        
        /* OTP Display */
        .otp-display {
            font-size: 40px;
            font-weight: 700;
            color: #1a2a6c;
            letter-spacing: 8px;
            font-family: 'Courier New', Courier, monospace;
            padding: 20px;
            background: #f8f9fa;
            border: 2px dashed #1a2a6c;
            border-radius: 10px;
            display: inline-block;
            text-align: center;
            margin: 15px 0;
        }
        
        /* Security Icon */
        .security-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        
        .security-icon img {
            width: 50px;
            height: 50px;
            filter: brightness(0) invert(1);
        }
        
        /* Security Notice */
        .security-notice {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        /* Button Styles */
        .button-primary {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #1a2a6c 0%, #2c3e50 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            min-width: 200px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(26, 42, 108, 0.3);
        }
        
        /* Footer */
        .footer {
            background: #1f2937;
            padding: 32px 24px;
            text-align: center;
            color: #e5e7eb;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 24px;
        }
        
        .footer-links a {
            color: #e5e7eb;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: #fdbb2d;
        }
        
        .footer-copyright {
            font-size: 13px;
            color: #9ca3af;
            margin-top: 16px;
            line-height: 1.5;
        }
        
        /* Responsive Styles */
        @media only screen and (max-width: 600px) {
            body { 
                padding: 12px; 
            }
            
            .wrapper { 
                width: 100% !important;
                border-radius: 8px;
            }
            
            .header {
                padding: 24px 20px;
            }
            
            .header h1 {
                font-size: 28px;
            }
            
            .otp-display {
                font-size: 32px;
                letter-spacing: 6px;
                padding: 16px;
            }
            
            .security-icon {
                width: 80px;
                height: 80px;
            }
            
            .security-icon img {
                width: 40px;
                height: 40px;
            }
            
            .button-primary {
                width: 100%;
                max-width: 100%;
                margin: 8px 0;
            }
            
            .footer-links {
                flex-direction: column;
                gap: 12px;
            }
        }
    </style>
</head>

<body>
    <table class="wrapper" cellpadding="0" cellspacing="0" width="100%">

        <!-- PERFECT HEADER - Same as AdminFreeCreditsEmail -->
        <tr>
            <td class="header">
                <h1><span>Sport</span>Predict</h1>
                <p>The future of sports predictions</p>
            </td>
        </tr>

        <!-- BODY CONTENT -->
        <tr>
            <td style="padding: 40px 32px;">

                <!-- Security Icon -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div class="security-icon">
                        <img src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png" alt="Security">
                    </div>
                    <h2 style="font-size: 24px; color: #1f2937; margin: 15px 0 10px;">
                        Verify Your Identity
                    </h2>
                    <p style="color: #6b7280; font-size: 16px;">
                        Secure password reset request
                    </p>
                </div>

                <!-- Greeting -->
                <h2 style="font-size: 22px; margin-bottom: 20px; color: #1f2937;">
                    Hello ${data.username || "User"},
                </h2>

                <!-- Message -->
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 20px;">
                    You've requested to reset your SportPredict password. Please use the One-Time Password (OTP) below to verify your identity and complete the password reset process.
                </p>

                <!-- OTP CONTAINER -->
                <div style="text-align: center; margin: 30px 0;">
                    <div style="color: #6b7280; font-size: 14px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
                        Your One-Time Password
                    </div>
                    
                    <div class="otp-display">
                        ${data.otp || "123456"}
                    </div>
                    
                    <div style="font-size: 14px; color: #6b7280; margin-top: 16px;">
                        Valid for <span style="color: #dc2626; font-weight: 700;">10 minutes</span>
                    </div>
                </div>

                <!-- CTA BUTTON -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${appUrl}/reset-password?otp=${
    data.otp || "123456"
  }"
                       class="button-primary">
                        🔐 Reset Password
                    </a>
                </div>

                <!-- SECURITY NOTICE -->
                <div class="security-notice">
                    <h4 style="color: #dc2626; margin: 0 0 12px; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        🔒 Security Reminder
                    </h4>
                    <p style="font-size: 14px; color: #7f1d1d; line-height: 1.6; margin: 0;">
                        For your security, please do not share this OTP with anyone. SportPredict will never ask you for your password or OTP via email, phone, or text message.
                        If you didn't request this password reset, please ignore this email and contact support immediately.
                    </p>
                </div>

                <!-- TIPS SECTION -->
                <div style="background: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 8px; padding: 20px; margin: 25px 0;">
                    <h4 style="color: #0369a1; margin: 0 0 12px; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        💡 Quick Instructions
                    </h4>
                    <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
                        <li style="margin-bottom: 8px;">Enter this OTP on the password reset page</li>
                        <li style="margin-bottom: 8px;">Create a strong, unique password</li>
                        <li>The OTP expires in 10 minutes - use it quickly!</li>
                    </ul>
                </div>

                <!-- SUPPORT SECTION -->
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 15px; color: #4b5563; margin-bottom: 16px;">
                        Didn't request this password reset? Contact our support team immediately!
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin: 20px 0;">
                        <div style="display: flex; align-items: center; gap: 8px; color: #374151;">
                            <span>📧</span>
                            <a href="mailto:${supportEmail}" style="color: #667eea; text-decoration: none;">
                                ${supportEmail}
                            </a>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; color: #374151;">
                            <span>📱</span>
                            <span>${supportPhone}</span>
                        </div>
                    </div>
                </div>

                <!-- Closing -->
                <p style="margin-top: 32px; font-size: 16px; color: #1f2937;">
                    Stay secure!<br />
                    <strong style="color: #1a2a6c;">The SportPredict Security Team</strong>
                </p>

            </td>
        </tr>

        <!-- FOOTER - Same as AdminFreeCreditsEmail -->
        <tr>
            <td class="footer">
                <div style="font-size: 22px; font-weight: bold; color: white; margin-bottom: 16px;">
                    SportPredict
                </div>
                
                <p style="margin: 20px 0; line-height: 1.8; color: #e5e7eb;">
                    📍 Predict. Win. Celebrate.<br />
                    📧 ${supportEmail}<br />
                    📞 ${supportPhone}
                </p>
                
                <div class="footer-links">
                    <a href="${appUrl}">Home</a>
                    <a href="${appUrl}/matches">Matches</a>
                    <a href="${appUrl}/leaderboard">Leaderboard</a>
                    <a href="${appUrl}/privacy">Privacy</a>
                    <a href="${appUrl}/terms">Terms</a>
                    <a href="${appUrl}/support">Support</a>
                </div>
                
                <div class="footer-copyright">
                    © ${new Date().getFullYear()} SportPredict. All rights reserved.<br />
                    This is an automated security email. Please do not reply to this message.
                </div>
            </td>
        </tr>

    </table>
</body>
</html>`;
};

export const ResetPasswordSuccessTem = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sportpredict.com";
  const supportEmail =
    process.env.NEXT_PUBLIC_EMAIL || "support@sportpredict.com";
  const supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (888) 123-4567";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Password Reset Successful - SportPredict</title>
    
    <style>
        /* Reset and Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
            color: #333333;
        }
        
        .wrapper {
            width: 100%;
            max-width: 600px;
            background: #ffffff;
            margin: 0 auto;
            border-radius: 12px;
            border: 1px solid #e0e0e0;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .center-table {
            margin-left: auto;
            margin-right: auto;
        }
        
        /* PERFECT HEADER - Same as AdminFreeCreditsEmail */
        .header {
            background: linear-gradient(135deg, #1a2a6c 0%, #2c3e50 100%);
            padding: 32px 24px;
            text-align: center;
            color: #ffffff;
        }
        
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 8px 0;
            letter-spacing: 0.5px;
        }
        
        .header span {
            color: #fdbb2d;
            font-weight: 800;
        }
        
        .header p {
            font-size: 15px;
            opacity: 0.9;
            margin: 0;
            font-weight: 300;
        }
        
        /* Success Icon */
        .success-icon {
            width: 120px;
            height: 120px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
        }
        
        .success-icon img {
            width: 60px;
            height: 60px;
            filter: brightness(0) invert(1);
        }
        
        /* Success Badge */
        .success-badge {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border-radius: 50px;
            padding: 8px 24px;
            display: inline-block;
            font-weight: bold;
            font-size: 14px;
            margin: 10px 0;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* Security Tips */
        .security-tips {
            background: #fef3c7;
            border: 1px solid #fde68a;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        /* Account Info */
        .account-info {
            background: #f8fafc;
            border: 1px dashed #1a2a6c;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 20px 0;
        }
        
        /* Button Styles */
        .button-primary {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #1a2a6c 0%, #2c3e50 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            min-width: 200px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(26, 42, 108, 0.3);
        }
        
        .button-secondary {
            display: inline-block;
            padding: 14px 32px;
            background: white;
            color: #1a2a6c !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            min-width: 200px;
            border: 2px solid #1a2a6c;
            transition: all 0.3s ease;
        }
        
        /* Footer */
        .footer {
            background: #1f2937;
            padding: 32px 24px;
            text-align: center;
            color: #e5e7eb;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 24px;
        }
        
        .footer-links a {
            color: #e5e7eb;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: #fdbb2d;
        }
        
        .footer-copyright {
            font-size: 13px;
            color: #9ca3af;
            margin-top: 16px;
            line-height: 1.5;
        }
        
        /* Responsive Styles */
        @media only screen and (max-width: 600px) {
            body { 
                padding: 12px; 
            }
            
            .wrapper { 
                width: 100% !important;
                border-radius: 8px;
            }
            
            .header {
                padding: 24px 20px;
            }
            
            .header h1 {
                font-size: 28px;
            }
            
            .success-icon {
                width: 100px;
                height: 100px;
            }
            
            .success-icon img {
                width: 50px;
                height: 50px;
            }
            
            .button-primary,
            .button-secondary {
                width: 100%;
                max-width: 100%;
                margin: 8px 0;
            }
            
            .footer-links {
                flex-direction: column;
                gap: 12px;
            }
        }
    </style>
</head>

<body>
    <table class="wrapper" cellpadding="0" cellspacing="0" width="100%">

        <!-- PERFECT HEADER - Same as AdminFreeCreditsEmail -->
        <tr>
            <td class="header">
                <h1><span>Sport</span>Predict</h1>
                <p>The future of sports predictions</p>
            </td>
        </tr>

        <!-- BODY CONTENT -->
        <tr>
            <td style="padding: 40px 32px;">

                <!-- Success Icon -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div class="success-icon">
                        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Success">
                    </div>
                    <div class="success-badge">
                        ✅ Password Reset Successful
                    </div>
                    <h2 style="font-size: 24px; color: #1f2937; margin: 15px 0 10px;">
                        Your Account is Now Secure
                    </h2>
                    <p style="color: #6b7280; font-size: 16px;">
                        You can now access your account with your new password
                    </p>
                </div>

                <!-- Greeting -->
                <h2 style="font-size: 22px; margin-bottom: 20px; color: #1f2937;">
                    Hello ${data.username || "User"},
                </h2>

                <!-- Message -->
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 20px;">
                    Your SportPredict password has been successfully reset. You can now access your account using your new password.
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 25px;">
                    If you did not initiate this password reset, please contact our support team immediately to secure your account.
                </p>

                <!-- Account Info -->
                <div class="account-info">
                    <div style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Account Email
                    </div>
                    <div style="font-size: 16px; font-weight: 600; color: #1a2a6c;">
                        ${data.email}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${appUrl}/login" 
                       class="button-primary"
                       style="margin: 0 8px 12px;">
                        🔐 Log In to Your Account
                    </a>
                    <a href="${appUrl}/dashboard" 
                       class="button-secondary"
                       style="margin: 0 8px 12px;">
                        📊 Go to Dashboard
                    </a>
                </div>

                <!-- SECURITY TIPS -->
                <div class="security-tips">
                    <h4 style="color: #92400e; margin: 0 0 16px; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        🔒 Security Tips for Your Account
                    </h4>
                    <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                        <li style="margin-bottom: 10px; line-height: 1.5;">
                            <strong>Use a unique password:</strong> Don't reuse passwords from other sites
                        </li>
                        <li style="margin-bottom: 10px; line-height: 1.5;">
                            <strong>Consider two-factor authentication:</strong> Add an extra layer of security
                        </li>
                        <li style="margin-bottom: 10px; line-height: 1.5;">
                            <strong>Avoid public computers:</strong> Use your personal device for account access
                        </li>
                        <li style="margin-bottom: 10px; line-height: 1.5;">
                            <strong>Never share credentials:</strong> Keep your login information private
                        </li>
                        <li style="line-height: 1.5;">
                            <strong>Update regularly:</strong> Change your password periodically for better security
                        </li>
                    </ul>
                </div>

                <!-- Important Notice -->
                <div style="background: #dbeafe; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0;">
                    <h4 style="color: #1e40af; margin: 0 0 12px; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        ℹ️ Important Information
                    </h4>
                    <p style="font-size: 14px; color: #1e40af; line-height: 1.6; margin: 0;">
                        Your previous session has been terminated for security. You'll need to log in again on all your devices.
                        If you notice any suspicious activity on your account, please contact support immediately.
                    </p>
                </div>

                <!-- SUPPORT SECTION -->
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 15px; color: #4b5563; margin-bottom: 16px;">
                        Need help or notice suspicious activity? Contact our support team!
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin: 20px 0;">
                        <div style="display: flex; align-items: center; gap: 8px; color: #374151;">
                            <span>📧</span>
                            <a href="mailto:${supportEmail}" style="color: #667eea; text-decoration: none;">
                                ${supportEmail}
                            </a>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; color: #374151;">
                            <span>📱</span>
                            <span>${supportPhone}</span>
                        </div>
                    </div>
                    <p style="font-size: 14px; color: #64748b; margin-top: 16px;">
                        <strong>Support Hours:</strong> Mon-Fri, 9AM-6PM (Your Local Time)
                    </p>
                </div>

                <!-- Closing -->
                <p style="margin-top: 32px; font-size: 16px; color: #1f2937;">
                    Stay safe and enjoy predicting!<br />
                    <strong style="color: #1a2a6c;">The SportPredict Security Team</strong>
                </p>

            </td>
        </tr>

        <!-- FOOTER - Same as AdminFreeCreditsEmail -->
        <tr>
            <td class="footer">
                <div style="font-size: 22px; font-weight: bold; color: white; margin-bottom: 16px;">
                    SportPredict
                </div>
                
                <p style="margin: 20px 0; line-height: 1.8; color: #e5e7eb;">
                    📍 Predict. Win. Celebrate.<br />
                    📧 ${supportEmail}<br />
                    📞 ${supportPhone}
                </p>
                
                <div class="footer-links">
                    <a href="${appUrl}">Home</a>
                    <a href="${appUrl}/matches">Matches</a>
                    <a href="${appUrl}/leaderboard">Leaderboard</a>
                    <a href="${appUrl}/privacy">Privacy</a>
                    <a href="${appUrl}/terms">Terms</a>
                    <a href="${appUrl}/support">Support</a>
                </div>
                
                <div class="footer-copyright">
                    © ${new Date().getFullYear()} SportPredict. All rights reserved.<br />
                    This is an automated security notification. Please do not reply to this message.
                </div>
            </td>
        </tr>

    </table>
</body>
</html>`;
};
