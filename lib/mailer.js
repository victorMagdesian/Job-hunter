import nodemailer from 'nodemailer';

export async function sendMail({ host, port, user, pass, from, to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host, port,
    secure: port === 465,
    auth: { user, pass }
  });
  return transporter.sendMail({ from, to, subject, html });
}
