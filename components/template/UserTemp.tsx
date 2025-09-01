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
               * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
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
        
        .welcome-badge {
            display: inline-block;
            background: #4cd964;
            color: white;
            padding: 8px 16px;
            border-radius: 50px;
            font-weight: bold;
            margin-left: 10px;
            font-size: 14px;
        }
        
        .account-card {
            background: #f0f4ff;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
            border: 1px dashed #1a2a6c;
        }
        
        .account-card h3 {
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
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 25px 0;
        }
        
        .feature-item {
            background: white;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s;
        }
        
        .feature-item:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
            color: #1a2a6c;
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
        
        .cta-container {
            background: #fff5e6;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #fdbb2d;
            text-align: center;
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
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
        }
        
        .social-link {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #1a2a6c;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            text-decoration: none;
            transition: all 0.3s;
        }
        
        .social-link:hover {
            background: #fdbb2d;
            transform: translateY(-3px);
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
            
            .features-grid {
                grid-template-columns: 1fr;
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
                <img src="https://media.istockphoto.com/id/973374928/vector/vector-of-handshake-icon-vector-iconic-design.jpg?s=612x612&w=0&k=20&c=ASQIa-xbFxu5jJKE32w4x63Ux45QxR4xhccP_k3PTwE=" alt="Welcome to SportPredict">
            </div>
            
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">
                Welcome to SportPredict <span class="welcome-badge">NEW MEMBER</span>
            </h2>
            
            <p>Hello <strong> ${data.username}</strong>,</p>
            <p>Welcome to SportPredict! We're thrilled to have you join our community of sports enthusiasts and prediction experts.</p>
            
            <div class="account-card">
                <h3>Your Account Details</h3>
                
                <div class="detail-row">
                    <div class="detail-label">Username:</div>
                    <div class="detail-value"> ${data.username}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Email:</div>
                    <div class="detail-value"> ${data.email}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Mobile Number:</div>
                    <div class="detail-value"> ${data.mobileNumber}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Member Since:</div>
                    <div class="detail-value"> ${data.joinDate}</div>
                </div>
                
                
            </div>
            
            <h3 style="color: #2c3e50; margin: 25px 0 15px;">Get Started with SportPredict</h3>
            
            <div class="features-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏆</div>
                    <h4>Make Predictions</h4>
                    <p>Predict match outcomes and earn points</p>
                </div>
                
                <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <h4>Track Performance</h4>
                    <p>Monitor your prediction accuracy</p>
                </div>
                
                <div class="feature-item">
                    <div class="feature-icon">👥</div>
                    <h4>Join Communities</h4>
                    <p>Connect with other sports fans</p>
                </div>
                
                <div class="feature-item">
                    <div class="feature-icon">🏅</div>
                    <h4>Earn Rewards</h4>
                    <p>Climb leaderboards and win prizes</p>
                </div>
            </div>
            
            
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">Start Predicting Now</a>
            
            <div class="social-links">
                <a href="${process.env.SOCIAL_FACEBOOK}" class="social-link">f</a>
                <a href="${process.env.SOCIAL_TWITTER}" class="social-link">t</a>
                <a href="${process.env.SOCIAL_LINKEDIN}" class="social-link">in</a>
                <a href="${process.env.SOCIAL_INSTAGRAM}" class="social-link">ig</a>
            </div>
            
            <p>If you have any questions, check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/faq" style="color: #1a2a6c;">FAQ section</a> or contact our support team.</p>
            
            <p>Welcome aboard!<br><strong>The SportPredict Team</strong></p>
        </div>
        
        <div class="footer">
            <div class="footer-links">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}">Home</a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/about">About Us</a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy">Privacy Policy</a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms">Terms of Service</a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/support">Contact Support</a>
            </div>
            <p class="copyright">© 2023 SportPredict. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};
