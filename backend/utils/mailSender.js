import nodemailer from "nodemailer"

export const mailSender = async (email, title, body) => {
    try{
        let transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth:{
                pass : process.env.MAIL_PASS,
                user : process.env.MAIL_USER,
            }

        })
        //https://nodemailer.com/
        let info = await transporter.sendMail({
            from: 'MegaMart ||  by khushvant kumar',
            to:`${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log(info);
        return info;

    } catch(error) {
        // console.error(error);
        console.log(error.message);
    }
}

//module.exports = mailSender;