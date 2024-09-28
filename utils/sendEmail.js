import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS_USER_EMAIL,
  },
  tls: {
    rejectUnauthorized: false, // Add this to accept self-signed certificates
  },
});

const sendVerificationCode = async (email, code) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Confirm your account",
    text: `using this code '${code}' to activate your account`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (err) {
    console.error("Error sending email: ", err);
  }
};

export { sendVerificationCode };
