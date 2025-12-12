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
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to SportPredict</title>
  
  <style>
    /* Mobile Styles */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 0 !important;
      }
      .content {
        padding: 20px !important;
      }
      .grid-2 {
        display: block !important;
      }
    }
  </style>
</head>

<body style="margin:0; padding:0; background:#f0f3f8; font-family:Arial,Helvetica,sans-serif;">

  <!-- MAIN WRAPPER -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0;">
    <tr>
      <td align="center">

        <!-- CONTAINER -->
        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" 
               style="background:white; border-radius:14px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- HEADER -->
          <tr>
            <td align="center" 
                style="background:#667eea; padding:35px 20px; color:white;">

              <div style="font-size:40px;">🏆</div>
              <div style="font-size:28px; font-weight:700; margin-top:10px;">SportPredict</div>
              <div style="opacity:0.9; margin-top:8px;">Predict. Win. Celebrate.</div>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td align="center" style="padding:35px 20px; background:#f8faff;">
              <div style="background:#38a169; color:white; padding:8px 20px; border-radius:30px; font-weight:600; display:inline-block;">
                WELCOME ABOARD!
              </div>

              <h1 style="margin-top:20px; font-size:26px; font-weight:700; color:#333;">
                Your Winning Journey Begins Now
              </h1>

              <p style="max-width:480px; color:#555; font-size:15px;">
                Join thousands of sports enthusiasts making accurate predictions.
              </p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td class="content" style="padding:35px 30px; color:#444; font-size:15px; line-height:1.7;">

              <h2 style="font-size:20px; font-weight:700; color:#222;">
                Hello ${data.username},
              </h2>

              <p>
                Welcome to SportPredict! We're absolutely thrilled to have you join our
                community of passionate sports fans and prediction experts.
              </p>

              <p>
                Your account has been successfully created and you're now ready to begin
                your exciting prediction journey.
              </p>

              <!-- ACCOUNT DETAIL CARD -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" 
                     style="background:#f5f7ff; border:1px solid #e1e5f2; border-radius:10px; padding:25px; margin:25px 0;">
                
                <tr>
                  <td colspan="2" style="font-size:18px; font-weight:700; color:#222; padding-bottom:15px;">
                    👤 Your Account Details
                  </td>
                </tr>

                <tr>
                  <td style="font-weight:600; padding:6px 0; width:40%;">Username</td>
                  <td style="color:#667eea; font-weight:700;">${
                    data.username
                  }</td>
                </tr>

                <tr>
                  <td style="font-weight:600; padding:6px 0;">Email</td>
                  <td>${data.email}</td>
                </tr>

                <tr>
                  <td style="font-weight:600; padding:6px 0;">Mobile Number</td>
                  <td>${data.mobileNumber}</td>
                </tr>

                <tr>
                  <td style="font-weight:600; padding:6px 0;">Member Since</td>
                  <td>${data.joinDate}</td>
                </tr>

                <tr>
                  <td style="font-weight:600; padding:6px 0;">Account Status</td>
                  <td style="color:#38a169; font-weight:700;">Active ✅</td>
                </tr>

                <tr>
                  <td style="font-weight:600; padding:6px 0;">Starting Credits</td>
                  <td style="color:#667eea; font-weight:700;">
                    ${data.initialCredits || "100"} 🪙
                  </td>
                </tr>

              </table>

              <!-- FEATURES -->
              <h3 style="text-align:center; font-size:20px; font-weight:700; margin:30px 0 20px;">What You Can Do</h3>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="grid-2">
                <tr>
                  <td width="50%" style="padding:10px;">
                    <div style="background:white; border:1px solid #eee; padding:20px; border-radius:10px; text-align:center;">
                      <div style="font-size:26px;">🎯</div>
                      <div style="font-weight:700; margin-top:10px;">Make Predictions</div>
                      <p style="font-size:13px; color:#666;">Predict cricket, football & more</p>
                    </div>
                  </td>

                  <td width="50%" style="padding:10px;">
                    <div style="background:white; border:1px solid #eee; padding:20px; border-radius:10px; text-align:center;">
                      <div style="font-size:26px;">📊</div>
                      <div style="font-weight:700; margin-top:10px;">Track Performance</div>
                      <p style="font-size:13px; color:#666;">View detailed analytics</p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td width="50%" style="padding:10px;">
                    <div style="background:white; border:1px solid #eee; padding:20px; border-radius:10px; text-align:center;">
                      <div style="font-size:26px;">🏆</div>
                      <div style="font-weight:700; margin-top:10px;">Win Rewards</div>
                      <p style="font-size:13px; color:#666;">Earn credits & prizes</p>
                    </div>
                  </td>

                  <td width="50%" style="padding:10px;">
                    <div style="background:white; border:1px solid #eee; padding:20px; border-radius:10px; text-align:center;">
                      <div style="font-size:26px;">👥</div>
                      <div style="font-weight:700; margin-top:10px;">Join Community</div>
                      <p style="font-size:13px; color:#666;">Meet prediction experts</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="background:#ff7e5f; padding:30px; border-radius:10px; margin:35px 0; text-align:center; color:white;">
                <h2 style="margin:0 0 15px; font-size:22px;">Ready to Start Predicting?</h2>
                <p style="opacity:0.9;">Jump in and make your first prediction now.</p>

                <a href="${process.env.NEXT_PUBLIC_APP_URL}/matches"
                   style="display:inline-block; background:white; color:#ff7e5f; padding:12px 28px; 
                          font-weight:700; border-radius:40px; text-decoration:none; margin-top:12px;">
                  Make Your First Prediction
                </a>
              </div>

              <!-- FOOTER -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" 
                     style="background:#1a202c; color:#cbd5e0; text-align:center; padding:35px 20px; border-radius:0 0 14px 14px;">

                <tr>
                  <td style="font-size:20px; font-weight:700; color:white;">
                    SportPredict
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:20px; font-size:14px;">
                    Questions? We're here to help.<br/>
                    📧 <a href="mailto:sportpredict247@gmail.com" style="color:#667eea;">sportpredict247@gmail.com</a>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:20px; font-size:12px; color:#888;">
                    © ${new Date().getFullYear()} SportPredict. All rights reserved.
                  </td>
                </tr>

              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;
};

