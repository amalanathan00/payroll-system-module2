const { 
  CountryStatutoryRules, 
  TaxSlab, 
  DeductionRules,
  ComplianceAuditLog
} = require("../models");


// ============ STATUTORY RULES CONTROLLERS ============


const createStatutoryRules = async (req, res) => {
  try {
    const { country, state, pf, esi, professionalTax, incomeTax, bonusGratuity, leaveRules } = req.body;
    const orgId = req.session.orgId;
    const userId = req.session.userId;


    if (!country || !state) {
      return res.status(400).json({ message: "Country and State are required" });
    }


    const existingRules = await CountryStatutoryRules.findOne({
      orgId,
      country,
      state,
      status: "ACTIVE"
    });


    if (existingRules) {
      return res.status(400).json({ message: "Active rules already exist for this state" });
    }


    const rules = await CountryStatutoryRules.create({
      country,
      state,
      orgId,
      pf,
      esi,
      professionalTax,
      incomeTax,
      bonusGratuity,
      leaveRules,
      createdBy: userId
    });


    await ComplianceAuditLog.create({
      orgId,
      actionType: "CREATE",
      module: "STATUTORY_RULES",
      resourceId: rules._id,
      changes: { after: rules.toObject() },
      userId
    });


    res.status(201).json({
      success: true,
      message: "Statutory rules created successfully",
      data: rules
    });
  } catch (error) {
    console.error("Error creating statutory rules:", error);
    res.status(500).json({ message: "Failed to create statutory rules", error: error.message });
  }
};


const getStatutoryRules = async (req, res) => {
  try {
    const { country, state } = req.query;
    const orgId = req.session.orgId;


    const query = { orgId };
    if (country) query.country = country;
    if (state) query.state = state;
    query.status = "ACTIVE";


    const rules = await CountryStatutoryRules.find(query)
      .populate("createdBy", "email")
      .sort({ createdAt: -1 });


    res.json({
      success: true,
      data: rules
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch statutory rules", error: error.message });
  }
};


const getStatutoryRulesById = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const orgId = req.session.orgId;


    const rules = await CountryStatutoryRules.findOne({
      _id: ruleId,
      orgId
    }).populate("createdBy", "email");


    if (!rules) {
      return res.status(404).json({ message: "Statutory rules not found" });
    }


    res.json({
      success: true,
      data: rules
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch statutory rules", error: error.message });
  }
};


const updateStatutoryRules = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const orgId = req.session.orgId;
    const userId = req.session.userId;
    const updateData = req.body;


    const oldRules = await CountryStatutoryRules.findOne({ _id: ruleId, orgId });
    if (!oldRules) {
      return res.status(404).json({ message: "Statutory rules not found" });
    }


    const oldData = oldRules.toObject();
    updateData.versionNumber = oldRules.versionNumber + 1;
    updateData.updatedBy = userId;


    const updatedRules = await CountryStatutoryRules.findByIdAndUpdate(
      ruleId,
      updateData,
      { new: true }
    );


    await ComplianceAuditLog.create({
      orgId,
      actionType: "UPDATE",
      module: "STATUTORY_RULES",
      resourceId: ruleId,
      changes: { before: oldData, after: updatedRules.toObject() },
      userId,
      reason: req.body.reason || "Rule updated"
    });


    res.json({
      success: true,
      message: "Statutory rules updated successfully",
      data: updatedRules
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update statutory rules", error: error.message });
  }
};


const deleteStatutoryRules = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const orgId = req.session.orgId;
    const userId = req.session.userId;


    const rules = await CountryStatutoryRules.findOne({ _id: ruleId, orgId });
    if (!rules) {
      return res.status(404).json({ message: "Statutory rules not found" });
    }


    await CountryStatutoryRules.findByIdAndUpdate(
      ruleId,
      { status: "INACTIVE", updatedBy: userId },
      { new: true }
    );


    await ComplianceAuditLog.create({
      orgId,
      actionType: "DELETE",
      module: "STATUTORY_RULES",
      resourceId: ruleId,
      changes: { before: rules.toObject() },
      userId
    });


    res.json({
      success: true,
      message: "Statutory rules deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete statutory rules", error: error.message });
  }
};


// ============ TAX SLABS CONTROLLERS ============


