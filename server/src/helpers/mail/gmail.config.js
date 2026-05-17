const nodemailer = require('nodemailer')
const config = require('../../config')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_APP_PASSWORD,
  },
})

function isGmailConfigured() {
  return !!(config.GMAIL_USER && config.GMAIL_APP_PASSWORD)
}

module.exports = { transporter, isGmailConfigured }