export const RegistrationOTP = (a: any) => {
  const data = {
    ...a,
    expiryMinutes: 5,

    // URLs (can use environment variables)
    verificationUrl: process.env.NEXT_PUBLIC_API_URL,
    appUrl: process.env.NEXT_PUBLIC_API_URL,
    websiteUrl: process.env.NEXT_PUBLIC_API_URL,
    matchesUrl: process.env.NEXT_PUBLIC_API_URL,
    leaderboardUrl: process.env.NEXT_PUBLIC_API_URL,
    privacyUrl: process.env.NEXT_PUBLIC_API_URL,
    termsUrl: process.env.NEXT_PUBLIC_API_URL,
    supportUrl: `${process.env.NEXT_PUBLIC_API_URL}/support`,

    // Contact info
    supportEmail: process.env.NEXT_PUBLIC_EMAIL,
    supportPhone: process.env.NEXT_PUBLIC_MOBILE,

    // Social media URLs (optional)
    facebookUrl: process.env.NEXT_PUBLIC_API_URL,
    twitterUrl: process.env.NEXT_PUBLIC_API_URL,
    instagramUrl: process.env.NEXT_PUBLIC_API_URL,
    linkedinUrl: process.env.NEXT_PUBLIC_API_URL,
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SportPredict Email Verification</title>

    <style>
        /* GENERAL EMAIL RESET */
        body, table, td {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            color: #333333;
        }

        body {
            background-color: #f5f5f5;
            padding: 20px;
        }

        .wrapper {
            width: 100%;
            max-width: 600px;
            background: #ffffff;
            margin: 0 auto;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }

        /* FORCE CENTERING IN ALL EMAIL CLIENTS */
        .center-table {
            margin-left: auto;
            margin-right: auto;
        }

        /* HEADERS */
        .header {
            padding: 25px 20px;
            text-align: center;
            border-bottom: 1px solid #eeeeee;
        }

        /* RESPONSIVE FIX */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            .wrapper {
                width: 100% !important;
            }
        }
    </style>
</head>

<body>
    <table class="wrapper" cellpadding="0" cellspacing="0" width="100%">

        <!-- HEADER -->
        <tr>
            <td class="header">
                <table class="center-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <!-- ICON BOX -->
                        <td align="center" style="
                            background:#007bff;
                            width:50px;
                            height:50px;
                            border-radius:8px;
                            color:#ffffff;
                            font-size:28px;
                            font-weight:bold;
                            text-align:center;
                        ">
                            🏆
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top:10px;">
                            <span style="font-size:28px; font-weight:bold; color:#007bff;">
                                SportPredict
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top:5px; color:#666666; font-size:16px;">
                            Predict. Win. Celebrate.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- BODY -->
        <tr>
            <td style="padding: 30px;">

                <h2 style="font-size:20px; margin-bottom:15px;">Hello User,</h2>

                <p style="font-size:15px; line-height:1.6; color:#555;">
                    Welcome to <b style="color:#007bff;">SportPredict</b>!  
                    To activate your account, please verify your email using the OTP below.
                </p>

                <!-- OTP BOX -->
                <table class="center-table" cellpadding="0" cellspacing="0" width="100%" style="margin:30px 0; background:#f8f9fa; border:1px solid #e0e0e0; border-radius:10px;">
                    <tr>
                        <td style="padding:25px; text-align:center;">
                            <div style="color:#666; font-size:14px; margin-bottom:8px;">Your Verification Code</div>

                            <div style="
                                font-size:40px;
                                font-weight:bold;
                                color:#007bff;
                                letter-spacing:6px;
                                font-family:Courier, monospace;
                                padding:12px;
                                border:1px dashed #007bff;
                                background:#ffffff;
                                border-radius:6px;
                                display:inline-block;
                            ">
                                ${data.otp || "123456"}
                            </div>

                            <div style="font-size:14px; color:#777; margin-top:12px;">
                                Valid for <span style="color:#dc3545; font-weight:bold;">${
                                  data.expiryMinutes || 10
                                } minutes</span>
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- CTA -->
                <div style="text-align:center; margin:25px 0;">
                    <a href="${
                      data.verificationUrl ||
                      data.appUrl ||
                      "https://sportpredict.com/verify"
                    }"
                       style="
                           background:#007bff;
                           color:#ffffff;
                           font-size:16px;
                           font-weight:bold;
                           padding:14px 28px;
                           text-decoration:none;
                           border-radius:6px;
                           display:inline-block;
                       ">
                        Verify & Activate Account
                    </a>
                </div>

                <!-- SECURITY NOTICE -->
                <div style="background:#fff5f5; border:1px solid #ffcccc; padding:18px; border-radius:8px;">
                    <h4 style="color:#dc3545; margin:0 0 10px;">Security Reminder</h4>
                    <p style="font-size:14px; color:#7f1d1d; line-height:1.6;">
                        Never share this OTP with anyone. If you did not request this, please ignore this email.
                    </p>
                </div>

                <p style="margin-top:20px; color:#555; font-size:15px;">
                    Need help? Our support team is here anytime.
                </p>

                <p style="margin-top:20px; font-size:15px;">
                    Best regards,<br />
                    <b style="color:#007bff;">The SportPredict Team</b>
                </p>

                <!-- SOCIAL ICONS -->
                <table class="center-table" cellpadding="0" cellspacing="0" style="margin:25px auto 0;">
                    <tr>
                        ${["FB", "TW", "IG", "IN"]
                          .map(
                            (i) => `<td style="padding:0 6px;">
                                <a href="#" style="
                                    display:inline-block;
                                    width:36px;
                                    height:36px;
                                    background:#e9ecef;
                                    border-radius:50%;
                                    text-align:center;
                                    line-height:36px;
                                    font-size:12px;
                                    color:#666;
                                    text-decoration:none;">
                                    ${i}
                                </a>
                            </td>`
                          )
                          .join("")}
                    </tr>
                </table>

            </td>
        </tr>

        <!-- FOOTER -->
        <tr>
            <td style="background:#f8f9fa; text-align:center; padding:25px; font-size:13px; color:#666;">
                <div style="font-size:18px; font-weight:bold; color:#007bff;">SportPredict</div>

                <p style="margin:15px 0;">
                    <a href="#" style="color:#666; text-decoration:none; padding:4px 10px;">Home</a>
                    <a href="#" style="color:#666; text-decoration:none; padding:4px 10px;">Matches</a>
                    <a href="#" style="color:#666; text-decoration:none; padding:4px 10px;">Privacy</a>
                    <a href="#" style="color:#666; text-decoration:none; padding:4px 10px;">Support</a>
                </p>

                <p style="margin:20px 0; line-height:1.6;">
                    📧 ${data.supportEmail || "support@sportpredict.com"}<br />
                    📞 ${data.supportPhone || "+1 (555) 123-4567"}
                </p>

                <p style="font-size:12px; color:#999; margin-top:20px;">
                    © ${new Date().getFullYear()} SportPredict. All rights reserved.
                </p>
            </td>
        </tr>

    </table>
</body>
</html>
`;
};
