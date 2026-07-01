export const UserAccountClosureTemp = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cricvista.com";
  const supportEmail =
    process.env.NEXT_PUBLIC_EMAIL || "support@cricvista.com";
  const supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (888) 123-4567";

  const isBanned = data.status === "banned";

  const config = isBanned
    ? {
        icon: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
        color: "#dc2626",
        bg: "#fef2f2",
        title: "Account Permanently Banned",
        subtitle: "Access has been permanently revoked",
      }
    : {
        icon: "https://cdn-icons-png.flaticon.com/512/3184/3184839.png",
        color: "#f59e0b",
        bg: "#fffbeb",
        title: "Account Temporarily Suspended",
        subtitle: "Access has been temporarily restricted",
      };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CricVista Account Status</title>
</head>

<body style="margin:0;padding:20px;background:${
    config.bg
  };font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<!-- MAIN WRAPPER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">

<!-- HEADER -->
<tr>
<td align="center" style="padding:30px;background:#1a2a6c;color:white;">
  <h1 style="margin:0;font-size:32px;">
    <span style="color:#fdbb2d;">Cric</span>Vista
  </h1>
  <p style="margin:6px 0 0;font-size:14px;">the future of cricket intelligence</p>
</td>
</tr>

<!-- ICON -->
<tr>
<td align="center" style="padding:30px 20px 10px;">
  <table width="120" height="120" cellpadding="0" cellspacing="0" style="background:${
    config.color
  };border-radius:60px;">
    <tr>
      <td align="center" valign="middle">
        <img src="${
          config.icon
        }" width="56" height="56" style="display:block;" />
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- TITLE -->
<tr>
<td align="center" style="padding:10px 20px;">
  <h2 style="margin:0;color:${config.color};">${config.title}</h2>
  <p style="margin:6px 0;color:#6b7280;">${config.subtitle}</p>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:30px 32px;color:#374151;">

<p style="font-size:16px;">
Hello <strong>${data.username}</strong>,
</p>

<p style="font-size:16px;line-height:1.6;">
Your CricVista account has been 
<strong style="color:${config.color};">
${isBanned ? "permanently banned" : "temporarily suspended"}
</strong>
due to a violation of our Terms of Service.
</p>

<!-- DETAILS -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
<tr>
<td width="50%" style="padding-bottom:12px;">
<strong>Username</strong><br/>${data.username}
</td>
<td width="50%" style="padding-bottom:12px;">
<strong>Status</strong><br/>${isBanned ? "Banned" : "Suspended"}
</td>
</tr>
<tr>
<td width="50%">
<strong>Date</strong><br/>${data.date}
</td>
<td width="50%">
<strong>User ID</strong><br/>${data.userId || "N/A"}
</td>
</tr>
</table>

<!-- REASON -->
<div style="margin-top:24px;padding:16px;border-left:4px solid ${
    config.color
  };background:#f9fafb;">
<strong>Reason:</strong><br/>
${data.reason}
</div>

<!-- BUTTONS -->
<div style="text-align:center;margin:30px 0;">
${
  !isBanned
    ? `<a href="${appUrl}/appeal" style="display:inline-block;margin:8px;padding:14px 28px;background:${config.color};color:white;text-decoration:none;border-radius:6px;">
        Appeal Suspension
      </a>`
    : ""
}
<a href="${appUrl}/terms" style="display:inline-block;margin:8px;padding:14px 28px;border:2px solid #1a2a6c;color:#1a2a6c;text-decoration:none;border-radius:6px;">
Terms of Service
</a>
</div>

<!-- SUPPORT -->
<div style="background:#f1f5f9;padding:20px;text-align:center;">
<p style="margin:0;">Need help?</p>
<p style="margin:8px 0;">
📧 <a href="mailto:${supportEmail}">${supportEmail}</a><br/>
📞 ${supportPhone}
</p>
</div>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="padding:20px;background:#1f2937;color:#d1d5db;">
<p style="margin:0;">© ${new Date().getFullYear()} CricVista</p>
<p style="font-size:12px;margin-top:6px;">This is an automated email. Please do not reply.</p>
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

