import { useState, useEffect } from 'react';
import { getDailySales, type DailySale } from '../services/api';
import Layout from '../components/Layout';

export default function DailySales() {
  const [sales, setSales] = useState<DailySale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDailySales = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDailySales();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch daily sales');
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailySales();
  }, []);

  const calculateTotalSales = () => {
    return sales.reduce((sum, day) => sum + day.total_sales, 0);
  };

  const calculateTotalOrders = () => {
    return sales.reduce((sum, day) => sum + day.order_count, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Layout subtitle="Daily Sales Report" showBackButton>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Sales Days</h3>
          <p className="text-4xl font-bold text-blue-700">{sales.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold text-green-700">₹{calculateTotalSales().toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border border-purple-200">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Orders</h3>
          <p className="text-4xl font-bold text-purple-700">{calculateTotalOrders()}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading daily sales...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-8 p-6 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-2">⚠️ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Sales Table */}
      {!loading && sales.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-600 text-xl">No sales data available.</p>
          <p className="text-gray-500">Sales data will appear here once orders are placed.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-right font-semibold">Total Sales</th>
                  <th className="px-6 py-4 text-right font-semibold">Number of Orders</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((day, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 hover:bg-amber-50 transition ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {formatDate(day.date as unknown as string)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-700">
                      ₹{day.total_sales.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700">
                      {day.order_count} order{day.order_count !== 1 ? 's' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
