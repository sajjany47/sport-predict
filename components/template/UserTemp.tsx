export const UserAccountClosureTemp = (data: any) => {
  const url =
    data.status === "banned"
      ? "https://www.landlordtoday.co.uk/wp-content/uploads/sites/3/Banned-400x310-1.png"
      : "https://thumbs.dreamstime.com/b/account-suspended-rubber-stamp-red-grunge-text-written-inside-87783000.jpg";
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Suspended - SportPredict</title>
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
        
        .suspension-card {
            background: #fff5f5;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
            border: 1px dashed #e53e3e;
        }
        
        .suspension-card h3 {
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
        
        .action-card {
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
        
        .button {
            display: inline-block;
            background: #1a2a6c;
            color: white;
            text-align: center;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin: 15px 10px 5px 0;
            transition: all 0.3s ease;
        }
        
        .button:hover {
            background: #2c3e50;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .button-outline {
            display: inline-block;
            background: transparent;
            color: #1a2a6c;
            text-align: center;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin: 15px 10px 5px 0;
            border: 2px solid #1a2a6c;
            transition: all 0.3s ease;
        }
        
        .button-outline:hover {
            background: #1a2a6c;
            color: white;
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
            
            .button, .button-outline {
                display: block;
                margin: 10px 0;
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
                <img src=${url} alt="Account Suspended">
            </div>
            
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">
                Account ${
                  data.status === "banned" ? "Banned" : "Suspended"
                } <span class="status-badge">${
    data.isPermanent ? "PERMANENT" : "RESTRICTED"
  }</span>
            </h2>
            
            <p>Hello <strong> ${data.username}</strong>,</p>
            <p>We're writing to inform you that your SportPredict account has been ${
              data.status === "banned" ? "permanently banned" : "suspended"
            } due to a violation of our Terms of Service.</p>
            
            <div class="suspension-card">
                <h3>${
                  data.status === "banned" ? "Ban" : "Suspension"
                } Details</h3>
                
                <div class="detail-row">
                    <div class="detail-label">Username:</div>
                    <div class="detail-value"> ${data.username}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Account Status:</div>
                    <div class="detail-value">${
                      data.status === "banned"
                        ? "Permanently Banned"
                        : "Suspended"
                    }</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">${
                      data.status === "banned" ? "Ban" : "Suspension"
                    } Date:</div>
                    <div class="detail-value"> ${data.date}</div>
                </div>
                
               
            </div>
            
            <div class="reason-box">
                <h3 style="color: #c53030; margin-top: 0;">${
                  data.status === "banned" ? "Ban" : "Suspension"
                } Reason</h3>
                <p><strong> ${data.reason}</strong></p>
                
            </div>
            
            <div class="action-card">
                <h3 style="color: #1a2a6c; margin-top: 0;">Next Steps</h3>
                <p>During the ${
                  data.status === "banned" ? "ban" : "suspension"
                } period, you will not be able to:</p>
                <ul style="margin: 10px 0 10px 20px;">
                    <li>Access your account</li>
                    <li>Place new predictions</li>
                    <li>Participate in community features</li>
                    <li>Withdraw funds</li>
                </ul>
                
                ${
                  data.status !== "banned"
                    ? `
                <p>If you believe this suspension was applied in error, you may appeal the decision by contacting our support team.</p>
                
                <div style="margin-top: 20px;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/appeal" class="button">Appeal Suspension</a>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" class="button-outline">Review Terms of Service</a>
                </div>
                `
                    : `
                <p>This decision is final and cannot be appealed. Creating new accounts to circumvent this ban will result in immediate termination of those accounts.</p>
                `
                }
            </div>
            
            <p>Please review our <a href="${
              process.env.NEXT_PUBLIC_APP_URL
            }/guidelines" style="color: #1a2a6c;">Community Guidelines</a> and <a href="${
    process.env.NEXT_PUBLIC_APP_URL
  }/terms" style="color: #1a2a6c;">Terms of Service</a> to understand the rules governing our platform.</p>
            
            <p>Best regards,<br><strong>The SportPredict Safety Team</strong></p>
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
                }/guidelines">Community Guidelines</a>
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

