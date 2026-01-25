// ✅ FIXED VERSION - Matches your backend exactly
import React, { useState } from 'react';
import axios from 'axios';

export default function StatutoryRuleForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    country: 'India',
    state: 'Tamil Nadu',
    pf: {
      employeeContribution: 12,
      employerContribution: 12,
      enabled: true
    },
    esi: {
      employeeContribution: 0.75,
      employerContribution: 3.25,
      enabled: true
    },
    professionalTax: {
      enabled: true,
      monthlyMax: 200
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: Number(value) || value
      }
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ FIXED: Correct endpoint + credentials
      const response = await axios.post(
        '/api/v1/statutory/rules', 
        formData,
        { withCredentials: true }
      );

      alert('✅ Statutory Rule Created Successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to create rule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">📋 Create Statutory Rule</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          ❌ {error}
        </div>
      )}

      <form onSubmit={submitForm} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        {/* PF */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="col-span-full font-semibold text-blue-800 mb-2">PF Contributions</h3>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Employee (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.pf.employeeContribution}
              onChange={(e) => handleChange('pf', 'employeeContribution', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Employer (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.pf.employerContribution}
              onChange={(e) => handleChange('pf', 'employerContribution', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* ESI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
          <h3 className="col-span-full font-semibold text-green-800 mb-2">ESI Contributions</h3>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Employee (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.esi.employeeContribution}
              onChange={(e) => handleChange('esi', 'employeeContribution', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Employer (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.esi.employerContribution}
              onChange={(e) => handleChange('esi', 'employerContribution', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400 transition"
          >
            {loading ? '⏳ Creating...' : '✅ Create Statutory Rule'}
          </button>
          <button
            type="button"
            onClick={onSuccess}
            className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 font-semibold transition"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
