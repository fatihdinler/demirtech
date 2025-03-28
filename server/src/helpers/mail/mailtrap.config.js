const { MailtrapClient } = require('mailtrap')
const config = require('../../config')

const client = new MailtrapClient({
  endpoint: config.DEMIRTECH_MAILTRAP_ENDPOINT,
  token: config.DEMIRTECH_MAILTRAP_TOKEN,
})

const sender = {
  email: 'hello@demomailtrap.co',
  name: 'Demirtech R&D Team',
}

module.exports = {
  client,
  sender,
}