export const UserWelcomeTemp = (data: any) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SportPredict</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
            padding: 20px;
            margin: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        /* Email container */
        .email-container {
            max-width: 600px;
            width: 100%;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
        }
        
        .header::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -20%;
            width: 150px;
            height: 150px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
        }
        
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        .logo-icon {
            width: 50px;
            height: 50px;
            background-color: white;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #667eea;
            font-weight: bold;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .logo-text {
            font-size: 28px;
            font-weight: bold;
            color: white;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .tagline {
            font-size: 16px;
            opacity: 0.9;
            margin-top: 8px;
            position: relative;
            z-index: 1;
        }
        
        /* Welcome Hero */
        .welcome-hero {
            background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
            padding: 40px 20px;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .welcome-badge {
            display: inline-block;
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            padding: 8px 20px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
        }
        
        .welcome-title {
            font-size: 28px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .welcome-subtitle {
            font-size: 16px;
            color: #4a5568;
            max-width: 500px;
            margin: 0 auto;
        }
        
        /* Content */
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 20px;
        }
        
        .main-text {
            color: #4a5568;
            margin-bottom: 25px;
            font-size: 15px;
            line-height: 1.7;
        }
        
        /* Account Details */
        .account-card {
            background: linear-gradient(135deg, #f6f9ff 0%, #f0f4ff 100%);
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .account-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .account-title::before {
            content: '👤';
            font-size: 20px;
        }
        
        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 15px;
        }
        
        .detail-label {
            font-weight: 600;
            color: #4a5568;
            font-size: 14px;
        }
        
        .detail-value {
            color: #2d3748;
            font-weight: 500;
        }
        
        .detail-value.highlight {
            color: #667eea;
            font-weight: 600;
        }
        
        /* Features */
        .features-section {
            margin: 40px 0;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        
        .feature-card {
            background: white;
            border-radius: 12px;
            padding: 25px 20px;
            text-align: center;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            border-color: #667eea;
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            color: white;
            font-size: 24px;
        }
        
        .feature-title {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
            font-size: 16px;
        }
        
        .feature-desc {
            color: #718096;
            font-size: 13px;
            line-height: 1.5;
        }
        
        /* CTA Section */
        .cta-section {
            background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 40px 0;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .cta-section::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
        }
        
        .cta-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
        }
        
        .cta-text {
            margin-bottom: 25px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: #ff7e5f;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            position: relative;
            z-index: 1;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        
        /* Getting Started */
        .getting-started {
            background: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            border-left: 4px solid #667eea;
        }
        
        .getting-started-title {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .getting-started-title::before {
            content: '🚀';
        }
        
        .steps-list {
            list-style: none;
            padding: 0;
        }
        
        .step-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .step-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .step-number {
            background: #667eea;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            flex-shrink: 0;
            margin-right: 15px;
        }
        
        .step-content h4 {
            color: #2d3748;
            margin-bottom: 5px;
            font-size: 15px;
        }
        
        .step-content p {
            color: #718096;
            font-size: 13px;
            line-height: 1.5;
        }
        
        /* Social Links */
        .social-section {
            text-align: center;
            margin: 30px 0;
        }
        
        .social-title {
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 15px;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 12px;
        }
        
        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 45px;
            background: #f7fafc;
            border-radius: 50%;
            color: #4a5568;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
        }
        
        .social-link:hover {
            background: #667eea;
            color: white;
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
        }
        
        /* Footer */
        .footer {
            background: #1a202c;
            color: #cbd5e0;
            padding: 40px 20px;
            text-align: center;
            font-size: 14px;
        }
        
        .footer-logo {
            font-size: 20px;
            font-weight: bold;
            color: white;
            margin-bottom: 20px;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
            margin: 25px 0;
        }
        
        .footer-link {
            color: #a0aec0;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.3s;
        }
        
        .footer-link:hover {
            color: white;
        }
        
        .contact-info {
            margin: 25px 0;
            color: #a0aec0;
            font-size: 13px;
            line-height: 1.6;
        }
        
        .contact-link {
            color: #667eea;
            text-decoration: none;
        }
        
        .copyright {
            color: #718096;
            font-size: 12px;
            margin-top: 25px;
            border-top: 1px solid #2d3748;
            padding-top: 25px;
        }
        
        /* Responsive Design */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .email-container {
                border-radius: 0;
            }
            
            .header {
                padding: 30px 15px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .detail-grid {
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
            
            .cta-section {
                padding: 25px 20px;
            }
            
            .footer {
                padding: 30px 15px;
            }
            
            .footer-links {
                flex-direction: column;
                gap: 10px;
            }
        }
        
        @media only screen and (max-width: 400px) {
            .content {
                padding: 25px 15px;
            }
            
            .welcome-title {
                font-size: 24px;
            }
            
            .cta-button {
                width: 100%;
                padding: 16px;
            }
        }
        
        /* Animation */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .feature-card, .cta-section, .account-card {
            animation: fadeIn 0.5s ease-out;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <div class="logo-icon">🏆</div>
                <div class="logo-text">SportPredict</div>
            </div>
            <div class="tagline">Predict. Win. Celebrate.</div>
        </div>
        
        <!-- Welcome Hero -->
        <div class="welcome-hero">
            <div class="welcome-badge">WELCOME ABOARD!</div>
            <h1 class="welcome-title">Your Winning Journey Begins Now</h1>
            <p class="welcome-subtitle">Join thousands of sports enthusiasts making accurate predictions</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <h2 class="greeting">Hello ${data.username},</h2>
            
            <p class="main-text">
                Welcome to SportPredict! We're absolutely thrilled to have you join our community of passionate sports fans and prediction experts. 
                Get ready to experience the thrill of predicting match outcomes and climbing the leaderboards!
            </p>
            
            <p class="main-text">
                Your account has been successfully created and verified. You're now part of an exclusive community where sports knowledge meets exciting predictions.
            </p>
            
            <!-- Account Details -->
            <div class="account-card">
                <h3 class="account-title">Your Account Details</h3>
                <div class="detail-grid">
                    <div class="detail-label">Username</div>
                    <div class="detail-value highlight">${data.username}</div>
                    
                    <div class="detail-label">Email Address</div>
                    <div class="detail-value">${data.email}</div>
                    
                    <div class="detail-label">Mobile Number</div>
                    <div class="detail-value">${data.mobileNumber}</div>
                    
                    <div class="detail-label">Member Since</div>
                    <div class="detail-value">${data.joinDate}</div>
                    
                    <div class="detail-label">Account Status</div>
                    <div class="detail-value highlight">Active ✅</div>
                    
                    <div class="detail-label">Starting Credits</div>
                    <div class="detail-value highlight">${
                      data.initialCredits || "100"
                    } 🪙</div>
                </div>
            </div>
            
            <!-- Features -->
            <div class="features-section">
                <h3 class="section-title">What You Can Do</h3>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🎯</div>
                        <h4 class="feature-title">Make Predictions</h4>
                        <p class="feature-desc">Predict match outcomes across cricket, football, and more</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h4 class="feature-title">Track Performance</h4>
                        <p class="feature-desc">Monitor your accuracy with detailed analytics</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">🏆</div>
                        <h4 class="feature-title">Win Rewards</h4>
                        <p class="feature-desc">Earn credits and climb global leaderboards</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">👥</div>
                        <h4 class="feature-title">Join Community</h4>
                        <p class="feature-desc">Connect with fellow sports prediction experts</p>
                    </div>
                </div>
            </div>
            
            <!-- CTA -->
            <div class="cta-section">
                <h3 class="cta-title">Ready to Start Predicting?</h3>
                <p class="cta-text">Your first prediction is just one click away. Jump in and show us your skills!</p>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }/matches" class="cta-button">
                    Make Your First Prediction
                </a>
            </div>
            
            <!-- Getting Started -->
            <div class="getting-started">
                <h3 class="getting-started-title">Quick Start Guide</h3>
                <ul class="steps-list">
                    <li class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Explore Live Matches</h4>
                            <p>Browse upcoming and live matches across different sports</p>
                        </div>
                    </li>
                    <li class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Make Predictions</h4>
                            <p>Use your sports knowledge to predict match outcomes</p>
                        </div>
                    </li>
                    <li class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Track Results</h4>
                            <p>See how your predictions perform in real-time</p>
                        </div>
                    </li>
                    <li class="step-item">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Earn & Compete</h4>
                            <p>Collect credits and compete on leaderboards</p>
                        </div>
                    </li>
                </ul>
            </div>
            
            <!-- Social Links -->
            <div class="social-section">
                <h4 class="social-title">Connect With Us</h4>
                <div class="social-links">
                    <a href="${
                      process.env.SOCIAL_FACEBOOK || "#"
                    }" class="social-link">fb</a>
                    <a href="${
                      process.env.SOCIAL_TWITTER || "#"
                    }" class="social-link">tw</a>
                    <a href="${
                      process.env.SOCIAL_INSTAGRAM || "#"
                    }" class="social-link">ig</a>
                    <a href="${
                      process.env.SOCIAL_LINKEDIN || "#"
                    }" class="social-link">in</a>
                </div>
            </div>
            
            <p class="main-text" style="text-align: center; margin-top: 30px;">
                Need help getting started? Check out our <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }/faq" style="color: #667eea; text-decoration: none; font-weight: 600;">FAQ section</a> or contact our support team anytime.
            </p>
            
            <p class="main-text" style="text-align: center; font-size: 16px; margin-top: 30px;">
                Welcome to the winning team!<br>
                <strong style="color: #667eea;">The SportPredict Team</strong>
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-logo">SportPredict</div>
            
            <div class="footer-links">
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }" class="footer-link">Home</a>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }/matches" class="footer-link">Matches</a>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }/leaderboard" class="footer-link">Leaderboard</a>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }/about" class="footer-link">About</a>
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL
                }/support" class="footer-link">Support</a>
            </div>
            
            <div class="contact-info">
                <p>Questions? Our team is here to help!</p>
                <p>📧 <a href="mailto:sportpredict247@gmail.com" class="contact-link">sportpredict247@gmail.com</a></p>
                <p>🕒 24/7 Customer Support Available</p>
            </div>
            
            <div class="copyright">
                © ${new Date().getFullYear()} SportPredict. All rights reserved.<br>
                Predictions are for entertainment purposes. Please play responsibly.
            </div>
        </div>
    </div>
