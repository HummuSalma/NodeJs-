const sgMail = require('@sendgrid/mail')
const sendgridApikey = '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'

sgMail.setApiKey(sendgridApikey)

const sendEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'hummusalma2003@gmail.com',
        subject: 'Thanks For Joining in!!',
        text: `Welcome to task-manager application, ${name}. Hope you like it`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'hummusalma2003@gmail.com',
        subject: 'Cancellation Mail',
        text: `Hi, ${name}. You've have deleted your account in task- manager application.`
    })
}

module.exports = {
    sendEmail,
    sendCancellationEmail
}