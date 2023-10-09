const sgMail = require('@sendgrid/mail')
const sendgridApikey = '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'

sgMail.setApiKey(sendgridApikey)

const sendEmail = (email, name)=>{
    sgMail.send({
        to : email,
        from : 'hummusalma2003@gmail.com',
        subject : 'Thanks For Joining in!!',
        text : `Welcome to task-manager application, ${name}. Hope you like it`
    })
}

const sendCancellationEmail = (email,name)=>{
    sgMail.send({
        to : email,
        from : 'hummusalma2003@gmail.com',
        subject : 'Cancellation Mail',
        text : `Hi, ${name}. You've have deleted your account in task- manager application.`
    })
}

module.exports ={
    sendEmail,
    sendCancellationEmail
}