</body>
</html>`;
};

export const RegistrationOTP = (data: any) => {
  let temp = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - SportPredict</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            padding: 0;
            margin: 0;
        }
        
        /* Email container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        
        .logo-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
        }
        
        .logo-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
            flex-wrap: wrap;
        }
        
        .logo-icon {
            width: 48px;
            height: 48px;
            min-width: 48px;
            background-color: white;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #667eea;
            font-weight: bold;
            font-size: 20px;
        }
        
        .logo-text {
            font-size: 32px;
            font-weight: 800;
            color: white;
            text-align: center;
            letter-spacing: -0.5px;
        }
        
        .tagline {
            font-size: 15px;
            opacity: 0.9;
            margin-top: 5px;
            font-weight: 400;
            text-align: center;
        }
        
        /* Content */
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .main-text {
            color: #4a5568;
            margin-bottom: 30px;
            font-size: 15px;
            text-align: center;
            line-height: 1.7;
        }
        
        /* OTP Section */
        .otp-container {
            background: linear-gradient(135deg, #f6f9ff 0%, #f0f4ff 100%);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 1px solid #e2e8f0;
        }
        
        .otp-label {
            font-size: 14px;
            color: #718096;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            text-align: center;
        }
        
        .otp-code {
            font-size: 42px;
            font-weight: 800;
            color: #667eea;
            letter-spacing: 8px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            text-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
            text-align: center;
            display: block;
            width: 100%;
            word-break: break-all;
        }
        
        .otp-expiry {
            font-size: 13px;
            color: #a0aec0;
            margin-top: 10px;
            text-align: center;
        }
        
        .expiry-timer {
            font-weight: 600;
            color: #e53e3e;
        }
        
        /* Instructions */
        .instructions {
            background-color: #f8fafc;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .instructions-title {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
            text-align: center;
        }
        
        .instructions-list {
            list-style-type: none;
            padding-left: 0;
            margin: 0;
        }
        
        .instructions-list li {
            margin-bottom: 8px;
            font-size: 14px;
            color: #4a5568;
            display: flex;
            align-items: flex-start;
            padding: 4px 0;
        }
        
        .instructions-list li:before {
            content: "✓";
            color: #48bb78;
            font-weight: bold;
            margin-right: 12px;
            flex-shrink: 0;
            margin-top: 1px;
        }
        
        /* CTA Button */
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2);
            border: none;
            cursor: pointer;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
        }
        
        /* Security Notice */
        .security-notice {
            background-color: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 8px;
            padding: 15px;
            margin: 25px 0;
            text-align: center;
        }
        
        .security-title {
            color: #c53030;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
            text-align: center;
        }
        
        .security-text {
            color: #742a2a;
            font-size: 13px;
            line-height: 1.5;
            text-align: center;
        }
        
        /* Footer */
        .footer {
            background-color: #1a202c;
            color: #cbd5e0;
            padding: 40px 20px;
            text-align: center;
            font-size: 13px;
        }
        
        .footer-content {
            max-width: 500px;
            margin: 0 auto;
        }
        
        .footer-logo {
            font-size: 20px;
            font-weight: bold;
            color: white;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .footer-links {
            margin: 25px 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
        }
        
        .footer-link {
            color: #a0aec0;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.3s;
        }
        
        .footer-link:hover {
            color: white;
            text-decoration: underline;
        }
        
        .contact-info {
            margin: 25px 0;
            color: #a0aec0;
            font-size: 12px;
            text-align: center;
            line-height: 1.6;
        }
        
        .contact-link {
            color: #667eea;
            text-decoration: none;
        }
        
        .copyright {
            color: #718096;
            font-size: 12px;
            margin-top: 25px;
            border-top: 1px solid #2d3748;
            padding-top: 25px;
            text-align: center;
        }
        
        /* Responsive Design */
        @media only screen and (max-width: 620px) {
            .email-container {
                border-radius: 8px;
                margin: 10px;
            }
            
            .header {
                padding: 30px 15px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .logo-row {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
            
            .logo-text {
                font-size: 28px;
                text-align: center;
                width: 100%;
            }
            
            .logo-icon {
                margin: 0 auto;
            }
            
            .otp-container {
                padding: 25px 15px;
                margin: 25px 0;
            }
            
            .otp-code {
                font-size: 36px;
                letter-spacing: 6px;
                line-height: 1.3;
            }
            
            .cta-button {
                width: 100%;
                padding: 18px;
                font-size: 15px;
                display: block;
            }
            
            .footer {
                padding: 30px 15px;
            }
            
            .footer-links {
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }
            
            .footer-link {
                margin: 0;
                font-size: 14px;
            }
        }
        
        @media only screen and (max-width: 480px) {
            .header {
                padding: 25px 12px;
            }
            
            .content {
                padding: 25px 15px;
            }
            
            .logo-text {
                font-size: 24px;
            }
            
            .logo-icon {
                width: 44px;
                height: 44px;
                font-size: 18px;
            }
            
            .otp-code {
                font-size: 32px;
                letter-spacing: 5px;
            }
            
            .tagline {
                font-size: 14px;
            }
            
            .greeting {
                font-size: 17px;
            }
            
            .main-text {
                font-size: 14px;
            }
            
            .otp-container {
                padding: 20px;
            }
            
            .footer {
                padding: 25px 12px;
            }
        }
        
        @media only screen and (max-width: 360px) {
            .otp-code {
                font-size: 28px;
                letter-spacing: 4px;
            }
            
            .logo-text {
                font-size: 22px;
            }
            
            .content {
                padding: 20px 12px;
            }
            
            .header {
                padding: 20px 12px;
            }
            
            .footer-links {
                gap: 8px;
            }
        }
        
        /* Animation */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .otp-code {
            animation: fadeIn 0.5s ease-out;
        }
        
        /* Utility Classes */
        .text-center {
            text-align: center;
        }
        
        .mx-auto {
            margin-left: auto;
            margin-right: auto;
        }
        
        .w-full {
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="header">
            <div class="logo-container">
                <div class="logo-row">
                    <div class="logo-icon">🏆</div>
                    <div class="logo-text">SportPredict</div>
                </div>
                <div class="tagline">Predict. Win. Celebrate.</div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <h2 class="greeting">Hello User,</h2>
            <p class="main-text">
                Thank you for choosing SportPredict! To complete your registration and start predicting matches like a pro, 
                please verify your email address using the one-time password (OTP) below.
            </p>
            
            <!-- OTP Display -->
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${data.otp || "123456"}</div>
                <div class="otp-expiry">
                    This code expires in <span class="expiry-timer">${5} minutes</span>
                </div>
            </div>
            
            <!-- Instructions -->
            <div class="instructions">
                <div class="instructions-title">How to use this code:</div>
                <ul class="instructions-list">
                    <li>Enter the 6-digit code in the verification field</li>
                    <li>Complete your profile setup</li>
                    <li>Start making predictions on live matches</li>
                    <li>Earn credits and climb the leaderboard</li>
                </ul>
            </div>
            
            <!-- CTA Button (Optional) -->
            <div class="text-center">
                <a href="${process.env.NEXT_PUBLIC_API_URL}" class="cta-button">
                    Complete Registration Now
                </a>
            </div>
            
            <!-- Security Notice -->
            <div class="security-notice">
                <div class="security-title">⚠️ Security Notice</div>
                <p class="security-text">
                    Never share this OTP with anyone. SportPredict will never ask for your password or OTP via email, 
                    phone, or chat. If you didn't request this, please ignore this email or contact support immediately.
                </p>
            </div>
            
            <p class="main-text">
                If you have any issues with the verification process or didn't request this email, 
                please contact our support team immediately.
            </p>
            
            <p class="main-text">
                Welcome to the SportPredict community! 🎉<br>
                <strong>The SportPredict Team</strong>
            </p>
        </div>
        
        <!-- Footer Section -->
        <div class="footer">
            <div class="footer-content">
                <div class="footer-logo">SportPredict</div>
                
                <div class="footer-links">
                    <a href="${
                      data.websiteUrl || "https://sportpredict.com"
                    }" class="footer-link">Home</a>
                    <a href="${
                      data.privacyUrl || "https://sportpredict.com/privacy"
                    }" class="footer-link">Privacy Policy</a>
                    <a href="${
                      data.termsUrl || "https://sportpredict.com/terms"
                    }" class="footer-link">Terms of Service</a>
                    <a href="${`${process.env.NEXT_PUBLIC_API_URL}/support`}" class="footer-link">Contact Us</a>
                    <a href="${`${process.env.NEXT_PUBLIC_API_URL}/support`}" class="footer-link">Help Center</a>
                </div>
                
                <div class="contact-info">
                    <p>Need help? Contact our support team:</p>
                    <p>📧 <a href="mailto:${
                      process.env.NEXT_PUBLIC_EMAIL
                    }" class="contact-link">${
    process.env.NEXT_PUBLIC_EMAIL
  }</a></p>
                    <p>🕒 24/7 Customer Support</p>
                </div>
                
                <div class="copyright">
                    © ${new Date().getFullYear()} SportPredict. All rights reserved.<br>
                    Predictions are for entertainment purposes. Please play responsibly.
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

  return temp;
};
