import { useState, useEffect } from 'react';

function StatutoryRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ COMMENT OUT FETCH FOR NOW - NO BACKEND DATA
  /*
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
      setRules(data.data || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
      setError('Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  };
  */

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Statutory Rules</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          + Create New Rule
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      {rules.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg mb-2">No statutory rules found</p>
          <p className="text-gray-400 text-sm">Create your first rule to get started</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Create First Rule
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {rule.country} - {rule.state}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Status: <span className={`font-semibold ${rule.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}`}>
                      {rule.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded">
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-gray-500">PF Enabled</p>
                  <p className="font-semibold">{rule.pf?.enabled ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-gray-500">ESI Enabled</p>
                  <p className="font-semibold">{rule.esi?.enabled ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Professional Tax</p>
                  <p className="font-semibold">{rule.professionalTax?.enabled ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Version</p>
                  <p className="font-semibold">{rule.versionNumber || 1}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatutoryRulesPage;
