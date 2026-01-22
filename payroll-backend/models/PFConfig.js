const mongoose = require('mongoose');

const PFConfigSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  effectiveYear: { type: Number, required: true },
  
  // PF Details
  pfName: String,
  pfRegistration: String,
  
  // Threshold & Applicability
  applicableSalaryThreshold: Number,  // Basic + DA
  isContributoryPF: { type: Boolean, default: true },
  
  // Contribution rates
  employeeContributionRate: { type: Number, required: true },  // %
  employerContributionRate: { type: Number, required: true },  // %
  adminChargeRate: { type: Number, default: 0.5 },  // %
  
  // Investment options
  investmentOptions: [{
    name: String,
    rate: Number,
    type: { type: String, enum: ['INTEREST', 'MARKET_LINKED'] }
  }],
  
  // Rules
  minContributionMonths: Number,
  vesting: {
    fullyVested: Number,      // years
    partiallyVested: Number   // years
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  }
  
}, { timestamps: true });

PFConfigSchema.index({ country: 1, state: 1, effectiveYear: 1 });

module.exports = mongoose.model('PFConfig', PFConfigSchema);
