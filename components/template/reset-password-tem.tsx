export const ResetPasswordTem = (data: any) => {
  let temp = `<!DOCTYPE html><html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>SportPredict OTP</title> </head> <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f7; color: #333333;"> <center> <!-- Main Container --> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7f7f7; padding: 20px 0;"> <tr> <td align="center"> <!-- Content Card --> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); margin: 0 auto;">
  <body>
      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%); padding: 30px 20px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png" alt="SportPredict Logo" width="180" style="display: block; margin: 0 auto;">
                            <h1 style="color: white; margin: 15px 0 0 0; font-size: 28px; font-weight: 700;">Password Reset</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Let's secure your account.</p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td align="center" style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">Hey <strong>${data.username}</strong>,</p>
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">You're one step away from getting back to the action! Use this One-Time Password (OTP) to reset your password and reclaim your predictions throne.</p>
                            
                            <!-- OTP Display Box -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px auto; background-color: #f3f9ff; border: 2px dashed #4ca1af; border-radius: 8px; padding: 15px 25px;">
                                <tr>
                                    <td align="center">
                                        <p style="font-size: 15px; color: #666666; margin: 0 0 5px 0; letter-spacing: 1px;">YOUR OTP CODE</p>
                                        <div style="font-size: 32px; font-weight: 800; color: #2c3e50; letter-spacing: 4px; margin: 0;">${data.otp}</div>
                                    </td>
                                </tr>
                            </table>
                            <!-- End OTP Box -->

                            <p style="margin: 25px 0 15px 0; font-size: 14px; color: #e74c3c;">
                                <strong>⚠️ Expires in: <span style="text-decoration: underline;">10 minutes</span></strong>
                            </p>

                            <p style="margin: 0; font-size: 14px; color: #777777; line-height: 1.5;">
                                For your security, please do not share this code with anyone. If you didn't request this, please <a href="mailto:support@sportpredict.com" style="color: #4ca1af;">contact our support team</a> immediately.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 20px 30px; background-color: #2c3e50; color: #ecf0f1;">
                            <p style="margin: 0 0 10px 0; font-size: 14px;">Need more help? We're here for you.</p>
                            <p style="margin: 0 0 15px 0;">
                                <a href="https://sportpredict.com/help" style="color: #4ca1af; text-decoration: none; margin: 0 10px;">Help Center</a> |
                                <a href="https://sportpredict.com/contact" style="color: #4ca1af; text-decoration: none; margin: 0 10px;">Contact Us</a>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #bdc3c7;">
                                © 2023 SportPredict. All rights reserved.<br>
                                123 Prediction Lane, Stats City
                            </p>
                            <p style="margin: 15px 0 0 0; font-size: 12px;">
                                <a href="#" style="color: #95a5a6; text-decoration: none; margin: 0 5px;">Privacy Policy</a> •
                                <a href="#" style="color: #95a5a6; text-decoration: none; margin: 0 5px;">Terms of Service</a>
                            </p>
                        </td>
                    </tr>
                </table>
                <!-- End Content Card -->
            </td>
        </tr>
    </table>
    </center>
    <!-- End Main Container -->
      <script src="script.js"></script>
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            width: 100%;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
        }
        
        .header {
            background: linear-gradient(135deg, #1a2a6c, #2c3e50);
            padding: 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.1' d='M0,128L48,117.3C96,107,192,85,288,112C384,139,480,213,576,224C672,235,768,181,864,160C960,139,1056,149,1152,165.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
            background-size: cover;
            background-position: center;
        }
        
        .logo {
            position: relative;
            z-index: 1;
            font-size: 38px;
            font-weight: 800;
            color: white;
            letter-spacing: 1.5px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .logo-icon {
            margin-right: 12px;
            font-size: 32px;
            color: #fdbb2d;
        }
        
        .logo-text {
            background: linear-gradient(to right, #fdbb2d, #ffcc33);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .subtitle {
            position: relative;
            z-index: 1;
            color: rgba(255, 255, 255, 0.9);
            font-size: 18px;
            margin-top: 5px;
        }
        
        .content {
            padding: 40px;
        }
        
        .success-container {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .success-icon {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #4cd964, #2ecc71);
            border-radius: 50%;
            box-shadow: 0 8px 20px rgba(46, 204, 113, 0.35);
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7);
            }
            70% {
                transform: scale(1.03);
                box-shadow: 0 0 0 15px rgba(46, 204, 113, 0);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
            }
        }
        
        .success-icon i {
            font-size: 45px;
            color: white;
        }
        
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .message {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            border-left: 5px solid #1a2a6c;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .message p {
            line-height: 1.6;
            color: #555;
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .account-info {
            background: #f0f4ff;
            padding: 20px;
            border-radius: 10px;
            margin: 25px 0;
            border: 2px dashed #1a2a6c;
            text-align: center;
        }
        
        .account-info p {
            color: #1a2a6c;
            font-weight: 500;
            font-size: 16px;
        }
        
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        
        .login-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 18px 50px;
            background: linear-gradient(135deg, #1a2a6c, #2c3e50);
            color: white;
            text-decoration: none;
            border-radius: 35px;
            font-weight: 600;
            font-size: 18px;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(26, 42, 108, 0.3);
        }
        
        .login-button i {
            margin-right: 10px;
            font-size: 20px;
        }
        
        .login-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(26, 42, 108, 0.4);
            background: linear-gradient(135deg, #2a3b7c, #3c4f70);
        }
        
        .login-button:active {
            transform: translateY(1px);
        }
        
        .security-tips {
            background: #fff5f5;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            border-left: 5px solid #b21f1f;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .security-tips h3 {
            color: #b21f1f;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 20px;
        }
        
        .security-tips ul {
            padding-left: 25px;
            color: #555;
        }
        
        .security-tips li {
            margin-bottom: 12px;
            line-height: 1.6;
            font-size: 15px;
        }
        
        .support {
            text-align: center;
            margin-top: 35px;
            color: #666;
            line-height: 1.6;
            font-size: 16px;
        }
        
        .support a {
            color: #1a2a6c;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .support a:hover {
            text-decoration: underline;
            color: #b21f1f;
        }
        
        .footer {
            background: #2c3e50;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 25px 0;
        }
        
        .social-link {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 45px;
            height: 45px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .social-link:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-3px);
        }
        
        .social-link i {
            font-size: 20px;
            color: white;
        }
        
        .footer-links {
            margin: 20px 0;
        }
        
        .footer-links a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            margin: 0 12px;
            font-size: 15px;
            transition: all 0.2s ease;
        }
        
        .footer-links a:hover {
            color: white;
            text-decoration: underline;
        }
        
        .copyright {
            margin-top: 25px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
        }
        
        @media (max-width: 650px) {
            .content {
                padding: 25px;
            }
            
            .header {
                padding: 25px 20px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .success-icon {
                width: 80px;
                height: 80px;
            }
            
            .success-icon i {
                font-size: 35px;
            }
            
            .login-button {
                padding: 15px 35px;
                font-size: 16px;
            }
            
            .social-links {
                gap: 15px;
            }
            
            .social-link {
                width: 40px;
                height: 40px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon"><i class="fas fa-futbol"></i></div>
                <div class="logo-text">SportPredict</div>
            </div>
            <div class="subtitle">The future of sports predictions</div>
        </div>
        
        <div class="content">
            <div class="success-container">
                <div class="success-icon">
                    <i class="fas fa-check"></i>
                </div>
            </div>
            
            <h1>Password Reset Successful</h1>
            
            <div class="message">
                <p>Hello <strong>${data.username}</strong>,</p>
                <p>Your SportPredict password has been successfully reset. You can now access your account using your new password.</p>
                <p>If you did not initiate this password reset, please contact our support team immediately.</p>
            </div>
            
            <div class="account-info">
                <p><i class="fas fa-user-circle"></i> Account: ${data.email}</p>
            </div>
            
            <div class="button-container">
                <a href=${process.env.NEXT_PUBLIC_API_URL} class="login-button"><i class="fas fa-sign-in-alt"></i> Log In to Your Account</a>
            </div>
            
            <div class="security-tips">
                <h3>
                    <i class="fas fa-shield-alt"></i>
                    Security Tips
                </h3>
                <ul>
                    <li>Use a unique password that you don't use for other sites</li>
                    <li>Consider enabling two-factor authentication for added security</li>
                    <li>Avoid using public computers to access your account</li>
                    <li>Never share your password with anyone</li>
                    <li>Update your password regularly for better security</li>
                </ul>
            </div>
            
            <div class="support">
                <p>Need help? <a href="#">Contact our support team</a> or visit our <a href="#">Help Center</a></p>
            </div>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="#" class="social-link">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="social-link">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="social-link">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="social-link">
                    <i class="fab fa-linkedin-in"></i>
                </a>
            </div>
            
            <div class="footer-links">
                <a href="#">Home</a>
                <a href="#">About</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Us</a>
            </div>
            
            <div class="copyright">
                © 2023 SportPredict. All rights reserved.
            </div>
        </div>
    </div>

    <script>
        // Simple animation for the success icon
        document.addEventListener('DOMContentLoaded', function() {
            const successIcon = document.querySelector('.success-icon');
            
            // Add animation delay to make it more noticeable
            setTimeout(function() {
                successIcon.style.animation = 'pulse 2s infinite';
            }, 500);
            
            // Add click effect to the login button
            const loginButton = document.querySelector('.login-button');
            if (loginButton) {
                loginButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Add a temporary click effect
                    this.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        this.style.transform = '';
                        alert('Redirecting to login page...');
                        // In a real scenario, this would redirect to the login page
                        // window.location.href = '/login';
                    }, 200);
                });
            }
        });
    </script>
</body>
</html>`;

  return temp;
};
