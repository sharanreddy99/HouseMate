const nodemailer = require('nodemailer')
require('dotenv').config()

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'Oauth2',
        user: process.env.HOUSEMATE_NODE_EMAIL,
        clientId: process.env.HOUSEMATE_NODE_CLIENT_ID,
        clientSecret: process.env.HOUSEMATE_NODE_CLIENT_SECRET,
        refreshToken: process.env.HOUSEMATE_NODE_REFRESH_TOKEN
    }
})

module.exports = transporter