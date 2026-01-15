import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { getCategoryItems, getIngredients, type CategoryItem, type Ingredient } from '../services/api';
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
                      <p className="text-amber-700 font-bold text-base mb-2">₹{item.price}</p>
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
