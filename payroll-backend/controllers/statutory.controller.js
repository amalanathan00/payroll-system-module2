const StatutoryRule = require("../models/StatutoryRule");

// CREATE
exports.createStatutoryRule = async (req, res) => {
  try {
    console.log("Incoming Statutory Payload:", req.body);

    const rule = new StatutoryRule({
      country: req.body.country,
      state: req.body.state,
      effectiveYear: req.body.effectiveYear,
      ruleType: req.body.ruleType,
      pf: req.body.pf,
      esi: req.body.esi,
      description: req.body.description,
      status: "ACTIVE"
    });

    await rule.save();

    res.status(201).json({
      success: true,
      data: rule,
      message: "Statutory rule created successfully"
    });
  } catch (error) {
    console.error("Statutory Create Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET
exports.getStatutoryRules = async (req, res) => {
  try {
    const { country, state, effectiveYear } = req.query;
    const filters = { status: "ACTIVE" };

    if (country)
      filters.country = new RegExp(`^${country}$`, "i");

    if (state)
      filters.state = new RegExp(state, "i");

    if (effectiveYear)
      filters.effectiveYear = Number(effectiveYear);

    const rules = await StatutoryRule.find(filters).sort({ createdAt: -1 });
    res.json({ success: true, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStatutoryRule = async (req, res) => {
  try {
    const { id } = req.params;

    await StatutoryRule.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Statutory rule deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

