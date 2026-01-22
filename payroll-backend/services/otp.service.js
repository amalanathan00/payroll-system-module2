const redis = require("../config/redis");

exports.saveOTP = async (email, otp) => {
  await redis.set(`otp:${email}`, otp, { EX: 300 });
};

exports.verifyOTP = async (email, otp) => {
  const savedOtp = await redis.get(`otp:${email}`);
  return savedOtp === otp;
};
