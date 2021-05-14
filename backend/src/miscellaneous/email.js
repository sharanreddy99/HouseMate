const nodemailer = require('nodemailer')
require('dotenv').config()

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'Oauth2',
        user: 'sharanreddyfake@gmail.com',
        clientId: '197090681501-omurpmt53rhpbr0coqqh8smpfdrcfa27.apps.googleusercontent.com',
        clientSecret: 'vqAyZL5nHYQ-W55TYN263Kae',
        refreshToken: '1//04aYVQDq46ApZCgYIARAAGAQSNwF-L9IrRMJeVJrqPj6Geopr2ihHa3zu0L37WECmsnW_ASBHyCKMpwipgz0dY6kRQN8xOqumYUE'
    
    }
})

module.exports = transporter