import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { createIngredient, updateIngredient, type Ingredient } from '../services/api';

interface IngredientFormProps {
  ingredient?: Ingredient | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function IngredientForm({ ingredient, onSuccess, onCancel }: IngredientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    unit: 'G' as 'G' | 'ML',
    addon_quantity: '',
    addon_price: '',
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        stock: ingredient.stock.toString(),
        unit: ingredient.unit,
        addon_quantity: ingredient.addons_quantity?.toString() || '',
        addon_price: ingredient.addon_price?.toString() || '',
        image: null,
      });
      if (ingredient.image_url) {
        setPreview(ingredient.image_url);
      }
    }
  }, [ingredient]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name.trim()) {
      setError('Please enter an ingredient name');
      return;
    }

    if (!formData.stock.trim()) {
      setError('Please enter stock amount');
      return;
    }

    if (!ingredient && !formData.image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);

    try {
      if (ingredient) {
        // Edit mode - send only name, stock, unit as JSON
        const payload = {
          name: formData.name,
          stock: parseInt(formData.stock),
          unit: formData.unit,
          addon_quantity: formData.addon_quantity ? parseInt(formData.addon_quantity) : undefined,
          addon_price: formData.addon_price ? parseFloat(formData.addon_price) : undefined,
        };
        await updateIngredient(ingredient.id, payload);
      } else {
        // Create mode - send multipart form with image
        const data = new FormData();
        data.append('name', formData.name);
        data.append('stock', formData.stock);
        data.append('unit', formData.unit);
        if (formData.addon_quantity) {
          data.append('addon_quantity', formData.addon_quantity);
        }
        if (formData.addon_price) {
          data.append('addon_price', formData.addon_price);
        }
        if (formData.image) {
          data.append('images', formData.image);
        }
        await createIngredient(data);
      }

      setSuccess(true);
      setFormData({ name: '', stock: '', unit: 'G', addon_quantity: '', addon_price: '', image: null });
      setPreview(null);

      const form = e.target as HTMLFormElement;
      form.reset();

      if (onSuccess) {
        setTimeout(() => onSuccess(), 500);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ingredient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {ingredient ? 'Edit Ingredient' : 'Add New Ingredient'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Ingredient {ingredient ? 'updated' : 'created'} successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ingredient Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Chocolate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Amount *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="e.g., 20000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
            Unit *
          </label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="G">G (Grams)</option>
            <option value="ML">ML (Milliliters)</option>
          </select>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Addon Settings (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="addon_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Addon Quantity
              </label>
              <input
                type="number"
                id="addon_quantity"
                name="addon_quantity"
                value={formData.addon_quantity}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="addon_price" className="block text-sm font-medium text-gray-700 mb-2">
                Addon Price (₹)
              </label>
              <input
                type="number"
                id="addon_price"
                name="addon_price"
                value={formData.addon_price}
                onChange={handleInputChange}
                placeholder="e.g., 20"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Ingredient Image {!ingredient && '*'}
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border border-gray-300"
            />
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Saving...' : ingredient ? 'Update Ingredient' : 'Create Ingredient'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