export const UserWelcomeTemp = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cricvista.com";
  const supportEmail =
    process.env.NEXT_PUBLIC_EMAIL || "sportpredict247@gmail.com";
  const supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (888) 123-4567";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to CricVista</title>
</head>

<body style="margin:0;padding:20px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<!-- MAIN CONTAINER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">

<!-- HEADER -->
<tr>
<td align="center" style="background:#1a2a6c;padding:30px;color:white;">
  <h1 style="margin:0;font-size:32px;">
    <span style="color:#fdbb2d;">Cric</span>Vista
  </h1>
  <p style="margin-top:6px;font-size:14px;">the future of cricket intelligence</p>
</td>
</tr>

<!-- WELCOME BADGE -->
<tr>
<td align="center" style="padding:25px 20px;">
  <span style="background:#38a169;color:white;padding:10px 26px;border-radius:40px;font-size:14px;font-weight:bold;">
    🎉 WELCOME ABOARD 🎉
  </span>
</td>
</tr>

<!-- TITLE -->
<tr>
<td align="center" style="padding:0 20px;">
  <h2 style="margin:0;font-size:24px;color:#1f2937;">
    Your Winning Journey Begins Now
  </h2>
  <p style="color:#6b7280;font-size:16px;margin-top:10px;">
    Join thousands of sports enthusiasts gaining data-driven insights
  </p>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:30px 32px;color:#374151;">

<p style="font-size:16px;">Hello <strong>${
    data.username || "User"
  }</strong>,</p>

<p style="font-size:16px;line-height:1.6;">
Welcome to <strong>CricVista</strong>! Your account has been successfully created and you’re now ready to start your analytics journey.
</p>

<!-- ACCOUNT DETAILS -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;background:#f8f9fa;border:1px solid #e5e7eb;border-radius:8px;">
<tr>
<td style="padding:20px;">
<h3 style="margin-top:0;color:#1a2a6c;">👤 Account Details</h3>

<table width="100%" cellpadding="0" cellspacing="0">
<tr><td><strong>Username:</strong></td><td>${data.username}</td></tr>
<tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
<tr><td><strong>Mobile:</strong></td><td>${data.mobileNumber}</td></tr>
<tr><td><strong>Member Since:</strong></td><td>${data.joinDate}</td></tr>
<tr><td><strong>Status:</strong></td><td style="color:#16a34a;font-weight:bold;">Active ✅</td></tr>
<tr>
<td><strong>Starting Credits:</strong></td>
<td style="color:#f59e0b;font-weight:bold;">${
    data.initialCredits || 100
  } 🪙</td>
</tr>
</table>

</td>
</tr>
</table>

<!-- FEATURES -->
<h3 style="text-align:center;margin:30px 0 20px;color:#1f2937;">
What You Can Do
</h3>

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="50%" align="center" style="padding:12px;">
<div style="background:#fef3c7;padding:20px;border-radius:10px;">
<div style="font-size:30px;">🎯</div>
<strong>Explore Analytics</strong>
<p style="font-size:14px;">Predict cricket & football</p>
</div>
</td>
<td width="50%" align="center" style="padding:12px;">
<div style="background:#dbeafe;padding:20px;border-radius:10px;">
<div style="font-size:30px;">📊</div>
<strong>Track Performance</strong>
<p style="font-size:14px;">View analytics</p>
</div>
</td>
</tr>
<tr>
<td width="50%" align="center" style="padding:12px;">
<div style="background:#dcfce7;padding:20px;border-radius:10px;">
<div style="font-size:30px;">🏆</div>
<strong>Win Rewards</strong>
<p style="font-size:14px;">Earn credits</p>
</div>
</td>
<td width="50%" align="center" style="padding:12px;">
<div style="background:#f3e8ff;padding:20px;border-radius:10px;">
<div style="font-size:30px;">👥</div>
<strong>Join Community</strong>
<p style="font-size:14px;">Meet experts</p>
</div>
</td>
</tr>
</table>

<!-- CTA -->
<div style="margin:30px 0;text-align:center;background:#667eea;padding:30px;border-radius:10px;color:white;">
<h2>Ready to Start Predicting?</h2>
<p>Start your analysis now!</p>
<a href="${appUrl}/matches" style="display:inline-block;margin:10px;padding:14px 28px;background:white;color:#667eea;text-decoration:none;border-radius:6px;">
🚀 View Insights
</a>
</div>

