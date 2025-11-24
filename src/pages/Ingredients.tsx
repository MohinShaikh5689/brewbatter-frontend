import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getIngredients, type Ingredient } from '../services/api';
import Layout from '../components/Layout';
import IngredientCard from '../components/IngredientCard';
import IngredientForm from '../components/IngredientForm';

export default function Ingredients() {
  const { isSignedIn } = useUser();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchIngredients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIngredients();
      setIngredients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ingredients');
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [refreshTrigger]);

  const handleIngredientSaved = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowForm(false);
    setEditingIngredient(null);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setShowForm(true);
  };

  const handleDelete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingIngredient(null);
  };

  return (
    <Layout
      subtitle="Inventory"
      headerAction={{
        label: showForm ? '✕ Close' : '+ Add Ingredient',
        onClick: () => {
          if (showForm) {
            handleCloseForm();
          } else {
            setShowForm(true);
          }
        },
        color: 'green',
      }}
    >
      {/* Add/Edit Ingredient Form */}
      {showForm && (
        <div className="mb-12">
          <IngredientForm
            ingredient={editingIngredient}
            onSuccess={handleIngredientSaved}
            onCancel={handleCloseForm}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading ingredients...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-8 p-6 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-2">⚠️ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Ingredients Grid */}
      {!loading && ingredients.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-xl">No ingredients yet.</p>
          <p className="text-gray-500">Click "Add Ingredient" to create your first one!</p>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <span className="text-4xl mr-3">📦</span>
              Inventory Stock
            </h2>
            <div className="text-sm text-gray-600">
              Total Items: <span className="font-bold text-amber-700">{ingredients.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ingredients.map((ingredient) => (
              <IngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                onEdit={isSignedIn ? handleEdit : undefined}
                onDelete={isSignedIn ? handleDelete : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
