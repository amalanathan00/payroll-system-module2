const TaxSlab = require("../models/TaxSlab");

exports.createTaxSlab = async (req, res) => {
  try {
    // NO AUTH CHECK
    const { country, financialYear, slabName, slabs, standardDeduction, basicExemptionLimit, applicableForRegime } = req.body;

    const taxSlab = new TaxSlab({
      country,
      financialYear,
      slabName,
      slabs,
      standardDeduction,
      basicExemptionLimit,
      applicableForRegime,
      status: "ACTIVE"
    });

    await taxSlab.save();
    res.status(201).json({ success: true, data: taxSlab, message: "Tax slab created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTaxSlabs = async (req, res) => {
  try {
    // NO AUTH CHECK
    const { country, financialYear } = req.query;
    const filters = { status: "ACTIVE" };

    if (country) filters.country = country;
    if (financialYear) filters.financialYear = financialYear;

    const slabs = await TaxSlab.find(filters);
    res.json({ success: true, data: slabs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.calculateTaxWithoutDB = async (req, res) => {
  try {
    const { grossSalary, regime } = req.body;

    console.log("REGIME RECEIVED:", regime);

    if (!grossSalary) {
      return res.status(400).json({
        success: false,
        message: "Gross salary is required"
      });
    }

    const salary = Number(grossSalary);
    const STANDARD_DEDUCTION = 50000;

    const taxableIncome = Math.max(0, salary - STANDARD_DEDUCTION);

    let incomeTax = 0;
    let surcharge = 0;

    // ---------- OLD REGIME ----------
    if (regime === "OLD") {
      if (taxableIncome > 250000) {
        incomeTax += Math.min(taxableIncome - 250000, 250000) * 0.05;
      }
      if (taxableIncome > 500000) {
        incomeTax += Math.min(taxableIncome - 500000, 500000) * 0.20;
      }
      if (taxableIncome > 1000000) {
        incomeTax += (taxableIncome - 1000000) * 0.30;
      }
    }

    // ---------- NEW REGIME ----------
    if (regime === "NEW") {
      if (taxableIncome > 300000) {
        incomeTax += Math.min(taxableIncome - 300000, 300000) * 0.05;
      }
      if (taxableIncome > 600000) {
        incomeTax += Math.min(taxableIncome - 600000, 300000) * 0.10;
      }
      if (taxableIncome > 900000) {
        incomeTax += Math.min(taxableIncome - 900000, 300000) * 0.15;
      }
      if (taxableIncome > 1200000) {
        incomeTax += Math.min(taxableIncome - 1200000, 300000) * 0.20;
      }
      if (taxableIncome > 1500000) {
        incomeTax += (taxableIncome - 1500000) * 0.30;
      }
    }

    // ---------- SURCHARGE (optional, correct rule) ----------
    if (taxableIncome > 5000000) {
      surcharge = incomeTax * 0.10; // example 10%
    }

    // ---------- CESS (4%) ----------
    const cess = (incomeTax + surcharge) * 0.04;

    const totalTax = incomeTax + surcharge + cess;
    const netTakeHome = salary - totalTax;

    res.json({
      success: true,
      data: {
        grossSalary: salary,
        taxableIncome,
        incomeTax: Math.round(incomeTax),
        surcharge: Math.round(surcharge),
        cess: Math.round(cess),
        totalTax: Math.round(totalTax),
        netTakeHome: Math.round(netTakeHome)
      }
    });

  } catch (error) {
    console.error("Tax calc error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteTaxSlab = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TaxSlab.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Tax slab not found"
      });
    }

    res.json({
      success: true,
      message: "Tax slab deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