<!-- SUPPORT -->
<div style="text-align:center;margin-top:30px;">
<p>Need help? Contact us anytime:</p>
<p>
📧 <a href="mailto:${supportEmail}">${supportEmail}</a><br/>
📞 ${supportPhone}
</p>
</div>

<p style="margin-top:30px;">
Welcome aboard!<br/>
<strong>The CricVista Team</strong>
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="background:#1f2937;padding:20px;color:#d1d5db;">
<p>© ${new Date().getFullYear()} CricVista</p>
<p style="font-size:12px;">This is an automated email. Please do not reply.</p>
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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cricvista.com";
  const supportEmail =
    process.env.NEXT_PUBLIC_EMAIL || "support@cricvista.com";
  const supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (888) 123-4567";

  const expiryMinutes = 5;
  const otp = a.otp || "123456";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verify Your Email - CricVista</title>
</head>

<body style="margin:0;padding:20px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<!-- MAIN WRAPPER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">

<!-- HEADER -->
<tr>
<td align="center" style="background:#1a2a6c;padding:30px;color:white;">
  <h1 style="margin:0;font-size:32px;">
    <span style="color:#fdbb2d;">Cric</span>Vista
  </h1>
  <p style="margin-top:6px;font-size:14px;opacity:0.9;">
    the future of cricket intelligence
  </p>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:32px;color:#374151;">

<h2 style="margin-top:0;font-size:22px;color:#1f2937;">
  Hello ${a.username || "User"},
</h2>

<p style="font-size:16px;line-height:1.6;">
Welcome to <strong>CricVista</strong>!  
To activate your account, please verify your email using the OTP below.
</p>

<!-- OTP BOX -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr>
<td align="center" style="background:#f8f9fa;border-radius:10px;padding:24px;border:1px dashed #1a2a6c;">

<p style="margin:0 0 10px;font-size:14px;color:#6b7280;letter-spacing:1px;">
YOUR VERIFICATION CODE
</p>

<div style="
  font-size:40px;
  font-weight:bold;
  letter-spacing:8px;
  color:#1a2a6c;
  font-family:'Courier New',monospace;
">
  ${otp}
</div>

<p style="margin-top:12px;font-size:14px;color:#6b7280;">
  Valid for <strong style="color:#dc2626;">${expiryMinutes} minutes</strong>
</p>

</td>
</tr>
</table>

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:20px 0;">
  <a href="${appUrl}/verify?otp=${otp}"
     style="
       background:#1a2a6c;
       color:#ffffff;
       text-decoration:none;
       padding:14px 28px;
       border-radius:6px;
       font-size:15px;
       font-weight:bold;
       display:inline-block;
     ">
     ✅ Verify & Activate Account
  </a>
</td>
</tr>
</table>

<!-- SECURITY NOTICE -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
<tr>
<td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:18px;">
  <p style="margin:0;font-size:14px;color:#7f1d1d;line-height:1.6;">
    <strong>🔒 Security Reminder</strong><br><br>
    Never share this OTP with anyone. CricVista will never ask for your OTP via phone, email, or message.
    If you didn’t request this verification, please ignore this email.
  </p>
</td>
</tr>
</table>

<!-- SUPPORT -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;border-top:1px solid #e5e7eb;">
<tr>
<td align="center" style="padding-top:20px;">
  <p style="font-size:15px;color:#4b5563;">
    Need help? Contact our support team
  </p>
  <p style="margin:8px 0;">
    📧 <a href="mailto:${supportEmail}" style="color:#1a2a6c;">${supportEmail}</a><br>
    📞 ${supportPhone}
  </p>
</td>
</tr>
</table>

<p style="margin-top:30px;font-size:16px;">
Best regards,<br>
<strong>The CricVista Team</strong>
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="background:#1f2937;color:#d1d5db;padding:20px;">
  <p style="margin:0;font-size:13px;">
    © ${new Date().getFullYear()} CricVista. All rights reserved.
  </p>
  <p style="margin-top:6px;font-size:12px;">
    This is an automated verification email. Please do not reply.
  </p>
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

