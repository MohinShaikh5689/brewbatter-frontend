import { type Category } from '../services/api';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-3 duration-300"
    >
      <div className="relative h-56 bg-gradient-to-br from-amber-200 to-orange-200 overflow-hidden">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            ☕
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-2xl text-gray-800 mb-2 group-hover:text-amber-700 transition">
          {category.name}
        </h3>

        <div className="pt-4 border-t border-gray-200">
          <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition transform hover:scale-105">
            View Items →
          </button>
        </div>
      </div>
    </div>
  );
}
