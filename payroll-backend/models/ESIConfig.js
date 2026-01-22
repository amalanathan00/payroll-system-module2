const mongoose = require('mongoose');

const ESIConfigSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  effectiveYear: { type: Number, required: true },
  
  // ESI Details
  esiName: String,
  esiCode: String,
  
  // Threshold & Applicability
  applicableSalaryThreshold: Number,  // Monthly wage limit
  isOptional: { type: Boolean, default: false },
  
  // Contribution rates
  employeeContributionRate: { type: Number, required: true },  // %
  employerContributionRate: { type: Number, required: true },  // %
  
  // Benefits
  benefits: {
    sicknessBenefit: String,
    disabilityBenefit: String,
    medicalBenefit: String,
    dependencyBenefit: String
  },
  
  // Rules
  minimumWageForContribution: Number,
  maximumWageForContribution: Number,
  
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

ESIConfigSchema.index({ country: 1, state: 1, effectiveYear: 1 });

module.exports = mongoose.model('ESIConfig', ESIConfigSchema);
