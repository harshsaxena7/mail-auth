
const nodemailer = require("nodemailer")

const mailsend = async (subject, sentTo, content) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "kinshuk26harsh", // generated ethereal user
            pass: "wniahipldvixjkko", // generated ethereal password
        },
    });


    console.log("resp", transporter)

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Harsh" <kinshuk26harsh@gmail.com>', // sender address
        to: sentTo, // list of receivers
        subject: subject, // Subject line
        html: content, // html body
    });

    return info;
}

module.exports = {
    mailsend
};