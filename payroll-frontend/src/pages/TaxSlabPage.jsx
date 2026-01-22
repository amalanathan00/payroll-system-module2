import { useState } from 'react';

function TaxSlabPage() {
  const [taxSlabs, setTaxSlabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCalculator, setShowCalculator] = useState(true);
  const [calculationResult, setCalculationResult] = useState(null);
  const [salary, setSalary] = useState('');
  const [calculating, setCalculating] = useState(false);

  // ✅ COMMENT OUT FETCH FOR NOW
  /*
  useEffect(() => {
    fetchTaxSlabs();
  }, []);

  const fetchTaxSlabs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/statutory/tax-slabs', {
        credentials: 'include'
      });
      const data = await response.json();
      setTaxSlabs(data.data || []);
    } catch (error) {
      console.error('Error fetching tax slabs:', error);
    } finally {
      setLoading(false);
    }
  };
  */

  const calculateTax = () => {
    if (!salary || salary <= 0) {
      alert('Please enter a valid salary amount');
      return;
    }

    setCalculating(true);
    
    // Simple tax calculation (demo)
    setTimeout(() => {
      const grossSalary = parseFloat(salary);
      const standardDeduction = 50000;
      const taxableIncome = grossSalary - standardDeduction;
      
      let tax = 0;
      if (taxableIncome <= 300000) {
        tax = 0;
      } else if (taxableIncome <= 700000) {
        tax = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        tax = 20000 + (taxableIncome - 700000) * 0.20;
      } else {
        tax = 80000 + (taxableIncome - 1000000) * 0.30;
      }

      const cess = tax * 0.04;
      const totalTax = tax + cess;
      const netTakeHome = grossSalary - totalTax;

      setCalculationResult({
        tax: tax,
        surcharge: 0,
        cess: cess,
        netTakeHome: netTakeHome
      });
      
      setCalculating(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tax Calculator Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tax Calculator</h2>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            {showCalculator ? 'Hide' : 'Show'} Calculator
          </button>
        </div>

        {showCalculator && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Gross Salary (₹)
                </label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Enter annual salary (e.g., 500000)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={calculateTax}
                  disabled={calculating}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-2 rounded-lg font-semibold transition-colors"
                >
                  {calculating ? 'Calculating...' : 'Calculate Tax'}
                </button>
              </div>
            </div>

            {calculationResult && (
              <div className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Tax Calculation Result</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">Gross Salary</p>
                    <p className="text-xl font-bold text-gray-800">₹{parseFloat(salary).toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">Standard Deduction</p>
                    <p className="text-xl font-bold text-gray-800">₹50,000</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">Taxable Income</p>
                    <p className="text-xl font-bold text-gray-800">₹{(parseFloat(salary) - 50000).toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">Income Tax</p>
                    <p className="text-xl font-bold text-red-600">₹{Math.round(calculationResult.tax).toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">Health Cess (4%)</p>
                    <p className="text-xl font-bold text-red-600">₹{Math.round(calculationResult.cess).toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1 bg-green-600 p-4 rounded-lg shadow-lg">
                    <p className="text-sm text-white mb-1">Net Take Home</p>
                    <p className="text-2xl font-bold text-white">₹{Math.round(calculationResult.netTakeHome).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tax Slabs List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tax Slabs Configuration</h2>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold">
            + Create Tax Slab
          </button>
        </div>

        {taxSlabs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-gray-500 text-lg mb-2">No tax slabs configured</p>
            <p className="text-gray-400 text-sm">Create tax slabs for different financial years</p>
            <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
              Create First Tax Slab
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {taxSlabs.map((slab) => (
              <div key={slab._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                {/* Tax slab content here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaxSlabPage;
