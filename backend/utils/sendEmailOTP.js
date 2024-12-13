const nodemailer = require("nodemailer");

async function sendEmailOTP(email, otp) {
  // Luo yhteys sähköpostipalvelimeen
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "hamalainen.don@gmail.com", // Sähköpostiosoitteesi
      pass: "your-email-password", // Salasanasi
    },
  });

  // Viestin tiedot
  const mailOptions = {
    from: '"Matsi Support" <no-reply@matsi.com>', // Lähettäjän nimi ja sähköpostiosoite
    to: email, // Vastaanottajan sähköpostiosoite
    subject: "Your OTP Code", // Viestin otsikko
    text: `Your OTP code is ${otp}. It will expire in 60 seconds.`, // Viestin teksti
    html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 60 seconds.</p>`, // Viestin HTML-versio
  };

  // Lähetä sähköposti
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    return false;
  }
}
