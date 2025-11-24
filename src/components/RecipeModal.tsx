import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getRecipe, createRecipe, deleteRecipe, getIngredients, type RecipeIngredient, type Ingredient } from '../services/api';

interface RecipeModalProps {
  itemTypeId: string;
  itemName: string;
  onClose: () => void;
}

export default function RecipeModal({ itemTypeId, itemName, onClose }: RecipeModalProps) {
  const { isSignedIn } = useUser();
  const [recipe, setRecipe] = useState<RecipeIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // For adding ingredients
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [newIngredients, setNewIngredients] = useState<{ ingredientId: string; quantity: number; unit: 'G' | 'ML' }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecipe();
    if (isSignedIn) {
      fetchAvailableIngredients();
    }
  }, [itemTypeId, isSignedIn]);

  const fetchRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecipe(itemTypeId);
      setRecipe(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
      setRecipe([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableIngredients = async () => {
    try {
      const data = await getIngredients();
      setAvailableIngredients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch ingredients:', err);
    }
  };

  const handleAddIngredient = () => {
    setNewIngredients([...newIngredients, { ingredientId: '', quantity: 0, unit: 'G' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setNewIngredients(newIngredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: string, value: string | number) => {
    const updated = [...newIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setNewIngredients(updated);
  };

  const handleSaveRecipe = async () => {
    if (newIngredients.some(ing => !ing.ingredientId || ing.quantity <= 0)) {
      alert('Please fill in all ingredient fields');
      return;
    }
    console.log(itemTypeId)
    setSaving(true);
    try {
      await createRecipe(itemTypeId, newIngredients);
      await fetchRecipe();
      setIsEditing(false);
      setNewIngredients([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecipe = async () => {
    setDeleting(true);
    try {
      await deleteRecipe(itemTypeId);
      await fetchRecipe();
      setShowDeleteConfirm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-t-2xl sticky top-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">📝 Recipe: {itemName}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-600"></div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {!loading && !isEditing && (
            <>
              {recipe.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🍳</div>
                  <p className="text-gray-600 text-lg">No recipe added yet.</p>
                  {isSignedIn && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition"
                    >
                      + Add Recipe
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Ingredients:</h3>
                  <div className="space-y-3">
                    {recipe.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-800">
                          {item.ingredient?.name || `Ingredient ${index + 1}`}
                        </span>
                        <span className="text-gray-600">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                  {isSignedIn && (
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        ✏️ Edit Recipe
                      </button>
                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                          🗑️ Delete Recipe
                        </button>
                      ) : (
                        <div className="flex-1 flex gap-2">
                          <button
                            onClick={handleDeleteRecipe}
                            disabled={deleting}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                          >
                            {deleting ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {isEditing && (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Add/Edit Recipe:</h3>
              <div className="space-y-4 mb-4">
                {newIngredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 items-center p-4 bg-gray-50 rounded-lg">
                    <select
                      value={ingredient.ingredientId}
                      onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Ingredient</option>
                      {availableIngredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name} (Stock: {ing.stock} {ing.unit})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={ingredient.quantity || ''}
                      onChange={(e) => handleIngredientChange(index, 'quantity', parseFloat(e.target.value))}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="G">G</option>
                      <option value="ML">ML</option>
                    </select>
                    <button
                      onClick={() => handleRemoveIngredient(index)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddIngredient}
                className="w-full mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
              >
                + Add Ingredient
              </button>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveRecipe}
                  disabled={saving || newIngredients.length === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  {saving ? 'Saving...' : '💾 Save Recipe'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewIngredients([]);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
