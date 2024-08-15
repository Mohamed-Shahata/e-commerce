const nodemailer = require("nodemailer");

const trnasporter = nodemailer.createTransport({
  service: "gmail",
  auth:{
    user: process.env.USER_EMAIL,
    pass: process.env.PASS_USER_EMAIL
  }
});

const sendVerificationCode = (email , code) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Confirm your account",
    text: `using this code '${code}' to activate your account`
  }
  return trnasporter.sendMail(mailOptions , (err , success) => {
    if(err){
      console.log(err);
    }else{
      console.log("Email sent: " + success.response);
    }
  })
};

module.exports = {
  sendVerificationCode
}