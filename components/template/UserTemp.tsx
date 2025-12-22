export const UserAccountClosureTemp = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sportpredict.com";
  const supportEmail =
    process.env.NEXT_PUBLIC_EMAIL || "support@sportpredict.com";
  const supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (888) 123-4567";

  const isBanned = data.status === "banned";

  // Attractive icon configuration
  const iconConfig = {
    banned: {
      url: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
      color: "#dc2626",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      shadow: "0 6px 20px rgba(220, 38, 38, 0.25)",
      title: "Account Permanently Banned",
      subTitle: "Access has been permanently revoked",
      emoji: "🚫",
    },
    suspended: {
      url: "https://cdn-icons-png.flaticon.com/512/3184/3184839.png",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      shadow: "0 6px 20px rgba(245, 158, 11, 0.25)",
      title: "Account Temporarily Suspended",
      subTitle: "Access has been temporarily restricted",
      emoji: "⚠️",
    },
  };

  const config = iconConfig[isBanned ? "banned" : "suspended"];

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>SportPredict Account Status Update</title>
    
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
            background-color: ${isBanned ? "#fef2f2" : "#fffbeb"};
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
        
        /* Status Icon */
        .status-icon {
            width: 120px;
            height: 120px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: ${config.gradient};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: ${config.shadow};
        }
        
        .status-icon img {
            width: 56px;
            height: 56px;
            filter: brightness(0) invert(1);
        }
        
        .status-badge {
            display: inline-block;
            padding: 8px 20px;
            background: ${config.color};
            color: white;
            font-size: 12px;
            font-weight: 700;
            border-radius: 24px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* Cards */
        .info-card {
            background: ${isBanned ? "#fef2f2" : "#fffbeb"};
            border: 1px solid ${isBanned ? "#fecaca" : "#fde68a"};
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }
        
        /* Details Grid */
        .details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px 20px;
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
        
        /* Button Styles */
        .button-primary {
            display: inline-block;
            padding: 14px 32px;
            background: ${isBanned ? "#dc2626" : "#1a2a6c"};
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            min-width: 180px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
            min-width: 180px;
            border: 2px solid #1a2a6c;
            transition: all 0.3s ease;
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
            
            .details-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .status-icon {
                width: 100px;
                height: 100px;
            }
            
            .status-icon img {
                width: 48px;
                height: 48px;
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

                <!-- Status Section -->
                <div style="text-align: center; margin-bottom: 32px;">
                    <div class="status-icon">
                        <img src="${config.url}" alt="${
    isBanned ? "Banned" : "Suspended"
  }">
                    </div>
                    <h2 style="font-size: 24px; font-weight: 700; color: ${
                      config.color
                    }; margin-bottom: 8px;">
                        ${config.title}
                    </h2>
                    <p style="color: #6b7280; font-size: 16px; margin-bottom: 12px;">
                        ${config.subTitle}
                    </p>
                    <div class="status-badge">
                        ${data.isPermanent ? "PERMANENT" : "TEMPORARY"}
                    </div>
                </div>

                <!-- Greeting -->
                <h2 style="font-size: 22px; margin-bottom: 20px; color: #1f2937;">
                    Hello ${data.username},
                </h2>

                <!-- Main Message -->
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                    We're writing to inform you that your SportPredict account has been 
                    <strong style="color: ${config.color}">${
    isBanned ? "permanently banned" : "temporarily suspended"
  }</strong> 
                    due to a violation of our Terms of Service.
                </p>

                <!-- Account Details -->
                <div class="info-card">
                    <h3 style="color: ${
                      isBanned ? "#b91c1c" : "#92400e"
                    }; margin: 0 0 20px; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                        📋 Account Details
                    </h3>
                    <div class="details-grid">
                        <div>
                            <div style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                                Username
                            </div>
                            <div style="font-size: 15px; font-weight: 500; color: #111827;">
                                ${data.username}
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                                Status
                            </div>
                            <div style="font-size: 15px; font-weight: 500; color: ${
                              config.color
                            };">
                                ${isBanned ? "Banned" : "Suspended"}
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                                Date
                            </div>
                            <div style="font-size: 15px; font-weight: 500; color: #111827;">
                                ${data.date}
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                                User ID
                            </div>
                            <div style="font-size: 15px; font-weight: 500; color: #111827;">
                                ${data.userId || "N/A"}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reason -->
                <div style="background: white; border-left: 4px solid ${
                  config.color
                }; padding: 20px; border-radius: 8px; margin: 24px 0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <h4 style="color: ${
                      config.color
                    }; margin: 0 0 12px; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        ${config.emoji} ${
    isBanned ? "Ban" : "Suspension"
  } Reason
                    </h4>
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #111827;">
                        <strong>${data.reason}</strong>
                    </p>
                    ${
                      data.remarks
                        ? `<p style="margin-top: 12px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                             <strong>Additional Notes:</strong> ${data.remarks}
                           </p>`
                        : ""
                    }
                </div>

                <!-- Account Restrictions -->
                <div class="info-card">
                    <h3 style="color: ${
                      isBanned ? "#b91c1c" : "#92400e"
                    }; margin: 0 0 16px; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                        🔒 Account Restrictions
                    </h3>
                    <p style="margin-bottom: 12px; color: #4b5563;">During this period, you will not be able to:</p>
                    <ul style="margin: 0 0 0 20px; color: #4b5563;">
                        <li style="margin-bottom: 8px;">Access your SportPredict account</li>
                        <li style="margin-bottom: 8px;">Place predictions or participate in contests</li>
                        <li style="margin-bottom: 8px;">Withdraw or deposit funds</li>
                        <li style="margin-bottom: 8px;">Use community features and chat</li>
                        <li>Access leaderboards and achievements</li>
                    </ul>
                </div>

                <!-- Action Buttons -->
                <div style="text-align: center; margin: 32px 0;">
                    ${
                      !isBanned
                        ? `<a href="${appUrl}/appeal" class="button-primary" style="margin: 0 8px 12px;">
                             ✍️ Appeal Suspension
                           </a>`
                        : ""
                    }
                    <a href="${appUrl}/terms" class="button-secondary" style="margin: 0 8px 12px;">
                        📜 Terms of Service
                    </a>
                    <a href="${appUrl}/guidelines" class="button-secondary" style="margin: 0 8px 12px;">
                        📋 Community Guidelines
                    </a>
                </div>

                <!-- Contact Support -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 30px 0; border: 1px solid #e2e8f0;">
                    <h3 style="color: #1e293b; margin: 0 0 16px; font-size: 18px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        📞 Contact Support
                    </h3>
                    <p style="color: #475569; margin-bottom: 20px;">
                        If you believe this ${
                          isBanned ? "ban" : "suspension"
                        } was applied in error or have questions, our support team is here to help.
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: #475569;">
                            <span>📧</span>
                            <a href="mailto:${supportEmail}" style="color: #1a2a6c; text-decoration: none;">
                                ${supportEmail}
                            </a>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; color: #475569;">
                            <span>📱</span>
                            <span>${supportPhone}</span>
                        </div>
                    </div>
                    <p style="margin-top: 16px; font-size: 14px; color: #64748b;">
                        <strong>Support Hours:</strong> Mon-Fri, 9AM-6PM (Your Local Time)
                    </p>
                </div>

                <!-- Final Message -->
                ${
                  isBanned
                    ? `<div style="padding: 16px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626; color: #b91c1c; font-size: 14px; margin: 24px 0;">
                         ⚠️ <strong>Important:</strong> This decision is final. Creating new accounts to circumvent this ban will result in immediate termination.
                       </div>`
                    : `<div style="padding: 16px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0369a1; color: #075985; font-size: 14px; margin: 24px 0;">
                         ℹ️ Your account will remain suspended until the issue is resolved. Review our guidelines to ensure compliance upon reinstatement.
                       </div>`
                }

                <!-- Closing -->
                <p style="margin-top: 32px; margin-bottom: 0; font-size: 16px; color: #1f2937;">
                    Best regards,<br>
                    <strong style="color: #1a2a6c;">The SportPredict Safety Team</strong>
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
                    This is an automated notification. Please do not reply to this email.
                </div>
            </td>
        </tr>

    </table>
