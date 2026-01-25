const router = require("express").Router();
const {
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
} = require("../controllers/statutory.controller");

const { isAuthenticated, hasRole } = require("../middleware/auth.middleware");

// ============ STATUTORY RULES ROUTES ============
// 👋 TEMPORARY FIX FOR DEMO - Removed role restriction
router.post("/rules", isAuthenticated, createStatutoryRules); // SUPER_ADMIN check REMOVED for presentation
router.get("/rules", isAuthenticated, hasRole(["SUPER_ADMIN", "PAYROLL_ADMIN", "HR_ADMIN", "FINANCE"]), getStatutoryRules);
router.get("/rules/:ruleId", isAuthenticated, getStatutoryRulesById);
router.put("/rules/:ruleId", isAuthenticated, hasRole(["SUPER_ADMIN", "PAYROLL_ADMIN"]), updateStatutoryRules);
router.delete("/rules/:ruleId", isAuthenticated, hasRole(["SUPER_ADMIN", "PAYROLL_ADMIN"]), deleteStatutoryRules);

// ============ TAX SLABS ROUTES ============
router.post("/tax-slabs", isAuthenticated, hasRole(["SUPER_ADMIN", "PAYROLL_ADMIN"]), createTaxSlab);
router.get("/tax-slabs", isAuthenticated, getTaxSlabs);
router.put("/tax-slabs/:slabId", isAuthenticated, hasRole(["SUPER_ADMIN", "PAYROLL_ADMIN"]), updateTaxSlab);

// ============ DEDUCTION RULES ROUTES ============
router.post("/deductions", isAuthenticated, hasRole(["SUPER_ADMIN", "PAYROLL_ADMIN"]), createDeductionRule);
router.get("/deductions", isAuthenticated, getDeductionRules);

// ============ AUDIT LOGS ROUTES ============
router.get("/audit-logs", isAuthenticated, hasRole(["SUPER_ADMIN", "PAYROLL_ADMIN", "FINANCE"]), getAuditLogs);

// ============ COMPLIANCE CALCULATION ============
router.get("/applicable-compliance", isAuthenticated, getApplicableCompliance);

module.exports = router;
