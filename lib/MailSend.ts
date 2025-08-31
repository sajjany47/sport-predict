"use server";

import nodemailer from "nodemailer";

export const MailSend = async (data: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // 465 = secure, 587 = TLS
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.NEXT_PUBLIC_USER, // your Gmail address
        pass: process.env.NEXT_PUBLIC_PASSWORD, // your Gmail app password
      },
    });

    const send = await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_USER,
      to: data.to, // recipient
      subject: data.subject, // subject line
      html: data.html, // email body
    });

    return send;
  } catch (error) {
    return null;
  }
};
