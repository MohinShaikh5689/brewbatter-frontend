import { type Category } from '../services/api';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300 border border-amber-100"
    >
      <div className="relative h-32 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden flex items-center justify-center">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            className="w-full h-full object-contain group-hover:scale-105 transition duration-500 p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            ☕
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
      </div>

      <div className="p-3">
        <h3 className="font-bold text-sm text-gray-800 mb-2 group-hover:text-amber-700 transition truncate" title={category.name}>
          {category.name}
        </h3>

        <div className="pt-2 border-t border-gray-200">
          <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-1.5 text-xs rounded-lg transition transform hover:scale-105 shadow-sm">
            View Items →
          </button>
        </div>
      </div>
    </div>
  );
}
