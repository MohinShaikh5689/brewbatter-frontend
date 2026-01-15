import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { getCategories, type Category } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import MenuForm from '../components/MenuForm';
import Layout from '../components/Layout';

export default function Dashboard() {
  const { isSignedIn } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      console.log('Fetched categories:', data);
      // Handle both array and object responses
      let categoryList = Array.isArray(data) ? data : (data?.data || data);
      if (!Array.isArray(categoryList)) {
        categoryList = [categoryList];
      }
      setCategories(categoryList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refreshTrigger]);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const handleMenuItemCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowForm(false);
  };

  return (
    <Layout
      subtitle="Menu Categories"
      headerAction={
        isSignedIn
          ? {
              label: showForm ? '✕ Close' : '+ Add Category',
              onClick: () => setShowForm(!showForm),
              color: 'green',
            }
          : undefined
      }
    >

      {/* Add Category Form - Only for admins */}
      {showForm && isSignedIn && (
        <div className="mb-12">
          <MenuForm onSuccess={handleMenuItemCreated} />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading categories...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-8 p-6 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-2">⚠️ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Categories Grid */}
      {!loading && categories.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-600 text-xl">No categories yet.</p>
          <p className="text-gray-500">Click "Add Category" to create your first one!</p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">📋</span>
            Menu Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