export const AdminDepositCreditsEmail = (data: {
  user: {
    name?: string;
    email: string;
  };
  credits: number;
  totalCreditsAdded: number;
  amount: number;
  adminName?: string;
  appUrl?: string;
  supportEmail?: string;
  supportPhone?: string;
}) => {
  const {
    user,
    credits,
    totalCreditsAdded,
    amount,
    adminName = "CricVista Team",
    appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL,
    supportEmail = process.env.NEXT_PUBLIC_EMAIL || "support@cricvista.com",
    supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (555) 123-4567",
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deposit Confirmation - CricVista</title>
</head>

<body style="margin:0;padding:20px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<!-- MAIN WRAPPER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">

<!-- HEADER -->
<tr>
<td align="center" style="background:#1a2a6c;padding:30px;color:white;">
  <h1 style="margin:0;font-size:32px;">
    <span style="color:#fdbb2d;">Cric</span>Vista
  </h1>
  <p style="margin-top:6px;font-size:14px;opacity:0.9;">
    Deposit Confirmation
  </p>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:32px;color:#374151;">

<h2 style="margin-top:0;font-size:22px;color:#1f2937;">
  Hello ${user.name || "Valued User"},
</h2>

<p style="font-size:16px;line-height:1.6;">
Your deposit has been successfully processed! Thank you for your payment.
</p>

<!-- DEPOSIT DETAILS -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
<tr>
<td style="background:#f9fafb;padding:16px 24px;border-bottom:1px solid #e5e7eb;">
  <strong style="font-size:15px;color:#1f2937;">Deposit Summary</strong>
</td>
</tr>
<tr>
<td style="padding:16px 24px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:8px 0;font-size:14px;color:#6b7280;">Amount Paid</td>
      <td align="right" style="padding:8px 0;font-size:16px;font-weight:bold;color:#1f2937;">₹${amount.toLocaleString("en-IN")}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:14px;color:#6b7280;border-top:1px solid #f3f4f6;">Tokens Received</td>
      <td align="right" style="padding:8px 0;font-size:16px;font-weight:bold;color:#f5576c;border-top:1px solid #f3f4f6;">+${totalCreditsAdded} Tokens</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:14px;color:#6b7280;border-top:1px solid #f3f4f6;">Total Wallet Balance</td>
      <td align="right" style="padding:8px 0;font-size:16px;font-weight:bold;color:#10b981;border-top:1px solid #f3f4f6;">${credits} Tokens</td>
    </tr>
  </table>
</td>
</tr>
</table>

<!-- BALANCE HIGHLIGHT -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr>
<td align="center" style="background:#10b981;padding:30px;border-radius:10px;color:white;">
  <p style="margin:0;font-size:14px;letter-spacing:1px;">
    ✅ DEPOSIT SUCCESSFUL
  </p>
  <p style="margin:12px 0 0;font-size:32px;font-weight:bold;">
    ${credits} TOKENS
  </p>
  <p style="margin-top:10px;font-size:13px;opacity:0.9;">
    Current wallet balance
  </p>
</td>
</tr>
</table>

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
<tr>
<td align="center">
  <a href="${appUrl}/dashboard"
     style="background:#1a2a6c;color:white;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:bold;display:inline-block;margin-bottom:10px;">
     🚀 Go to Dashboard
  </a>
  <br>
  <a href="${appUrl}/matches"
     style="background:#667eea;color:white;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:bold;display:inline-block;">
     🏆 Start Predicting
  </a>
</td>
</tr>
</table>

<!-- SUPPORT -->
<p style="margin-top:24px;font-size:15px;text-align:center;">
Need help? Contact us at <br>
📧 <a href="mailto:${supportEmail}" style="color:#1a2a6c;">${supportEmail}</a><br>
📞 ${supportPhone}
</p>

<p style="margin-top:30px;font-size:16px;">
Happy predicting!<br>
<strong>The CricVista Team</strong>
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="background:#1f2937;color:#d1db;padding:20px;">
  <p style="margin:0;font-size:13px;">
    © ${new Date().getFullYear()} CricVista. All rights reserved.
  </p>
  <p style="margin-top:6px;font-size:12px;">
    This is an automated email. Please do not reply.
  </p>
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
    adminName = "CricVista Admin",
    termsUrl = process.env.NEXT_PUBLIC_API_URL + "/terms",
    appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL,
    supportEmail = process.env.NEXT_PUBLIC_EMAIL || "support@cricvista.com",
    supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (555) 123-4567",
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Free Credits Added - CricVista</title>
</head>

<body style="margin:0;padding:20px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<!-- MAIN WRAPPER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">

<!-- HEADER -->
<tr>
<td align="center" style="background:#1a2a6c;padding:30px;color:white;">
  <h1 style="margin:0;font-size:32px;">
    <span style="color:#fdbb2d;">Cric</span>Vista
  </h1>
  <p style="margin-top:6px;font-size:14px;opacity:0.9;">
    the future of cricket intelligence
  </p>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:32px;color:#374151;">

<h2 style="margin-top:0;font-size:22px;color:#1f2937;">
  Hello ${user.name || "Valued User"},
</h2>

<p style="font-size:16px;line-height:1.6;">
Great news! Our admin team has added 
<strong style="color:#f5576c;">${totalCreditsAdded} free credits</strong> 
to your CricVista account.
</p>

<!-- CREDIT HIGHLIGHT -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr>
<td align="center" style="background:#764ba2;padding:30px;border-radius:10px;color:white;">
  <p style="margin:0;font-size:14px;letter-spacing:1px;">
    🎉 YOUR CURRENT CREDIT BALANCE 🎉
  </p>
  <p style="margin:12px 0 0;font-size:32px;font-weight:bold;">
    ${credits} CREDITS
  </p>
  <p style="margin-top:10px;font-size:13px;opacity:0.9;">
    Added on ${new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
  </p>
</td>
</tr>
</table>

<!-- REASON -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr>
<td style="background:#f8f9fa;border-left:4px solid #764ba2;padding:20px;border-radius:6px;">
  <h4 style="margin:0 0 10px;color:#764ba2;">
    Why did you receive these credits?
  </h4>
  <p style="margin:0;font-size:15px;color:#4b5563;line-height:1.6;">
    ${reason}
  </p>
  <p style="margin-top:10px;font-size:13px;color:#6b7280;font-style:italic;">
    — ${adminName}
  </p>
</td>
</tr>
</table>

<!-- HOW TO USE -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr>
<td style="background:#fff5e6;border:1px solid #ffcc80;padding:20px;border-radius:8px;">
  <h4 style="margin-top:0;color:#e65100;">
    🚀 How to use your credits
  </h4>
  <ul style="padding-left:18px;color:#4b5563;font-size:14px;line-height:1.8;">
    <li>Join analytics features and matches</li>
    <li>Win rewards by gaining data-driven insights</li>
    <li>Track your credit balance in your dashboard</li>
  </ul>
</td>
</tr>
</table>

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
<tr>
<td align="center">
  <a href="${appUrl}/dashboard"
     style="background:#f5576c;color:white;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:bold;display:inline-block;margin-bottom:10px;">
     🚀 Start Predicting
  </a>
  <br>
  <a href="${appUrl}/account/credits"
     style="background:#667eea;color:white;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:bold;display:inline-block;">
     💰 View Credits
  </a>
</td>
</tr>
</table>

<!-- TERMS -->
<p style="font-size:13px;color:#6b7280;text-align:center;line-height:1.6;">
By using these credits, you agree to our 
<a href="${termsUrl}" style="color:#667eea;font-weight:bold;text-decoration:none;">
Terms & Conditions
</a>. Credits are non-transferable and non-refundable.
</p>

<!-- SUPPORT -->
<p style="margin-top:24px;font-size:15px;text-align:center;">
Questions? Contact us at <br>
📧 <a href="mailto:${supportEmail}" style="color:#1a2a6c;">${supportEmail}</a><br>
📞 ${supportPhone}
</p>

<p style="margin-top:30px;font-size:16px;">
Happy predicting!<br>
<strong>The CricVista Team</strong>
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="background:#1f2937;color:#d1d5db;padding:20px;">
  <p style="margin:0;font-size:13px;">
    © ${new Date().getFullYear()} CricVista. All rights reserved.
  </p>
  <p style="margin-top:6px;font-size:12px;">
    This is an automated email. Please do not reply.
  </p>
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
