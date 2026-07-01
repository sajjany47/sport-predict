export const ResetPasswordTem = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cricvista.com";
  const supportEmail =
    process.env.NEXT_PUBLIC_EMAIL || "support@cricvista.com";
  const supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (888) 123-4567";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset OTP - CricVista</title>
</head>

<body style="margin:0;padding:20px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<!-- WRAPPER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">

<!-- HEADER -->
<tr>
<td align="center" style="background:#1a2a6c;padding:30px;color:#ffffff;">
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

<!-- ICON -->
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding-bottom:20px;">
  <table width="100" height="100" cellpadding="0" cellspacing="0" style="background:#667eea;border-radius:50%;">
    <tr>
      <td align="center" valign="middle">
        <img src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png"
             width="48" height="48"
             style="display:block;">
      </td>
    </tr>
  </table>
</td>
</tr>
</table>

<h2 style="text-align:center;margin:0;font-size:24px;color:#1f2937;">
  Verify Your Identity
</h2>

<p style="text-align:center;color:#6b7280;font-size:16px;margin-top:8px;">
  Secure password reset request
</p>

<h3 style="margin-top:30px;font-size:20px;color:#1f2937;">
  Hello ${data.username || "User"},
</h3>

<p style="font-size:16px;line-height:1.6;color:#4b5563;">
You requested to reset your CricVista password.  
Please use the One-Time Password (OTP) below to continue.
</p>

<!-- OTP BOX -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
<tr>
<td align="center">

<p style="font-size:13px;color:#6b7280;letter-spacing:1px;margin-bottom:8px;">
YOUR ONE-TIME PASSWORD
</p>

<div style="
  display:inline-block;
  font-size:36px;
  font-weight:bold;
  letter-spacing:8px;
  color:#1a2a6c;
  background:#f8f9fa;
  border:2px dashed #1a2a6c;
  padding:16px 24px;
  border-radius:8px;
  font-family:Courier,monospace;
">
  ${data.otp || "123456"}
</div>

<p style="margin-top:12px;font-size:14px;color:#6b7280;">
Valid for <strong style="color:#dc2626;">10 minutes</strong>
</p>

</td>
</tr>
</table>

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
<tr>
<td align="center">
  <a href="${appUrl}/reset-password?otp=${data.otp || "123456"}"
     style="
       background:#1a2a6c;
       color:#ffffff;
       text-decoration:none;
       padding:14px 32px;
       border-radius:6px;
       font-weight:bold;
       display:inline-block;
     ">
    🔐 Reset Password
  </a>
</td>
</tr>
</table>

<!-- SECURITY NOTICE -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr>
<td style="background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #dc2626;padding:18px;border-radius:6px;">
  <h4 style="margin:0 0 8px;color:#b91c1c;">
    🔒 Security Reminder
  </h4>
  <p style="margin:0;font-size:14px;color:#7f1d1d;line-height:1.6;">
    Never share this OTP with anyone.  
    CricVista will never ask for your password or OTP.  
    If you didn’t request this reset, please ignore this email.
  </p>
</td>
</tr>
</table>

<!-- HELP -->
<p style="font-size:15px;text-align:center;margin-top:24px;">
Need help? Contact us:<br>
📧 <a href="mailto:${supportEmail}" style="color:#1a2a6c;">${supportEmail}</a><br>
📞 ${supportPhone}
</p>

<p style="margin-top:28px;font-size:16px;">
Stay secure,<br>
<strong>The CricVista Security Team</strong>
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
    This is an automated security email. Please do not reply.
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

export const ResetPasswordSuccessTem = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cricvista.com";
  const supportEmail =
    process.env.NEXT_PUBLIC_EMAIL || "support@cricvista.com";
  const supportPhone = process.env.NEXT_PUBLIC_MOBILE || "+1 (888) 123-4567";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset Successful - CricVista</title>
</head>

<body style="margin:0;padding:20px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<!-- WRAPPER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">

<!-- HEADER -->
<tr>
<td align="center" style="background:#1a2a6c;padding:30px;color:#ffffff;">
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

<!-- SUCCESS ICON -->
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding-bottom:20px;">
  <table width="100" height="100" cellpadding="0" cellspacing="0" style="background:#10b981;border-radius:50%;">
    <tr>
      <td align="center" valign="middle">
        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
             width="48" height="48"
             style="display:block;">
      </td>
    </tr>
  </table>
</td>
</tr>
</table>

<!-- BADGE -->
<p style="
  display:inline-block;
  background:#10b981;
  color:#ffffff;
  padding:8px 20px;
  border-radius:20px;
  font-size:13px;
  font-weight:bold;
  letter-spacing:1px;
  margin-bottom:16px;
">
  ✅ PASSWORD RESET SUCCESSFUL
</p>

<h2 style="text-align:center;margin:0;font-size:24px;color:#1f2937;">
  Your Account is Now Secure
</h2>

<p style="text-align:center;color:#6b7280;font-size:16px;margin-top:8px;">
  You can now log in using your new password
</p>

<h3 style="margin-top:30px;font-size:20px;color:#1f2937;">
  Hello ${data.username || "User"},
</h3>

<p style="font-size:16px;line-height:1.6;color:#4b5563;">
Your CricVista password has been successfully reset.
</p>

<p style="font-size:16px;line-height:1.6;color:#4b5563;">
If you did not initiate this change, please contact our support team immediately.
</p>

<!-- ACCOUNT INFO -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr>
<td align="center" style="background:#f8fafc;border:1px dashed #1a2a6c;padding:16px;border-radius:6px;">
  <p style="margin:0;font-size:13px;color:#6b7280;letter-spacing:1px;">
    ACCOUNT EMAIL
  </p>
  <p style="margin-top:6px;font-size:16px;font-weight:bold;color:#1a2a6c;">
    ${data.email}
  </p>
</td>
</tr>
</table>

<!-- CTA BUTTONS -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
<tr>
<td align="center">
  <a href="${appUrl}/login"
     style="
       background:#1a2a6c;
       color:#ffffff;
       text-decoration:none;
       padding:14px 30px;
       border-radius:6px;
       font-weight:bold;
       display:inline-block;
       margin-bottom:10px;
     ">
    🔐 Log In
  </a>
  <br>
  <a href="${appUrl}/dashboard"
     style="
       border:2px solid #1a2a6c;
       color:#1a2a6c;
       text-decoration:none;
       padding:12px 28px;
       border-radius:6px;
       font-weight:bold;
       display:inline-block;
     ">
    📊 Go to Dashboard
  </a>
</td>
</tr>
</table>

<!-- SECURITY TIPS -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr>
<td style="background:#fef3c7;border:1px solid #fde68a;border-radius:6px;padding:18px;">
  <h4 style="margin:0 0 10px;color:#92400e;">
    🔒 Security Tips
  </h4>
  <ul style="margin:0;padding-left:18px;color:#92400e;font-size:14px;line-height:1.6;">
    <li>Use a strong, unique password</li>
    <li>Never share your login details</li>
    <li>Log out from shared devices</li>
    <li>Update your password periodically</li>
  </ul>
</td>
</tr>
</table>

<!-- SUPPORT -->
<p style="font-size:15px;text-align:center;margin-top:24px;">
Need help? Contact us:<br>
📧 <a href="mailto:${supportEmail}" style="color:#1a2a6c;">${supportEmail}</a><br>
📞 ${supportPhone}
</p>

<p style="margin-top:28px;font-size:16px;">
Stay safe,<br>
<strong>The CricVista Security Team</strong>
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
    This is an automated security notification. Please do not reply.
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
