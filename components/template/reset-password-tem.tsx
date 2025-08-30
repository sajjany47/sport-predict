export const ResetPasswordTem = (data: any) => {
  let temp = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification - SportPredict</title>
    <style>
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .otp-container {
            display: inline-block;
            background-color: #f3f9ff;
            border: 2px dashed #4ca1af;
            border-radius: 8px;
            padding: 15px 25px;
            margin: 20px 0;
        }
        
        .otp-code {
            font-size: 32px;
            font-weight: 800;
            color: #2c3e50;
            letter-spacing: 4px;
            margin: 0;
            font-family: monospace;
        }
        
        .countdown {
            color: #e74c3c;
            font-weight: bold;
            text-decoration: underline;
        }
        .success-icon {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            box-shadow: 0 8px 20px rgba(46, 204, 113, 0.35);
            margin-bottom: 20px;
            overflow: hidden;
            border: 4px solid #4cd964;
            animation: pulse 2s infinite;
        }
        
        .success-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background: linear-gradient(to right, #1a2a6c, #2c3e50); padding: 30px 20px; color: white;">
                            <h1 style="margin: 0; font-size: 28px; color: white;">
                                <span style="color: #fdbb2d;">Sport</span>Predict
                            </h1>
                            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Secure OTP Verification</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <!-- Title -->
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                      <div class="success-container">
                <div class="success-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png" alt="Success Icon">
                </div>
            </div>
                                        <h2 style="margin: 0; color: #2c3e50;">Verify Your Identity</h2>
                                         
                                    </td>
                                </tr>
                                
                                <tr>
                        <td style="padding: 40px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <!-- Success Icon -->
                                
                                <!-- Message -->
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <p style="margin: 0 0 15px 0; color: #555; line-height: 1.6;">Hello <strong>${data.username}</strong>,</p>
                                        <p style="margin: 0 0 15px 0; color: #555; line-height: 1.6;">You've requested to perform a secure action on your SportPredict account. Please use the One-Time Password (OTP) below to verify your identity.</p>
                                    </td>
                                </tr>
                                
                                <!-- OTP Display -->
                                <tr>
                                    <td align="center" style="padding-bottom: 25px;">
                                        <div class="otp-container">
                                            <p style="font-size: 15px; color: #666666; margin: 0 0 5px 0; letter-spacing: 1px;">YOUR OTP CODE</p>
                                            <div class="otp-code">${data.otp}</div>
                                        </div>
                                        <p style="margin: 15px 0 0 0; font-size: 14px; color: #e74c3c;">
                                            <strong>⚠️ Expires in: <span class="countdown">10 minutes</span></strong>
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Security Notice -->
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <div style="background-color: #fff5f5; border-left: 4px solid #b21f1f; padding: 15px;">
                                            <h3 style="margin: 0 0 10px 0; color: #b21f1f;">Security Notice</h3>
                                            <p style="margin: 0; color: #555; line-height: 1.5;">
                                                For your security, please do not share this code with anyone. SportPredict will never ask you for your password or OTP via email, phone, or text message.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Support -->
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; color: #666;">Didn't request this OTP? <a href="mailto:support@sportpredict.com" style="color: #1a2a6c; text-decoration: none;">Contact our support team</a> immediately.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #2c3e50; padding: 30px 20px; color: white; text-align: center;">
                            <p style="margin: 0 0 20px 0; font-size: 14px; color: rgba(255, 255, 255, 0.7);">
                                <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 10px;">Home</a> • 
                                <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 10px;">About</a> • 
                                <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 10px;">Privacy Policy</a> • 
                                <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 10px;">Terms of Service</a> • 
                                <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 10px;">Contact Us</a>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.5);">© 2023 SportPredict. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  return temp;
};

export const ResetPasswordSuccessTem = (data: any) => {
  let temp = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful - SportPredict</title>
    <style>
       .success-icon {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            box-shadow: 0 8px 20px rgba(46, 204, 113, 0.35);
            margin-bottom: 20px;
            overflow: hidden;
            border: 4px solid #4cd964;
            animation: pulse 2s infinite;
        }
        
        .success-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background: linear-gradient(to right, #1a2a6c, #2c3e50); padding: 30px 20px; color: white;">
                            <h1 style="margin: 0; font-size: 28px; color: white;">
                                <span style="color: #fdbb2d;">Sport</span>Predict
                            </h1>
                            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">The future of sports predictions</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <!-- Success Icon -->
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <div class="success-container">
                <div class="success-icon">
                    <img src="https://static.vecteezy.com/system/resources/previews/020/487/365/non_2x/unlock-password-correct-success-login-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg" alt="Success Icon">
                </div>
            </div>
                                    </td>
                                </tr>
                                
                                <!-- Title -->
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <h2 style="margin: 0; color: #2c3e50;">Password Reset Successful</h2>
                                    </td>
                                </tr>
                                
                                <!-- Message -->
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <p style="margin: 0 0 15px 0; color: #555; line-height: 1.6;">Hello <strong>${data.username}</strong>,</p>
                                        <p style="margin: 0 0 15px 0; color: #555; line-height: 1.6;">Your SportPredict password has been successfully reset. You can now access your account using your new password.</p>
                                        <p style="margin: 0; color: #555; line-height: 1.6;">If you did not initiate this password reset, please contact our support team immediately.</p>
                                    </td>
                                </tr>
                                
                                <!-- Account Info -->
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <div style="background-color: #f0f4ff; border: 1px dashed #1a2a6c; border-radius: 6px; padding: 15px; text-align: center;">
                                            <p style="margin: 0; color: #1a2a6c; font-weight: bold;">
                                                Account: ${data.email}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Login Button -->
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <a href="${process.env.NEXT_PUBLIC_API_URL}" style="display: inline-block; background-color: #1a2a6c; color: white; text-decoration: none; padding: 14px 30px; border-radius: 4px; font-weight: bold; font-size: 16px;">Log In to Your Account</a>
                                    </td>
                                </tr>
                                
                                <!-- Security Tips -->
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <div style="background-color: #fff5f5; border-left: 4px solid #b21f1f; padding: 15px;">
                                            <h3 style="margin: 0 0 15px 0; color: #b21f1f;">Security Tips</h3>
                                            <ul style="margin: 0; padding-left: 20px; color: #555;">
                                                <li style="margin-bottom: 8px;">Use a unique password that you don't use for other sites</li>
                                                <li style="margin-bottom: 8px;">Consider enabling two-factor authentication for added security</li>
                                                <li style="margin-bottom: 8px;">Avoid using public computers to access your account</li>
                                                <li style="margin-bottom: 8px;">Never share your password with anyone</li>
                                                <li>Update your password regularly for better security</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Support -->
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; color: #666;">Need help? <a href="#" style="color: #1a2a6c; text-decoration: none;">Contact our support team</a> or visit our <a href="#" style="color: #1a2a6c; text-decoration: none;">Help Center</a></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #2c3e50; padding: 30px 20px; color: white; text-align: center;">
                            <p style="margin: 0 0 20px 0; font-size: 14px; color: rgba(255, 255, 255, 0.7);">
                                <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 10px;">Home</a> • 
                                <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 10px;">About</a> • 
                                <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 10px;">Privacy Policy</a> • 
                                <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 10px;">Terms of Service</a> • 
                                <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 10px;">Contact Us</a>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.5);">© 2023 SportPredict. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  return temp;
};
