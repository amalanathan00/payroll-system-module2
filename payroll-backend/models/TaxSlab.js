const mongoose = require('mongoose');

const TaxSlabSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  financialYear: {
    type: String,  // Format: 2025-2026
    required: true
  },
  slabName: {
    type: String,
    required: true
  },
  
  // Slab ranges and rates
  slabs: [{
    minIncome: { type: Number, required: true },
    maxIncome: { type: Number, required: true },
    taxRate: { type: Number, required: true },  // percentage
    surcharge: { type: Number, default: 0 },
    cess: { type: Number, default: 0 }
  }],
  
  // Standard deductions
  standardDeduction: Number,
  basicExemptionLimit: Number,
  
  // Additional info
  description: String,
  applicableForRegime: {
    type: String,
    enum: ['OLD', 'NEW', 'BOTH'],
    default: 'OLD'
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
    default: 'ACTIVE'
  },
  
  version: { type: Number, default: 1 }
  
}, { timestamps: true });

TaxSlabSchema.index({ country: 1, financialYear: 1 });
TaxSlabSchema.index({ status: 1 });

module.exports = mongoose.model('TaxSlab', TaxSlabSchema);
