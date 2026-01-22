const mongoose = require('mongoose');

const ProfessionalTaxConfigSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  effectiveYear: { type: Number, required: true },
  
  // PT Details
  ptName: String,
  
  // Threshold & Applicability
  applicableSalaryThreshold: Number,
  
  // Tax slabs
  taxSlabs: [{
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    taxAmount: { type: Number, required: true }  // Fixed amount per slab
  }],
  
  // Rules
  isDeductible: { type: Boolean, default: true },
  deductionLimit: Number,
  
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

ProfessionalTaxConfigSchema.index({ country: 1, state: 1, effectiveYear: 1 });

module.exports = mongoose.model('ProfessionalTaxConfig', ProfessionalTaxConfigSchema);
