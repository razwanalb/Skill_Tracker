import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, ListChecks, BarChart3, Settings, LogOut, Moon, Sun, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useFirebase } from './FirebaseProvider';
import { Logo } from './Logo';

export function Layout() {
  const user = useStore(state => state.user);
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);
  const { signOut } = useFirebase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { to: '/', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/routine', icon: <ListChecks className="w-5 h-5" />, label: 'Routine' },
    { to: '/analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
    { to: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface text-ink">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] border-r border-line bg-sidebar text-white z-10 transition-colors">
        <div className="px-6 py-6 pb-8 flex items-center space-x-3 text-white">
          <Logo textClass="text-xl font-extrabold text-white" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-0">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-3 transition-colors font-medium border-l-4 ${
                  isActive
                    ? 'bg-sidebar-active text-white border-primary'
                    : 'text-sidebar-item hover:text-white border-transparent hover:bg-sidebar-active/50'
                }`
              }
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 pt-6 mt-auto">
          <div className="mb-4">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center space-x-3 px-4 py-2 transition-colors font-medium text-sidebar-item hover:text-white hover:bg-sidebar-active/50 rounded-lg group"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 group-hover:text-amber-300 transition-colors" />
              ) : (
                <Sun className="w-5 h-5 group-hover:text-amber-400 transition-colors" />
              )}
              <span className="text-sm">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
          </div>

          <NavLink 
            to="/profile"
            className="flex items-center space-x-3 mb-4 px-2 py-2 rounded-xl hover:bg-sidebar-active/50 transition-colors group cursor-pointer"
          >
            <div className="w-9 h-9 bg-primary text-white rounded-full flex flex-shrink-0 items-center justify-center font-bold overflow-hidden border-2 border-transparent group-hover:border-primary/50 transition-colors mt-1">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="flex flex-col truncate flex-1 min-w-0">
              <span className="text-sm font-semibold text-white truncate group-hover:text-primary-light transition-colors">{user?.name || 'User'}</span>
              <span className="text-xs text-sidebar-item truncate">{user?.username ? `@${user.username}` : user?.email}</span>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center space-x-2 px-4 py-2.5 transition-colors font-medium text-sidebar-item hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-h-[100dvh] overflow-y-auto bg-surface text-ink transition-colors duration-300 relative">
        <div className="flex flex-col min-h-full">
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-line sticky top-0 z-40">
            <Logo className="w-8 h-8" textClass="text-lg font-bold" />
            <button onClick={toggleTheme} className="p-2 text-ink hover:text-primary transition-colors">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </header>

          <div className="flex-1 w-full p-4 md:p-6 gap-6 flex flex-col relative">
            <Outlet />
          </div>
          
          {/* Explicit Spacer for mobile bottom nav to ensure bottom content is never clipped */}
          <div className="h-28 md:hidden flex-shrink-0 w-full" />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-sidebar border-t border-sidebar-active flex justify-around items-center p-3 pb-safe z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-sidebar-item hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </NavLink>
        ))}
        <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-sidebar-item hover:text-white'
              }`
            }
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
