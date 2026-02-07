import React, { useState, useEffect } from "react";
import api from "../api/axios";
import StatutoryRulesForm from "../components/StatutoryRulesForm";

export default function StatutoryRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [filters, setFilters] = useState({
    country: "India",
    state: "",
    effectiveYear: ""
  });

  useEffect(() => {
    fetchRules();
  }, [filters]);

  const fetchRules = async () => {
    try {
      setLoading(true);

      // 🔑 SEND ONLY FILLED FILTERS
      const params = {};
      if (filters.country) params.country = filters.country;
      if (filters.state) params.state = filters.state;
      if (filters.effectiveYear) params.effectiveYear = filters.effectiveYear;

      const res = await api.get("/api/statutory", { params });
      setRules(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch statutory rules");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm("Archive this rule?")) return;
    await api.delete(`/api/statutory/${id}`);
    fetchRules();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Statutory Rules</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            {showForm ? "Cancel" : "+ Add Rule"}
          </button>
        </div>

        {showForm && <StatutoryRulesForm onSuccess={fetchRules} />}

        {/* FILTERS */}
        <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-3 gap-4">
          <input
            className="border p-2"
            placeholder="Country"
            value={filters.country}
            onChange={(e) =>
              setFilters({ ...filters, country: e.target.value })
            }
          />

          <input
            className="border p-2"
            placeholder="State"
            value={filters.state}
            onChange={(e) =>
              setFilters({ ...filters, state: e.target.value })
            }
          />

          <input
            type="number"
            className="border p-2"
            placeholder="Year"
            value={filters.effectiveYear}
            onChange={(e) =>
              setFilters({ ...filters, effectiveYear: e.target.value })
            }
          />
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th>Rule</th>
                <th>State</th>
                <th>Year</th>
                <th>Emp %</th>
                <th>Empr %</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No rules found
                  </td>
                </tr>
              ) : (
                rules.map((r) => (
                  <tr key={r._id}>
                    <td>{r.ruleType}</td>
                    <td>{r.state}</td>
                    <td>{r.effectiveYear}</td>
                    <td>{r.pf?.employeeContribution ?? "-"}</td>
                    <td>{r.pf?.employerContribution ?? "-"}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteRule(r._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
