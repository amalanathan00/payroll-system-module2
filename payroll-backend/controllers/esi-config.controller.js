const ESIConfig = require("../models/ESIConfig");

exports.createESIConfig = async (req, res) => {
  try {
    const payload = {
      country: req.body.country,
      state: req.body.state,
      effectiveYear: Number(req.body.effectiveYear),
      applicableSalaryThreshold: Number(req.body.applicableSalaryThreshold),
      employeeContributionRate: Number(req.body.employeeContributionRate),
      employerContributionRate: Number(req.body.employerContributionRate),

      // ✅ DEFAULT SAFE VALUES
      monthlyCalculationAmount: req.body.monthlyCalculationAmount || 0,
      benefits: req.body.benefits || {}
    };

    const config = new ESIConfig(payload);
    await config.save();

    res.status(201).json({
      success: true,
      message: "ESI configuration created",
      data: config
    });
  } catch (error) {
    console.error("ESI SAVE ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
