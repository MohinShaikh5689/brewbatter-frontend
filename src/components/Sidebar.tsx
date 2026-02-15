import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: '📊',
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: '🛒',
    },
    {
      name: 'Inventory',
      path: '/inventory',
      icon: '📦',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-amber-900 to-orange-900 text-white shadow-2xl z-40">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-amber-700">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">☕</span>
          BrewBatter
        </h1>
        <p className="text-amber-200 text-xs mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                    isActive
                      ? 'bg-amber-700 text-white shadow-lg'
                      : 'text-amber-100 hover:bg-amber-800 hover:text-white'
                  }`
                }
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-700">
        <p className="text-amber-200 text-xs text-center">
          © 2025 BrewBatter Cafe
        </p>
      </div>
    </aside>
  );
}
