// ✅ FIXED: Replace your ENTIRE StatutoryRulesPage.jsx with this:
import { useState, useEffect, useRef } from 'react';

function StatutoryRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // ✅ FORM DATA STATE - This collects ALL input values
  const [formData, setFormData] = useState({
    country: 'India',
    state: 'Tamil Nadu',
    pfEmployee: 12,
    pfEmployer: 12,
    esiEmployee: 0.75,
    esiEmployer: 3.25
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/statutory/rules', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setRules(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
      setError('Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Collect REAL form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value) || value
    }));
  };

  const createStatutoryRule = async () => {
    try {
      setLoading(true);
      const payload = {
        country: formData.country,
        state: formData.state,
        pf: {
          employeeContribution: formData.pfEmployee,
          employerContribution: formData.pfEmployer
        },
        esi: {
          employeeContribution: formData.esiEmployee,
          employerContribution: formData.esiEmployer
        },
        professionalTax: {
          enabled: true,
          monthlyMax: 200
        }
      };

      const response = await fetch('http://localhost:5000/api/statutory/rules', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Statutory Rule Created Successfully!');
        setShowForm(false);
        fetchRules();
      } else {
        alert('❌ Error: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('❌ Failed to create rule - Check backend is running');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showForm) {
    return <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 Statutory Rules</h1>
              <p className="text-gray-600">Manage PF, ESI, Professional Tax & Income Tax rules</p>
            </div>
            <button 
              onClick={() => setShowForm(!showForm)}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              {showForm ? '❌ Cancel' : '➕ Create New Rules'}
            </button>
          </div>

          {/* ✅ FIXED FORM WITH CONTROLLED INPUTS */}
          {showForm && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">➕ Create New Statutory Rule</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PF Employee (%)</label>
                  <input
                    name="pfEmployee"
                    type="number"
                    step="0.1"
                    value={formData.pfEmployee}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PF Employer (%)</label>
                  <input
                    name="pfEmployer"
                    type="number"
                    step="0.1"
                    value={formData.pfEmployer}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ESI Employee (%)</label>
                  <input
                    name="esiEmployee"
                    type="number"
                    step="0.1"
                    value={formData.esiEmployee}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ESI Employer (%)</label>
                  <input
                    name="esiEmployer"
                    type="number"
                    step="0.1"
                    value={formData.esiEmployer}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8 justify-center">
                <button
                  onClick={createStatutoryRule}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? '⏳ Creating...' : '✅ Create Rule'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-10 py-3 rounded-xl font-semibold shadow-lg hover:shadow-md transition-all duration-300"
                >
                  ❌ Cancel
                </button>
              </div>

              {/* ✅ DEBUG INFO */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                Debug: {JSON.stringify(formData, null, 2)}
              </div>
            </div>
          )}

          {error && !showForm && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {rules.length === 0 && !showForm ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-6">📋</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Statutory Rules</h3>
              <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                Create your first statutory rule for PF, ESI, Professional Tax compliance
              </p>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                ➕ Create First Rule
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {rules.map((rule) => (
                <div key={rule._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{rule.country} - {rule.state}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Status: <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rule.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{rule.status}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 px-4 py-2 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">Edit</button>
                      <button className="text-red-600 hover:text-red-800 px-4 py-2 border border-red-600 rounded-lg font-medium hover:bg-red-50 transition">Delete</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div><p className="text-gray-500 mb-1">PF Employee</p><p className="font-semibold">{rule.pf?.employeeContribution || 0}%</p></div>
                    <div><p className="text-gray-500 mb-1">PF Employer</p><p className="font-semibold">{rule.pf?.employerContribution || 0}%</p></div>
                    <div><p className="text-gray-500 mb-1">ESI Employee</p><p className="font-semibold">{rule.esi?.employeeContribution || 0}%</p></div>
                    <div><p className="text-gray-500 mb-1">Version</p><p className="font-semibold">{rule.versionNumber || 1}</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatutoryRulesPage;
