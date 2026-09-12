import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  Sparkles,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Shield,
  BookOpen,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Literature', path: '/literature' },
    { name: 'Archives', path: '/archives' },
    { name: 'Ancient Manuscripts', path: '/manuscripts' },
    { name: 'Regions', path: '/regions' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top subtle Ethiopian heritage trim banner */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0C3823] via-[#D4AF37] to-[#8E1B1B]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-[#0C3823] flex items-center justify-center text-[#D4AF37] border-2 border-[#D4AF37]/50 shadow-xs group-hover:scale-105 transition-all">
              <span className="font-ethiopic font-bold text-xl leading-none">ወ</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-black text-xl tracking-tight text-[#0C3823] group-hover:text-[#D4AF37] transition-colors">
                  WEMEZEKR
                </span>
                <span className="font-ethiopic text-xs font-semibold text-[#8E1B1B]">ወመዘክር</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 hidden sm:block">
                Ethiopian Heritage & Manuscript Registry
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? 'bg-[#0C3823] text-white shadow-xs'
                      : 'text-stone-700 hover:text-[#0C3823] hover:bg-stone-100/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* AI Assistant Special Tab */}
            <Link
              to="/ai-assistant"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                isActive('/ai-assistant')
                  ? 'bg-[#D4AF37] text-[#0C3823] shadow-xs'
                  : 'bg-[#FAF6EB] text-[#856404] hover:bg-[#F4E7BE] border border-[#D4AF37]/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>AI Assistant</span>
            </Link>
          </nav>

          {/* Action / Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/register-heritage"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0C3823]/10 hover:bg-[#0C3823]/20 text-[#0C3823] text-xs font-bold transition-all border border-[#0C3823]/20"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#0C3823]" />
              <span>Register Collection</span>
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0C3823] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left leading-tight hidden sm:block">
                    <p className="text-xs font-bold truncate max-w-[120px]">{user.name}</p>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                      {user.role}
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0C3823]/10 text-[#0C3823]">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-[#0C3823] font-medium transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#0C3823]" />
                      Management Dashboard
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/dashboard/submissions"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-[#0C3823] font-medium transition-colors"
                      >
                        <Shield className="w-4 h-4 text-[#D4AF37]" />
                        Review Submissions
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 font-medium transition-colors text-left border-t border-stone-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 hover:text-[#0C3823] hover:bg-stone-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs"
                >
                  Register Staff
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              to="/ai-assistant"
              className="p-2 rounded-xl bg-[#FAF6EB] text-[#856404] border border-[#D4AF37]/30"
              title="AI Assistant"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-1 gap-1 pb-3 border-b border-stone-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                  isActive(link.path)
                    ? 'bg-[#0C3823] text-white'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{link.name}</span>
              </Link>
            ))}
            <Link
              to="/ai-assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-bold bg-[#FAF6EB] text-[#856404] flex items-center gap-2 border border-[#D4AF37]/40"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Wemezekr Heritage AI Assistant</span>
            </Link>
          </div>

          <div className="pt-2 space-y-2">
            <Link
              to="/register-heritage"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0C3823]/10 text-[#0C3823] font-bold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Register Collection Material
            </Link>

            {isAuthenticated && user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0C3823] text-white font-bold text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-stone-600 font-semibold text-sm hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl border border-stone-300 text-stone-800 font-bold text-sm text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-[#0C3823] text-white font-bold text-sm text-center"
                >
                  Register Staff
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
