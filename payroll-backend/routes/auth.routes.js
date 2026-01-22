const router = require("express").Router();

const {
  login,
  logout,
  me,
  registerEmployee,
  verifyEmployeeOtp,
  forgotPassword,
  resetPassword,
  getOrganization  
} = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/logout", logout);

router.post("/register-employee", registerEmployee);
router.post("/verify-employee-otp", verifyEmployeeOtp);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", me);
router.get("/organization/:orgId", getOrganization);  

module.exports = router;
