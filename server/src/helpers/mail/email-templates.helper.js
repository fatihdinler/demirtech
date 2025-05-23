const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin:0;padding:0;background-color:#f2f2f2;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f2f2f2;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(90deg, #4CAF50, #45a049); padding: 20px;">
              <h1 style="color:#ffffff;font-size:24px;margin:0;">Verify Your Email</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:30px 40px;">
              <p style="font-size:16px;color:#333333;margin-bottom:20px;">Hello,</p>
              <p style="font-size:16px;color:#333333;margin-bottom:20px;">
                Thank you for signing up! Please use the verification code below to verify your email address:
              </p>
              <div style="text-align:center;margin:30px 0;">
                <span style="display:inline-block;background-color:#f9f9f9;border:1px solid #ddd;border-radius:4px;padding:15px 30px;font-size:28px;letter-spacing:5px;color:#4CAF50;">
                  {verificationCode}
                </span>
              </div>
              <p style="font-size:14px;color:#777777;margin-bottom:20px;">
                This code will expire in 15 minutes for security reasons.
              </p>
              <p style="font-size:14px;color:#777777;">
                If you didn't create an account, please ignore this email.
              </p>
              <p style="font-size:16px;color:#333333;margin-top:30px;">Best regards,<br>Your App Team</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f9f9f9;padding:15px;">
              <p style="font-size:12px;color:#888888;margin:0;">
                This is an automated message, please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="margin:0;padding:0;background-color:#f2f2f2;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f2f2f2;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(90deg, #4CAF50, #45a049); padding:20px;">
              <h1 style="color:#ffffff;font-size:24px;margin:0;">Password Reset Successful</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:30px 40px;">
              <p style="font-size:16px;color:#333333;margin-bottom:20px;">Hello,</p>
              <p style="font-size:16px;color:#333333;margin-bottom:20px;">
                We are writing to confirm that your password has been successfully reset.
              </p>
              <div style="text-align:center;margin:30px 0;">
                <div style="display:inline-block;background-color:#4CAF50;border-radius:50%;width:60px;height:60px;line-height:60px;text-align:center;font-size:30px;color:#ffffff;">
                  &#10003;
                </div>
              </div>
              <p style="font-size:14px;color:#777777;margin-bottom:20px;">
                If you did not initiate this password reset, please contact our support team immediately.
              </p>
              <ul style="padding-left:20px;margin-bottom:20px;color:#777777;font-size:14px;">
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication if available</li>
                <li>Avoid using the same password across multiple sites</li>
              </ul>
              <p style="font-size:16px;color:#333333;">
                Thank you for helping us keep your account secure.
              </p>
              <p style="font-size:16px;color:#333333;margin-top:30px;">Best regards,<br>Your App Team</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f9f9f9;padding:15px;">
              <p style="font-size:12px;color:#888888;margin:0;">
                This is an automated message, please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifre Sıfırlama Talebi</title>
  <style>
    body { margin: 0; padding: 0; background-color: #e0f7fa; font-family: Arial, sans-serif; }
    .container { width: 100%; background-color: #e0f7fa; padding: 20px 0; }
    .content { max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(90deg, #2196f3, #1e88e5); padding: 20px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 24px; margin: 0; }
    .body { padding: 30px 40px; color: #333333; }
    .body p { font-size: 16px; margin-bottom: 20px; }
    .button { text-align: center; margin: 30px 0; }
    .button a { background-color: #2196f3; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-size: 16px; }
    .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <div class="header">
        <h1>🔒 Şifre Sıfırlama Talebi</h1>
      </div>
      <div class="body">
        <p>Merhaba,</p>
        <p>Sistemde hesabınız için bir şifre sıfırlama talebi alındı. Eğer bu isteği siz yapmadıysanız, lütfen bu e-postayı görmezden gelin.</p>
        <p>Yeni şifrenizi belirlemek için aşağıdaki butona tıklayınız. 🚀</p>
        <div class="button">
          <a href="{resetURL}">Şifremi Sıfırla</a>
        </div>
        <p>Bu bağlantı güvenlik nedeniyle 1 saat içerisinde geçersiz hale gelecektir.</p>
        <p>Bağlantıya tıkladıktan sonra karşınıza çıkacak form üzerinden yeni şifrenizi belirleyebilirsiniz. Herhangi bir sorun yaşarsanız destek ekibimizle iletişime geçebilirsiniz. 💬</p>
        <p>İyi günler dileriz,</p>
        <p><strong>Your App Team</strong></p>
      </div>
      <div class="footer">
        <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen bu e-postaya yanıt vermeyiniz.</p>
      </div>
    </div>
  </div>
</body>
</html>
`

module.exports = {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
}