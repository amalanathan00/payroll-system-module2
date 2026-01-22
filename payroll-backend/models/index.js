const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, select: false },
  role: {
    type: String,
    enum: [
      "controller",
      "SUPER_ADMIN",
      "PAYROLL_ADMIN",
      "HR_ADMIN",
      "EMPLOYEE",
      "FINANCE"
    ],
    default: "PAYROLL_ADMIN"
  },
  isVerified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    default: null
  }
}, { timestamps: true });

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  address: String,
  contactEmail: String,
  mobile: String,
  orgCode: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => 'ORG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
  },
  adminEmail: String,
  dormant: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
  dormant: { type: Boolean, default: false },
  payCycle: {
    type: String,
    enum: ["MONTHLY", "BI_WEEKLY"],
    default: "MONTHLY"
  },
  currency: { type: String, default: "INR" }
}, { timestamps: true });

module.exports = {
  User: mongoose.model("User", UserSchema),
  Organization: mongoose.model("Organization", OrganizationSchema)
};

