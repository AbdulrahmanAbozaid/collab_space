import { createTransport } from "nodemailer";

const send = async (to: string, subject: string, html: string, text?: string) => {
  try {
    const transporter = createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOpts = {
      to,
      subject,
      html,
      text,
      from: process.env.MAILER_USER,
    };

    const info = await transporter.sendMail(mailOpts);

    console.log(info.envelope);
    return {
      status: 200,
      success: info.accepted.length ? true : false,
      accepted: info.accepted[0],
      data: info.envelope,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error,
      success: false,
    };
  }
};

export default send;
