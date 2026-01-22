const { User, Organization } = require("../models");
const bcrypt = require("bcrypt");
const { saveOTP, verifyOTP } = require("../services/otp.service");
const { sendOTPEmail } = require("../services/email.service");
exports.registerOrg = async (req, res) => {
  const { orgName, adminEmail, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const orgExists = await Organization.findOne({ name: orgName });
  if (orgExists) {
    return res.status(400).json({ message: "Organization already exists" });
  }

  const userExists = await User.findOne({ email: adminEmail });
  if (userExists) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  await saveOTP(adminEmail, otp);

  const { sendOTPEmail } = require("../services/email.service");
  await sendOTPEmail(adminEmail, otp);

  res.json({ message: "OTP sent to admin email" });
};

exports.verifyOrgOtp = async (req, res) => {
  const { orgName, adminEmail, password, otp } = req.body;
  const valid = await verifyOTP(adminEmail, otp);
  if (!valid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  
  const orgCode = 'ORG' + Date.now() + Math.floor(Math.random() * 10000);
  
  const org = await Organization.create({ 
    name: orgName,
    orgCode: orgCode,  
    adminEmail: adminEmail
  });
  const hashed = await bcrypt.hash(password, 10);
const admin = await User.create({
  email: adminEmail,
  password: hashed,
  role: "SUPER_ADMIN",
  isVerified: true,
  orgId: org._id
});

// Auto-login
req.session.userId = admin._id;
req.session.role = admin.role;
req.session.orgId = org._id;

res.json({ message: "Organization registered & logged in" });
};  


exports.registerEmployee = async (req, res) => {
  const { email, role } = req.body;
  
  // ✅ Validate role
  const VALID_ROLES = ['EMPLOYEE', 'HR_ADMIN', 'FINANCE', 'PAYROLL_ADMIN'];
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  await saveOTP(email, otp);
  await sendOTPEmail(email, otp);
  
  res.json({ message: "OTP sent" });
};



exports.verifyEmployeeOtp = async (req, res) => {
  const { email, password, confirmPassword, otp, orgId, role } = req.body;
  
  
  const VALID_ROLES = ['EMPLOYEE', 'HR_ADMIN', 'FINANCE', 'PAYROLL_ADMIN'];
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const valid = await verifyOTP(email, otp);
  if (!valid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  
  if (role !== 'CONTROLLER') {
    let org;
    if (orgId.length === 24) {
      org = await Organization.findById(orgId);
    } else {
      org = await Organization.findOne({ orgCode: orgId });
    }

    if (!org || org.dormant) {
      return res.status(400).json({ message: "Invalid organization" });
    }
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashed,
    role: role,  
    isVerified: false,
    orgId: role === 'CONTROLLER' ? null : orgId  
  });

  req.session.userId = user._id;
  req.session.role = user.role;
  req.session.orgId = orgId || null;

  res.json({ message: "Employee registered & logged in" });
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.active) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!user.isVerified) {
    return res.status(403).json({ message: "User not verified" });
  }
  req.session.userId = user._id;
  req.session.role = user.role;
  req.session.orgId = user.orgId || null;

  res.json({
    message: "Login successful",
    sessionId: req.sessionID,  // ✅ ADD THIS LINE
    user: {
      email: user.email,
      role: user.role,
      orgId: user.orgId
    }
  });
};


exports.logout = async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
};


exports.me = async (req, res) => {
  if (!req.session.userId) {
    return res.json({ authenticated: false });
  }

  const user = await User.findById(req.session.userId)
    .select("-password")
    .populate("orgId", "name");

  res.json({
    authenticated: true,
    user
  });
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "If user exists, OTP sent" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  await saveOTP(email, otp);
  await sendOTPEmail(email, otp);

  res.json({ message: "OTP sent for password reset" });
};


exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const valid = await verifyOTP(email, otp);
  if (!valid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.updateOne(
    { email },
    { password: hashed }
  );

  res.json({ message: "Password reset successful" });
}



exports.getOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;
    const org = await Organization.findById(orgId);
    
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }
    
    res.json({ 
      organization: {
        _id: org._id,
        name: org.name,
        orgCode: org.orgCode,
        adminEmail: org.adminEmail,
        currency: org.currency,
        payCycle: org.payCycle,
        status: org.status,
        dormant: org.dormant
      }
    });
  } catch (err) {
    console.error('Error fetching organization:', err.message);
    res.status(500).json({ message: "Failed to fetch organization" });
  }
};
