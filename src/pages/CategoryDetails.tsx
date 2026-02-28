import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { getCategoryItems, getIngredients, updateCategoryItem, deleteCategoryItem, type CategoryItem, type Ingredient } from '../services/api';
import Layout from '../components/Layout';
import ItemForm from '../components/ItemForm';
import RecipeModal from '../components/RecipeModal';
import { useCart } from '../context/CartContext';

export default function CategoryDetails() {
  const { isSignedIn } = useUser();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'items' | 'ingredients'>('items');
  
  // Items state
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Recipe modal state
  const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // Ingredients state
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [errorIngredients, setErrorIngredients] = useState<string | null>(null);

  // Edit state
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', price: 0, onlinePrice: 0, description: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCategoryItems(categoryId);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredients = async () => {
    setLoadingIngredients(true);
    setErrorIngredients(null);
    try {
      const data = await getIngredients();
      console.log('Fetched ingredients for addons:', data);
      // Filter ingredients that have addon_quantity and addon_price set
      const addonIngredients = Array.isArray(data) ? data.filter((ing: Ingredient) => ing.addons_quantity && ing.addon_price) : [];
      setIngredients(addonIngredients);
    } catch (err) {
      setErrorIngredients(err instanceof Error ? err.message : 'Failed to fetch ingredients');
      setIngredients([]);
    } finally {
      setLoadingIngredients(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [categoryId, refreshTrigger]);

  useEffect(() => {
    if (activeTab === 'ingredients') {
      fetchIngredients();
    }
  }, [activeTab]);

  const handleItemCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowForm(false);
  };

  const handleEditClick = (item: CategoryItem) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name,
      price: item.price,
      onlinePrice: item.onlinePrice || 0,
      description: item.description || '',
    });
    setEditError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editFormData.name.trim()) {
      setEditError('Please enter an item name');
      return;
    }

    if (!editFormData.price || editFormData.price <= 0) {
      setEditError('Please enter a valid price');
      return;
    }

    setEditLoading(true);
    try {
      await updateCategoryItem(editingItem.id, {
        name: editFormData.name,
        price: editFormData.price,
        onlinePrice: editFormData.onlinePrice || undefined,
        description: editFormData.description,
      });
      setRefreshTrigger((prev) => prev + 1);
      setEditingItem(null);
      setEditError(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteCategoryItem(itemId);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  return (
    <>
    <Layout
      subtitle="Category Items & Ingredients"
      showBackButton
      headerAction={
        activeTab === 'items' && isSignedIn
          ? {
              label: showForm ? '✕ Close' : '+ Add Item Type',
              onClick: () => setShowForm(!showForm),
              color: 'green',
            }
          : undefined
      }
    >
      {/* Tabs */}
      <div className="mb-8 flex gap-4 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab('items')}
          className={`pb-4 px-6 font-semibold transition ${
            activeTab === 'items'
              ? 'text-amber-700 border-b-4 border-amber-700 -mb-2'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🍽️ Item Types
        </button>
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`pb-4 px-6 font-semibold transition ${
            activeTab === 'ingredients'
              ? 'text-purple-700 border-b-4 border-purple-700 -mb-2'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🎁 Ingredients (Addons)
        </button>
      </div>

      {/* Item Types Tab */}
      {activeTab === 'items' && (
        <>
          {/* Add Item Form - Only for admins */}
          {showForm && categoryId && isSignedIn && (
            <div className="mb-12">
              <ItemForm categoryId={categoryId} onSuccess={handleItemCreated} />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading items...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8 p-6 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">⚠️ Error</h3>
              <p>{error}</p>
            </div>
          )}

          {/* Items Grid */}
          {!loading && items.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-xl">No item types yet.</p>
              <p className="text-gray-500">Click "Add Item Type" to create your first one!</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300 border border-amber-100"
                  >
                    {item.imageUrl && (
                      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain hover:scale-105 transition duration-500 p-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-gray-800 mb-1 truncate" title={item.name}>{item.name}</h3>
                      <div className="mb-2">
                        <p className="text-amber-700 font-bold text-base">₹{item.price}</p>
                        {item.onlinePrice !== undefined && item.onlinePrice !== null && (
                          <p className="text-green-600 text-xs">🌐 Online: ₹{item.onlinePrice}</p>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-gray-600 text-xs mb-2 line-clamp-2" title={item.description}>{item.description}</p>
                      )}
                      <div className="flex gap-1 mb-1">
                        <button
                          onClick={() =>
                            addToCart({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              onlinePrice: item.onlinePrice,
                              imageUrl: item.imageUrl,
                              type: 'item',
                            })
                          }
                          className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-1.5 text-xs rounded-lg transition transform hover:scale-105 shadow-sm"
                        >
                          🛒 Add
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowRecipeModal(true);
                          }}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-1.5 px-3 text-xs rounded-lg transition transform hover:scale-105 shadow-sm"
                        >
                          📝
                        </button>
                        {isSignedIn && (
                          <>
                            <button
                              onClick={() => handleEditClick(item)}
                              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-1.5 px-3 text-xs rounded-lg transition transform hover:scale-105 shadow-sm"
                              title="Edit item"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item.id)}
                              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-1.5 px-3 text-xs rounded-lg transition transform hover:scale-105 shadow-sm"
                              title="Delete item"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                      <p className="text-gray-400 text-[10px] text-center">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Ingredients Tab */}
      {activeTab === 'ingredients' && (
        <>
          {/* Loading State */}
          {loadingIngredients && (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading ingredients...</p>
            </div>
          )}

          {/* Error State */}
          {errorIngredients && (
            <div className="mb-8 p-6 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">⚠️ Error</h3>
              <p>{errorIngredients}</p>
            </div>
          )}

          {/* Ingredients Grid */}
          {!loadingIngredients && ingredients.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-xl">No ingredients configured as addons yet.</p>
              <p className="text-gray-500">Go to Inventory to add ingredients with addon prices!</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300 border border-purple-100"
                  >
                    {ingredient.image_url && (
                      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <img
                          src={ingredient.image_url}
                          alt={ingredient.name}
                          className="w-full h-full object-contain hover:scale-105 transition duration-500 p-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-gray-800 mb-1 truncate" title={ingredient.name}>{ingredient.name}</h3>
                      <p className="text-purple-700 font-bold text-base mb-1">₹{ingredient.addon_price}</p>
                      <p className="text-gray-600 text-xs mb-2 truncate" title={`${ingredient.addons_quantity} ${ingredient.unit}`}>Qty: {ingredient.addons_quantity} {ingredient.unit}</p>
                      <button
                        onClick={() =>
                          addToCart({
                            id: ingredient.id,
                            name: ingredient.name,
                            price: ingredient.addon_price || 0,
                            imageUrl: ingredient.image_url,
                            type: 'addon',
                          })
                        }
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-1.5 text-xs rounded-lg transition transform hover:scale-105 shadow-sm"
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
    
    {/* Edit Modal */}
    {editingItem && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Item Type</h2>
          
          {editError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {editError}
            </div>
          )}

          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                placeholder="Enter item name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={editFormData.price}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                placeholder="Enter price"
                step="0.01"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Online Price (₹) <span className="text-gray-400 font-normal">- Optional</span>
              </label>
              <input
                type="number"
                name="onlinePrice"
                value={editFormData.onlinePrice || ''}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, onlinePrice: parseFloat(e.target.value) || 0 }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
                placeholder="Enter online price (leave empty for same as regular)"
                step="0.01"
                min="0"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                placeholder="Enter item description"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setEditError(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    
    {/* Recipe Modal */}
    {showRecipeModal && selectedItem && (
      <RecipeModal
        itemTypeId={selectedItem.id}
        itemName={selectedItem.name}
        onClose={() => {
          setShowRecipeModal(false);
          setSelectedItem(null);
        }}
      />
    )}
    </>
  );
}
