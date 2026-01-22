const mongoose = require('mongoose');

const StatutoryRuleSchema = new mongoose.Schema({
  country: {
    type: String,
    enum: ['India', 'USA', 'UK'],
    required: true
  },
  state: {
    type: String,
    required: true
  },
  effectiveYear: {
    type: Number,
    required: true
  },
  ruleType: {
    type: String,
    enum: ['PF_THRESHOLD', 'ESI_THRESHOLD', 'PT_THRESHOLD', 'INCOME_TAX'],
    required: true
  },
  description: String,
  
  // Thresholds
  minSalary: Number,
  maxSalary: Number,
  effectiveFrom: Date,
  effectiveTo: Date,
  
  // Contribution rates (percentage)
  employeeContribution: Number,
  employerContribution: Number,
  adminCharge: { type: Number, default: 0.5 },
  
  // Rules
  isOptional: { type: Boolean, default: false },
  applicableToAll: { type: Boolean, default: true },
  
  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
    default: 'ACTIVE'
  },
  
  version: { type: Number, default: 1 },
  previousVersionId: mongoose.Schema.Types.ObjectId
  
}, { timestamps: true });

// Index for faster queries
StatutoryRuleSchema.index({ country: 1, state: 1, effectiveYear: 1, ruleType: 1 });
StatutoryRuleSchema.index({ status: 1, effectiveYear: 1 });

module.exports = mongoose.model('StatutoryRule', StatutoryRuleSchema);