</body>
</html>`;
};

export const UserWelcomeTemp = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sportpredict.com";
  const supportEmail =
    process.env.NEXT_PUBLIC_EMAIL || "sportpredict247@gmail.com";
  const supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (888) 123-4567";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Welcome to SportPredict - Your Prediction Journey Begins!</title>
    
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
        
        /* Welcome Badge */
        .welcome-badge {
            background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
            color: white;
            border-radius: 50px;
            padding: 8px 24px;
            display: inline-block;
            font-weight: bold;
            font-size: 14px;
            margin: 10px 0;
            box-shadow: 0 4px 12px rgba(56, 161, 105, 0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* Account Details Card */
        .account-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 24px;
            margin: 25px 0;
            border: 1px solid #e9ecef;
        }
        
        /* Features Grid */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin: 25px 0;
        }
        
        /* CTA Section */
        .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            padding: 30px;
            margin: 30px 0;
            color: white;
            text-align: center;
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
        
        /* Button Styles */
        .button-primary {
            display: inline-block;
            padding: 14px 32px;
            background: white;
            color: #667eea !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            min-width: 200px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .button-secondary {
            display: inline-block;
            padding: 14px 32px;
            background: transparent;
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            min-width: 200px;
            border: 2px solid white;
            transition: all 0.3s ease;
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
            
            .features-grid {
                grid-template-columns: 1fr;
                gap: 12px;
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

                <!-- Welcome Message -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div class="welcome-badge">
                        🎉 WELCOME ABOARD! 🎉
                    </div>
                    <h2 style="font-size: 24px; color: #1f2937; margin: 15px 0 10px;">
                        Your Winning Journey Begins Now
                    </h2>
                    <p style="color: #6b7280; font-size: 16px;">
                        Join thousands of sports enthusiasts making accurate predictions
                    </p>
                </div>

                <!-- Greeting -->
                <h2 style="font-size: 22px; margin-bottom: 20px; color: #1f2937;">
                    Hello ${data.username || "Valued User"},
                </h2>

                <!-- Introduction -->
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 20px;">
                    Welcome to SportPredict! We're absolutely thrilled to have you join our community of passionate sports fans and prediction experts.
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 25px;">
                    Your account has been successfully created and you're now ready to begin your exciting prediction journey.
                </p>

                <!-- ACCOUNT DETAILS CARD -->
                <div class="account-card">
                    <h3 style="color: #1a2a6c; margin: 0 0 20px; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                        👤 Your Account Details
                    </h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #374151; width: 40%;">Username:</td>
                            <td style="padding: 8px 0; color: #667eea; font-weight: 700;">${
                              data.username
                            }</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #374151;">Email:</td>
                            <td style="padding: 8px 0; color: #4b5563;">${
                              data.email
                            }</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #374151;">Mobile:</td>
                            <td style="padding: 8px 0; color: #4b5563;">${
                              data.mobileNumber
                            }</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #374151;">Member Since:</td>
                            <td style="padding: 8px 0; color: #4b5563;">${
                              data.joinDate
                            }</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #374151;">Status:</td>
                            <td style="padding: 8px 0; color: #38a169; font-weight: 700;">Active ✅</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #374151;">Starting Credits:</td>
                            <td style="padding: 8px 0; color: #f59e0b; font-weight: 700; font-size: 18px;">
                                ${data.initialCredits || "100"} 🪙
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- FEATURES -->
                <h3 style="text-align: center; font-size: 20px; font-weight: 700; color: #1f2937; margin: 30px 0 20px;">
                    What You Can Do
                </h3>

                <div class="features-grid">
                    <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 10px; padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 12px;">🎯</div>
                        <div style="font-weight: 700; color: #92400e; margin-bottom: 8px;">Make Predictions</div>
                        <p style="font-size: 14px; color: #92400e; line-height: 1.5;">
                            Predict cricket, football & more
                        </p>
                    </div>

                    <div style="background: #dbeafe; border: 1px solid #bfdbfe; border-radius: 10px; padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 12px;">📊</div>
                        <div style="font-weight: 700; color: #1e40af; margin-bottom: 8px;">Track Performance</div>
                        <p style="font-size: 14px; color: #1e40af; line-height: 1.5;">
                            View detailed analytics
                        </p>
                    </div>

                    <div style="background: #dcfce7; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 12px;">🏆</div>
                        <div style="font-weight: 700; color: #166534; margin-bottom: 8px;">Win Rewards</div>
                        <p style="font-size: 14px; color: #166534; line-height: 1.5;">
                            Earn credits & prizes
                        </p>
                    </div>

                    <div style="background: #f3e8ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 12px;">👥</div>
                        <div style="font-weight: 700; color: #6b21a8; margin-bottom: 8px;">Join Community</div>
                        <p style="font-size: 14px; color: #6b21a8; line-height: 1.5;">
                            Meet prediction experts
                        </p>
                    </div>
                </div>

                <!-- CTA SECTION -->
                <div class="cta-section">
                    <h2 style="margin: 0 0 15px; font-size: 22px; color: white;">
                        Ready to Start Predicting?
                    </h2>
                    <p style="opacity: 0.9; margin-bottom: 25px; font-size: 16px;">
                        Jump in and make your first prediction now!
                    </p>

                    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                        <a href="${appUrl}/matches" class="button-primary">
                            🚀 Make Your First Prediction
                        </a>
                        <a href="${appUrl}/dashboard" class="button-secondary">
                            📊 Explore Dashboard
                        </a>
                    </div>
                </div>

                <!-- GETTING STARTED TIPS -->
                <div style="background: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 10px; padding: 24px; margin: 30px 0;">
                    <h3 style="color: #0369a1; margin: 0 0 16px; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                        💡 Getting Started Tips
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
                        <li style="margin-bottom: 8px;">Start with smaller predictions to get comfortable</li>
                        <li style="margin-bottom: 8px;">Check upcoming matches in the Matches section</li>
                        <li style="margin-bottom: 8px;">Join prediction contests to compete with others</li>
                        <li>Follow expert predictions to learn strategies</li>
                    </ul>
                </div>

                <!-- SUPPORT SECTION -->
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 15px; color: #4b5563; margin-bottom: 16px;">
                        Need help getting started? Our support team is here for you!
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
                    Welcome to the community!<br />
                    <strong style="color: #667eea;">The SportPredict Team</strong>
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
                    This is an automated welcome message. We're excited to have you onboard!
                </div>
            </td>
        </tr>

    </table>
</body>
</html>`;
};

