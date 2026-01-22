import React, { useState } from 'react';
import axios from 'axios';

export default function StatutoryRuleForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    country: 'India',
    state: '',
    effectiveYear: new Date().getFullYear(),
    ruleType: 'PF_THRESHOLD',
    description: '',
    employeeContribution: '',
    employerContribution: '',
    effectiveFrom: '',
    effectiveTo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/v1/statutory-rules', formData, {
        withCredentials: true
      });

      alert('Statutory rule created successfully!');
      setFormData({
        country: 'India',
        state: '',
        effectiveYear: new Date().getFullYear(),
        ruleType: 'PF_THRESHOLD',
        description: '',
        employeeContribution: '',
        employerContribution: '',
        effectiveFrom: '',
        effectiveTo: ''
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create rule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-6">Create New Statutory Rule</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g., Tamil Nadu"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Effective Year</label>
          <input
            type="number"
            name="effectiveYear"
            value={formData.effectiveYear}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rule Type</label>
          <select
            name="ruleType"
            value={formData.ruleType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="PF_THRESHOLD">PF Threshold</option>
            <option value="ESI_THRESHOLD">ESI Threshold</option>
            <option value="PT_THRESHOLD">Professional Tax</option>
            <option value="INCOME_TAX">Income Tax</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe this rule..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employee Contribution (%)</label>
          <input
            type="number"
            name="employeeContribution"
            value={formData.employeeContribution}
            onChange={handleChange}
            placeholder="12"
            step="0.1"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employer Contribution (%)</label>
          <input
            type="number"
            name="employerContribution"
            value={formData.employerContribution}
            onChange={handleChange}
            placeholder="12"
            step="0.1"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Effective From</label>
          <input
            type="date"
            name="effectiveFrom"
            value={formData.effectiveFrom}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Effective Till</label>
          <input
            type="date"
            name="effectiveTo"
            value={formData.effectiveTo}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Creating...' : 'Create Rule'}
        </button>
      </div>
    </form>
  );
}
