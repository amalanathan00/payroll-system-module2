const router = require("express").Router();
const {
  registerOrg,
  verifyOrgOtp
} = require("../controllers/org.controller");

router.post("/register", registerOrg);
router.post("/verify-otp", verifyOrgOtp);

module.exports = router;
