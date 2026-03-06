import { useState } from 'react';

export default function Navbar({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">📋 Task Manager</h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm">Welcome, {user.name}</span>
                <span className="bg-blue-500 px-3 py-1 rounded text-xs">
                  {user.role.toUpperCase()}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {user && (
              <>
                <p className="text-sm mb-2">Welcome, {user.name}</p>
                <p className="text-xs bg-blue-500 w-fit px-2 py-1 rounded mb-2">
                  {user.role.toUpperCase()}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