export const RegistrationOTP = (a: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sportpredict.com";
  const supportEmail =
    process.env.NEXT_PUBLIC_EMAIL || "support@sportpredict.com";
  const supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (888) 123-4567";

  const data = {
    ...a,
    expiryMinutes: 5,
    appUrl,
    supportEmail,
    supportPhone,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Verify Your Email - SportPredict</title>
    
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
        
        /* PERFECT HEADER - Same as Other Templates */
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
        }
        
        /* OTP Container */
        .otp-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            padding: 30px;
            margin: 25px 0;
            text-align: center;
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
            
            .otp-container {
                padding: 20px;
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

        <!-- PERFECT HEADER - Same as Other Templates -->
        <tr>
            <td class="header">
                <h1><span>Sport</span>Predict</h1>
                <p>The future of sports predictions</p>
            </td>
        </tr>

        <!-- BODY CONTENT -->
        <tr>
            <td style="padding: 40px 32px;">

                <!-- Greeting -->
                <h2 style="font-size: 22px; margin-bottom: 20px; color: #1f2937;">
                    Hello ${a.username || "User"},
                </h2>

                <!-- Welcome Message -->
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 20px;">
                    Welcome to <strong style="color: #1a2a6c;">SportPredict</strong>!  
                    To activate your account, please verify your email using the OTP below.
                </p>

                <!-- OTP CONTAINER -->
                <div class="otp-container">
                    <div style="color: #6b7280; font-size: 14px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
                        Your Verification Code
                    </div>
                    
                    <div class="otp-display">
                        ${data.otp || "123456"}
                    </div>
                    
                    <div style="font-size: 14px; color: #6b7280; margin-top: 16px;">
                        Valid for <span style="color: #dc2626; font-weight: 700;">${
                          data.expiryMinutes || 10
                        } minutes</span>
                    </div>
                </div>

                <!-- CTA BUTTON -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${appUrl}/verify?otp=${data.otp || "123456"}"
                       class="button-primary">
                        ✅ Verify & Activate Account
                    </a>
                </div>

                <!-- SECURITY NOTICE -->
                <div class="security-notice">
                    <h4 style="color: #dc2626; margin: 0 0 12px; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        🔒 Security Reminder
                    </h4>
                    <p style="font-size: 14px; color: #7f1d1d; line-height: 1.6; margin: 0;">
                        Never share this OTP with anyone. SportPredict will never ask for your OTP via phone, email, or text message.
                        If you did not request this verification, please ignore this email.
                    </p>
                </div>

                <!-- TIPS SECTION -->
                <div style="background: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 8px; padding: 20px; margin: 25px 0;">
                    <h4 style="color: #0369a1; margin: 0 0 12px; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        💡 Quick Tips
                    </h4>
                    <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
                        <li style="margin-bottom: 8px;">Enter this OTP on the verification page to activate your account</li>
                        <li style="margin-bottom: 8px;">The OTP expires in ${
                          data.expiryMinutes || 10
                        } minutes</li>
                        <li>If OTP expires, request a new one from the login page</li>
                    </ul>
                </div>

                <!-- SUPPORT SECTION -->
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 15px; color: #4b5563; margin-bottom: 16px;">
                        Having trouble with verification? Our support team is here to help!
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
                    Welcome aboard!<br />
                    <strong style="color: #1a2a6c;">The SportPredict Team</strong>
                </p>

            </td>
        </tr>

        <!-- FOOTER - Same as Other Templates -->
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
                    This is an automated verification email. Please do not reply to this message.
                </div>
            </td>
        </tr>

    </table>
</body>
</html>`;
};

export const AdminFreeCreditsEmail = (data: {
  user: {
    name?: string;
    email: string;
  };
  credits: number;
  totalCreditsAdded: number;
  reason?: string;
  adminName?: string;
  termsUrl?: string;
  appUrl?: string;
  supportEmail?: string;
  supportPhone?: string;
}) => {
  const {
    user,
    credits,
    totalCreditsAdded,
    reason = "As a token of our appreciation",
    adminName = "SportPredict Admin",
    termsUrl = process.env.NEXT_PUBLIC_API_URL + "/terms",
    appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL,
    supportEmail = process.env.NEXT_PUBLIC_EMAIL,
    supportPhone = process.env.NEXT_PUBLIC_MOBILE,
  } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>🎁 Free Credits Added to Your SportPredict Account!</title>
    
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
        
        /* PERFECT HEADER - Same as previous templates */
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
        
        /* Credits Display */
        .credits-badge {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border-radius: 50px;
            padding: 12px 32px;
            display: inline-block;
            font-weight: bold;
            font-size: 28px;
            margin: 10px 0;
            box-shadow: 0 6px 20px rgba(245, 87, 108, 0.3);
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
        
        /* Button Styles */
        .button-primary {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            min-width: 180px;
            transition: all 0.3s ease;
        }
        
        .button-secondary {
            display: inline-block;
            padding: 14px 32px;
            background: #667eea;
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            min-width: 180px;
            transition: all 0.3s ease;
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
            
            .credits-badge { 
                font-size: 22px; 
                padding: 10px 24px; 
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
        
        /* Additional Styles */
        .reason-box {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #764ba2;
        }
        
        .usage-guide {
            background: #fff5e6;
            border: 1px solid #ffcc80;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .terms-notice {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
        }
        
        .contact-support {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
    </style>
</head>

<body>
    <table class="wrapper" cellpadding="0" cellspacing="0" width="100%">

        <!-- PERFECT HEADER - Same as Previous Templates -->
        <tr>
            <td class="header">
                <h1><span>Sport</span>Predict</h1>
                <p>The future of sports predictions</p>
            </td>
        </tr>

        <!-- BODY CONTENT -->
        <tr>
            <td style="padding: 40px 32px;">

                <!-- Greeting -->
                <h2 style="font-size: 22px; margin-bottom: 20px; color: #1f2937;">
                    Hello ${user.name || "Valued User"},
                </h2>

                <!-- Introduction -->
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 25px;">
                    Great news! Our admin team has added <strong style="color: #f5576c;">${totalCreditsAdded} free credits</strong> to your SportPredict account.
                </p>

                <!-- CREDITS DISPLAY -->
                <table class="center-table" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
                    <tr>
                        <td style="padding: 40px 25px; text-align: center;">
                            <div style="font-size: 16px; opacity: 0.9; margin-bottom: 10px; letter-spacing: 1px;">
                                🎉 YOUR NEW CREDITS 🎉
                            </div>
                            <div class="credits-badge">
                                ${credits} CREDITS
                            </div>
                            <div style="font-size: 14px; opacity: 0.9; margin-top: 15px;">
                                Added on ${new Date().toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- REASON SECTION -->
                <div class="reason-box">
                    <h4 style="color: #764ba2; margin: 0 0 12px; font-size: 18px;">Why did you receive these credits?</h4>
                    <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0;">
                        ${reason}
                    </p>
                    <p style="font-size: 14px; color: #6b7280; margin-top: 12px; font-style: italic;">
                        — From ${adminName}
                    </p>
                </div>

                <!-- HOW TO USE -->
                <div class="usage-guide">
                    <h4 style="color: #e65100; margin: 0 0 20px; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                        <span>🚀</span> How to Use Your Credits:
                    </h4>
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td valign="top" width="48" style="padding: 8px 0;">
                                <div style="background: #e65100; color: white; width: 36px; height: 36px; border-radius: 50%; text-align: center; line-height: 36px; font-weight: bold; font-size: 16px;">1</div>
                            </td>
                            <td style="padding: 8px 0 8px 16px;">
                                <strong style="color: #1f2937; font-size: 16px;">Join Predictions</strong><br>
                                <span style="color: #6b7280; font-size: 14px;">Use credits to enter prediction contests and matches</span>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" width="48" style="padding: 8px 0;">
                                <div style="background: #e65100; color: white; width: 36px; height: 36px; border-radius: 50%; text-align: center; line-height: 36px; font-weight: bold; font-size: 16px;">2</div>
                            </td>
                            <td style="padding: 8px 0 8px 16px;">
                                <strong style="color: #1f2937; font-size: 16px;">Win Real Rewards</strong><br>
                                <span style="color: #6b7280; font-size: 14px;">Make accurate predictions to win exciting prizes</span>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" width="48" style="padding: 8px 0;">
                                <div style="background: #e65100; color: white; width: 36px; height: 36px; border-radius: 50%; text-align: center; line-height: 36px; font-weight: bold; font-size: 16px;">3</div>
                            </td>
                            <td style="padding: 8px 0 8px 16px;">
                                <strong style="color: #1f2937; font-size: 16px;">Check Balance</strong><br>
                                <span style="color: #6b7280; font-size: 14px;">Visit your dashboard anytime to track available credits</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- CTA BUTTONS -->
                <table cellpadding="0" cellspacing="0" width="100%" style="margin: 32px 0;">
                    <tr>
                        <td align="center">
                            <a href="${appUrl}/dashboard"
                               class="button-primary"
                               style="margin: 0 10px 10px 0;">
                                🚀 Start Predicting
                            </a>
                            <a href="${appUrl}/account/credits"
                               class="button-secondary"
                               style="margin: 0 0 10px 10px;">
                                💰 View Credits
                            </a>
                        </td>
                    </tr>
                </table>

                <!-- TERMS -->
                <div class="terms-notice">
                    <p style="font-size: 13px; color: #6b7280; margin: 0; line-height: 1.6;">
                        By using these credits, you agree to our 
                        <a href="${termsUrl}" style="color: #667eea; text-decoration: none; font-weight: 600;">Terms & Conditions</a>.
                        Credits are non-transferable and non-refundable.
                    </p>
                </div>

                <!-- CONTACT SUPPORT -->
                <div class="contact-support">
                    <p style="font-size: 15px; color: #4b5563; margin-bottom: 16px;">
                        Questions about your credits?
                    </p>
                    <a href="mailto:${supportEmail}"
                       style="display: inline-block; background: #374151; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600; transition: background 0.3s ease;">
                        📧 Contact Support
                    </a>
                </div>

                <!-- Closing -->
                <p style="margin-top: 32px; font-size: 16px; color: #1f2937;">
                    Happy predicting!<br />
                    <strong style="color: #667eea;">The SportPredict Team</strong>
                </p>

            </td>
        </tr>

        <!-- FOOTER -->
        <tr>
            <td class="footer">
                <div style="font-size: 22px; font-weight: bold; color: white; margin-bottom: 16px;">
                    SportPredict
                </div>
                
                <p style="margin: 20px 0; line-height: 1.8; color: #e5e7eb;">
                    📍 Predict. Win. Celebrate.<br />
                    📧 ${supportEmail || "support@sportpredict.com"}<br />
                    📞 ${supportPhone || "+1 (555) 123-4567"}
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
                    This is an automated message, please do not reply directly to this email.
                </div>
            </td>
        </tr>

    </table>
</body>
</html>`;
};