const createTaxSlab = async (req, res) => {
  try {
    const { financialYear, taxType, slabs, standardDeduction, surcharge, healthCess, state } = req.body;
    const orgId = req.session.orgId;
    const userId = req.session.userId;


    if (!financialYear || !taxType || !slabs || slabs.length === 0) {
      return res.status(400).json({ message: "Required fields missing" });
    }


    const taxSlab = await TaxSlab.create({
      orgId,
      financialYear,
      taxType,
      state: state || "NATIONAL",
      slabs,
      standardDeduction,
      surcharge,
      healthCess,
      createdBy: userId,
      effectiveFrom: new Date(),
      status: "ACTIVE"
    });


    await ComplianceAuditLog.create({
      orgId,
      actionType: "CREATE",
      module: "TAX_SLABS",
      resourceId: taxSlab._id,
      changes: { after: taxSlab.toObject() },
      userId
    });


    res.status(201).json({
      success: true,
      message: "Tax slab created successfully",
      data: taxSlab
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create tax slab", error: error.message });
  }
};


const getTaxSlabs = async (req, res) => {
  try {
    const { financialYear, taxType, state } = req.query;
    const orgId = req.session.orgId;


    const query = { orgId, status: "ACTIVE" };
    if (financialYear) query.financialYear = financialYear;
    if (taxType) query.taxType = taxType;
    if (state) query.state = state;


    const taxSlabs = await TaxSlab.find(query)
      .populate("createdBy", "email")
      .sort({ createdAt: -1 });


    res.json({
      success: true,
      data: taxSlabs
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tax slabs", error: error.message });
  }
};


const updateTaxSlab = async (req, res) => {
  try {
    const { slabId } = req.params;
    const orgId = req.session.orgId;
    const userId = req.session.userId;
    const updateData = req.body;


    const oldSlab = await TaxSlab.findOne({ _id: slabId, orgId });
    if (!oldSlab) {
      return res.status(404).json({ message: "Tax slab not found" });
    }


    updateData.versionNumber = oldSlab.versionNumber + 1;


    const updatedSlab = await TaxSlab.findByIdAndUpdate(
      slabId,
      updateData,
      { new: true }
    );


    await ComplianceAuditLog.create({
      orgId,
      actionType: "UPDATE",
      module: "TAX_SLABS",
      resourceId: slabId,
      changes: { before: oldSlab.toObject(), after: updatedSlab.toObject() },
      userId
    });


    res.json({
      success: true,
      message: "Tax slab updated successfully",
      data: updatedSlab
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update tax slab", error: error.message });
  }
};


// ============ DEDUCTION RULES CONTROLLERS ============


const createDeductionRule = async (req, res) => {
  try {
    const { deductionType, name, calculationType, percentage, fixedAmount, formula } = req.body;
    const orgId = req.session.orgId;
    const userId = req.session.userId;


    if (!deductionType || !name || !calculationType) {
      return res.status(400).json({ message: "Required fields missing" });
    }


    const deductionRule = await DeductionRules.create({
      orgId,
      deductionType,
      name,
      calculationType,
      percentage,
      fixedAmount,
      formula,
      createdBy: userId,
      effectiveFrom: new Date(),
      ...req.body
    });


    await ComplianceAuditLog.create({
      orgId,
      actionType: "CREATE",
      module: "DEDUCTIONS",
      resourceId: deductionRule._id,
      changes: { after: deductionRule.toObject() },
      userId
    });


    res.status(201).json({
      success: true,
      message: "Deduction rule created successfully",
      data: deductionRule
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create deduction rule", error: error.message });
  }
};


const getDeductionRules = async (req, res) => {
  try {
    const { deductionType } = req.query;
    const orgId = req.session.orgId;


    const query = { orgId, status: "ACTIVE" };
    if (deductionType) query.deductionType = deductionType;


    const rules = await DeductionRules.find(query)
      .populate("createdBy", "email")
      .sort({ createdAt: -1 });


    res.json({
      success: true,
      data: rules
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch deduction rules", error: error.message });
  }
};


// ============ AUDIT LOG CONTROLLERS ============


const getAuditLogs = async (req, res) => {
  try {
    const { module, actionType, startDate, endDate } = req.query;
    const orgId = req.session.orgId;


    const query = { orgId };
    if (module) query.module = module;
    if (actionType) query.actionType = actionType;


    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }


    const logs = await ComplianceAuditLog.find(query)
      .populate("userId", "email")
      .sort({ timestamp: -1 })
      .limit(100);


    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch audit logs", error: error.message });
  }
};


// ============ COMPLIANCE CALCULATION ============


const getApplicableCompliance = async (req, res) => {
  try {
    const { state, employeeSalary } = req.query;
    const orgId = req.session.orgId;


    const rules = await CountryStatutoryRules.findOne({
      orgId,
      state: state || "DEFAULT",
      status: "ACTIVE"
    });


    if (!rules) {
      return res.status(404).json({ message: "No compliance rules found for this state" });
    }


    const compliance = {
      pf: rules.pf,
      esi: rules.esi,
      professionalTax: rules.professionalTax,
      incomeTax: rules.incomeTax,
      applicableBenefits: []
    };


    if (employeeSalary && employeeSalary > rules.esi.esiMinimumWages) {
      compliance.esiEligible = false;
    } else {
      compliance.esiEligible = true;
    }


    res.json({
      success: true,
      data: compliance
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch compliance", error: error.message });
  }
};


// ============ EXPORT ALL FUNCTIONS ============


module.exports = {
  createStatutoryRules,
  getStatutoryRules,
  getStatutoryRulesById,
  updateStatutoryRules,
  deleteStatutoryRules,
  createTaxSlab,
  getTaxSlabs,
  updateTaxSlab,
  createDeductionRule,
  getDeductionRules,
  getAuditLogs,
  getApplicableCompliance
};