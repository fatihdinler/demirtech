const { client, sender } = require('./mailtrap.config')
const { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } = require('./email-templates.helper')

const sendVerificationMail = async (email, verificationToken) => {
  const recipients = [{ email }]

  try {
    const response = await client.send({
      from: sender,
      to: recipients,
      subject: `Welcome to Demirtech, Please Verify Your Mail!`,
      html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
      category: 'Email Verification',
    })
    console.log(`>>> e-mail is sent successfully to the user:`, response)
  } catch (error) {
    console.log(`>>> Error sending email: ${error}`)
    throw new Error(`Error sending email: ${error}`)
  }
}

const sendWelcomeMail = async (email, username) => {
  const recipients = [{ email }]

  try {
    const response = await client.send({
      from: sender,
      to: recipients,
      subject: `${username}, Welcome to Demirtech, Your Account is Verified!`,
      text: 'Replace this text with some informative texts',
      category: 'Email Verification',
    })
    console.log(`>>> e-mail is sent successfully to the user:`, response)
  } catch (error) {
    console.log(`>>> Error sending email: ${error}`)
    throw new Error(`Error sending email: ${error}`)
  }
}

const sendPasswordResetEmail = async (email, resetUrl) => {
  const recipients = [{ email }]

  try {
    const response = await client.send({
      from: sender,
      to: recipients,
      subject: 'Your Reset Password Link is Ready! 🔑',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetUrl),
      category: 'Password Reset',
    })
    console.log(`>>> E-posta başarıyla gönderildi:`, response)
  } catch (error) {
    console.log(`>>> E-posta gönderilirken hata oluştu: ${error}`)
    throw new Error(`E-posta gönderilirken hata: ${error}`)
  }
}

const sendResetSuccessEmail = async (email) => {
  const recipients = [{ email }]

  try {
    const response = await client.send({
      from: sender,
      to: recipients,
      subject: 'Password Reset Successfully! 🔑',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: 'Password Reset',
    })
    console.log(`>>> E-posta başarıyla gönderildi:`, response)
  } catch (error) {
    console.log(`>>> E-posta gönderilirken hata oluştu: ${error}`)
    throw new Error(`E-posta gönderilirken hata: ${error}`)
  }
}

module.exports = {
  sendVerificationMail,
  sendWelcomeMail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
}