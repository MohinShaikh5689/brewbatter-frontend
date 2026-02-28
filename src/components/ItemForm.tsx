import { useState, type FormEvent, type ChangeEvent } from 'react';
import { createCategoryItem } from '../services/api';

interface ItemFormProps {
  categoryId: string;
  onSuccess?: () => void;
}

export default function ItemForm({ categoryId, onSuccess }: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    onlinePrice: '',
    description: '',
    imageUrl: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        imageUrl: file,
      }));

      // Create preview
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
      setError('Please enter an item name');
      return;
    }

    if (!formData.price.trim()) {
      setError('Please enter a price');
      return;
    }

    if (!formData.imageUrl) {
      setError('Please select an image');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      if (formData.onlinePrice.trim()) {
        data.append('onlinePrice', formData.onlinePrice);
      }
      data.append('description', formData.description);
      data.append('imageUrl', formData.imageUrl);

      await createCategoryItem(categoryId, data);
      setSuccess(true);
      setFormData({ name: '', price: '', onlinePrice: '', description: '', imageUrl: null });
      setPreview(null);

      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Item Type</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Item created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Chocolate Waffle"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 79"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="onlinePrice" className="block text-sm font-medium text-gray-700 mb-2">
            Online Price (₹) <span className="text-gray-400">- Optional</span>
          </label>
          <input
            type="number"
            id="onlinePrice"
            name="onlinePrice"
            value={formData.onlinePrice}
            onChange={handleInputChange}
            placeholder="e.g., 89 (leave empty for same as regular price)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="e.g., Delicious chocolate waffle with toppings"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Item Image *
          </label>
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {loading ? 'Creating...' : 'Create Item'}
        </button>
      </form>
    </div>
  );
}
