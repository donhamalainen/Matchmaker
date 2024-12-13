function generateOTP(length = 6) {
  // const characters = "0123456789abcdef";
  // let otp = "";
  // for (let i = 0; i < length; i++) {
  //   otp += characters.charAt(Math.floor(Math.random() * characters.length));
  // }
  // return otp;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

module.exports = generateOTP;
