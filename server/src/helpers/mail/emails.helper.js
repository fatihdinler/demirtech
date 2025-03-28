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

module.exports = {
  sendVerificationMail,
}