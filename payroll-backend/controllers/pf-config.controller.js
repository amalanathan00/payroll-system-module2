const PFConfig = require('../models/PFConfig');

exports.createPFConfig = async (req, res) => {
  try {
    const {
      country,
      state,
      effectiveYear,
      employeeContributionRate,
      employerContributionRate,
      applicableSalaryThreshold
    } = req.body;

    if (!country || !state || !effectiveYear || !employeeContributionRate || !employerContributionRate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const newPFConfig = new PFConfig({
      country,
      state,
      effectiveYear,
      employeeContributionRate,
      employerContributionRate,
      applicableSalaryThreshold,
      createdBy: req.session.userId
    });

    await newPFConfig.save();

    res.status(201).json({
      success: true,
      message: 'PF configuration created successfully',
      data: newPFConfig
    });
  } catch (error) {
    console.error('Error creating PF config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create PF configuration',
      error: error.message
    });
  }
};

exports.getPFConfig = async (req, res) => {
  try {
    const { country, state, year } = req.query;

    const filter = { status: 'ACTIVE' };
    if (country) filter.country = country;
    if (state) filter.state = state;
    if (year) filter.effectiveYear = parseInt(year);

    const pfConfig = await PFConfig.findOne(filter);

    if (!pfConfig) {
      return res.status(404).json({
        success: false,
        message: 'PF configuration not found'
      });
    }

    res.json({
      success: true,
      data: pfConfig
    });
  } catch (error) {
    console.error('Error fetching PF config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PF configuration',
      error: error.message
    });
  }
};

exports.calculatePFDeduction = async (req, res) => {
  try {
    const { baseSalary, dearness, state, year } = req.body;

    if (!baseSalary || !state || !year) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: baseSalary, state, year'
      });
    }

    const pfConfig = await PFConfig.findOne({
      state,
      effectiveYear: year,
      status: 'ACTIVE'
    });

    if (!pfConfig) {
      return res.status(404).json({
        success: false,
        message: 'PF configuration not found'
      });
    }

    // Calculate PF eligible salary (Basic + DA)
    const pfEligible = baseSalary + (dearness || 0);

    if (pfEligible < pfConfig.applicableSalaryThreshold) {
      return res.json({
        success: true,
        data: {
          baseSalary,
          dearness,
          pfEligible,
          applicable: false,
          message: 'Salary below PF threshold, no contribution required'
        }
      });
    }

    const employeeContribution = (pfEligible * pfConfig.employeeContributionRate) / 100;
    const employerContribution = (pfEligible * pfConfig.employerContributionRate) / 100;
    const adminCharge = (pfEligible * pfConfig.adminChargeRate) / 100;

    res.json({
      success: true,
      data: {
        baseSalary,
        dearness,
        pfEligible,
        employeeContribution: Math.round(employeeContribution),
        employerContribution: Math.round(employerContribution),
        adminCharge: Math.round(adminCharge),
        totalPFCredit: Math.round(employeeContribution + employerContribution),
        applicable: true
      }
    });
  } catch (error) {
    console.error('Error calculating PF deduction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate PF deduction',
      error: error.message
    });
  }
};
