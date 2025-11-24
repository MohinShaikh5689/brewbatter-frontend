import { useState } from 'react';
import { deleteIngredient, type Ingredient } from '../services/api';

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit?: (ingredient: Ingredient) => void;
  onDelete?: () => void;
}

export default function IngredientCard({ ingredient, onEdit, onDelete }: IngredientCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await deleteIngredient(ingredient.id);
      onDelete();
    } catch (error) {
      console.error('Failed to delete ingredient:', error);
      alert('Failed to delete ingredient');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const isLowStock = ingredient.stock <= ingredient.reorder_level;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
      {ingredient.image_url && (
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={ingredient.image_url}
            alt={ingredient.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {isLowStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              LOW STOCK
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-800 mb-3">{ingredient.name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Stock:</span>
            <span className={`font-bold text-lg ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
              {ingredient.stock} {ingredient.unit}
            </span>
          </div>
          
          {ingredient.reorder_level > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Reorder Level:</span>
              <span className="text-gray-700 font-semibold">
                {ingredient.reorder_level} {ingredient.unit}
              </span>
            </div>
          )}
        </div>

        <div className="text-gray-400 text-xs mb-4">
          Updated: {new Date(ingredient.updated_at).toLocaleDateString()}
        </div>

        {/* Action Buttons - Only show for admins */}
        {(onEdit || onDelete) && (
          <>
            {!showConfirm ? (
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(ingredient)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    ✏️ Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-red-600 font-semibold text-center">Are you sure?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
