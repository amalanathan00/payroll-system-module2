const TaxSlab = require('../models/TaxSlab');

exports.createTaxSlab = async (req, res) => {
  try {
    const {
      country,
      financialYear,
      slabName,
      slabs,
      standardDeduction,
      basicExemptionLimit,
      applicableForRegime
    } = req.body;

    // Validation
    if (!country || !financialYear || !slabs || slabs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields or empty slabs array'
      });
    }

    // Validate slab ranges don't overlap
    const sortedSlabs = [...slabs].sort((a, b) => a.minIncome - b.minIncome);
    for (let i = 0; i < sortedSlabs.length - 1; i++) {
      if (sortedSlabs[i].maxIncome >= sortedSlabs[i + 1].minIncome) {
        return res.status(400).json({
          success: false,
          message: 'Tax slab ranges overlap. Please verify the ranges.'
        });
      }
    }

    const newTaxSlab = new TaxSlab({
      country,
      financialYear,
      slabName,
      slabs: sortedSlabs,
      standardDeduction,
      basicExemptionLimit,
      applicableForRegime,
      createdBy: req.session.userId
    });

    await newTaxSlab.save();

    res.status(201).json({
      success: true,
      message: 'Tax slab created successfully',
      data: newTaxSlab
    });
  } catch (error) {
    console.error('Error creating tax slab:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tax slab',
      error: error.message
    });
  }
};

exports.getTaxSlabs = async (req, res) => {
  try {
    const { country, financialYear, regime } = req.query;

    const filter = { status: 'ACTIVE' };
    if (country) filter.country = country;
    if (financialYear) filter.financialYear = financialYear;
    if (regime) filter.applicableForRegime = regime;

    const taxSlabs = await TaxSlab.find(filter)
      .populate('createdBy', 'email')
      .sort({ financialYear: -1 });

    res.json({
      success: true,
      data: taxSlabs
    });
  } catch (error) {
    console.error('Error fetching tax slabs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tax slabs',
      error: error.message
    });
  }
};

exports.calculateTax = async (req, res) => {
  try {
    const {
      grossSalary,
      financialYear,
      country,
      regime = 'OLD'
    } = req.body;

    if (!grossSalary || !financialYear || !country) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: grossSalary, financialYear, country'
      });
    }

    // Find applicable tax slab
    const taxSlab = await TaxSlab.findOne({
      country,
      financialYear,
      status: 'ACTIVE',
      $or: [
        { applicableForRegime: regime },
        { applicableForRegime: 'BOTH' }
      ]
    });

    if (!taxSlab) {
      return res.status(404).json({
        success: false,
        message: 'Tax slab not found for the given criteria'
      });
    }

    // Calculate taxable income
    let taxableIncome = grossSalary - (taxSlab.standardDeduction || 0);
    if (taxableIncome < taxSlab.basicExemptionLimit) {
      taxableIncome = 0;
    }

    // Calculate tax based on slabs
    let tax = 0;
    let applicableSlab = null;

    for (const slab of taxSlab.slabs) {
      if (taxableIncome >= slab.minIncome && taxableIncome <= slab.maxIncome) {
        const taxableAmount = taxableIncome - slab.minIncome;
        tax = (taxableAmount * slab.taxRate) / 100;
        applicableSlab = slab;
        break;
      }
    }

    // Calculate surcharge and cess
    const surcharge = (tax * (applicableSlab?.surcharge || 0)) / 100;
    const cess = (tax * (applicableSlab?.cess || 0)) / 100;
    const totalTax = tax + surcharge + cess;

    res.json({
      success: true,
      data: {
        grossSalary,
        standardDeduction: taxSlab.standardDeduction,
        taxableIncome,
        tax: Math.round(tax),
        surcharge: Math.round(surcharge),
        cess: Math.round(cess),
        totalTax: Math.round(totalTax),
        netTakeHome: Math.round(grossSalary - totalTax),
        applicableSlab
      }
    });
  } catch (error) {
    console.error('Error calculating tax:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate tax',
      error: error.message
    });
  }
};
