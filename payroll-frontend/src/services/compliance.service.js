import axios from 'axios';

const API_BASE = '/api/v1';

export const complianceService = {
  // Statutory Rules
  createStatutoryRule: (data) => 
    axios.post(`${API_BASE}/statutory-rules`, data, { withCredentials: true }),
  
  getStatutoryRules: (filters) => 
    axios.get(`${API_BASE}/statutory-rules`, { params: filters, withCredentials: true }),
  
  updateStatutoryRule: (ruleId, data) => 
    axios.put(`${API_BASE}/statutory-rules/${ruleId}`, data, { withCredentials: true }),
  
  archiveStatutoryRule: (ruleId) => 
    axios.delete(`${API_BASE}/statutory-rules/${ruleId}`, { withCredentials: true }),

  // Tax Slabs
  getTaxSlabs: (filters) => 
    axios.get(`${API_BASE}/tax-slabs`, { params: filters, withCredentials: true }),
  
  calculateTax: (data) => 
    axios.post(`${API_BASE}/tax-slabs/calculate`, data, { withCredentials: true }),

  // PF Configuration
  getPFConfig: (filters) => 
    axios.get(`${API_BASE}/pf-config`, { params: filters, withCredentials: true }),
  
  calculatePFDeduction: (data) => 
    axios.post(`${API_BASE}/pf-config/calculate`, data, { withCredentials: true }),

  // ESI Configuration
  getESIConfig: (filters) => 
    axios.get(`${API_BASE}/esi-config`, { params: filters, withCredentials: true }),
  
  calculateESIDeduction: (data) => 
    axios.post(`${API_BASE}/esi-config/calculate`, data, { withCredentials: true }),

  // Professional Tax
  getPTConfig: (filters) => 
    axios.get(`${API_BASE}/pt-config`, { params: filters, withCredentials: true }),
  
  calculatePTDeduction: (data) => 
    axios.post(`${API_BASE}/pt-config/calculate`, data, { withCredentials: true })
};
