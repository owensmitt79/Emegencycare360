import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Stethoscope, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, role, logout, user } = useAuth();

  // Hide the main header on doctor/admin dashboard pages (they have their own nav)
  const isDoctorDashboard = location.pathname.startsWith('/doctors/dashboard');
  const isAdminDashboard = location.pathname.startsWith('/admin/dashboard');
  if (isDoctorDashboard || isAdminDashboard) return null;

  const getNavLinks = () => {
    let links = [
      { path: '/', label: 'Home' },
      { path: '/services', label: 'Services' },
      { path: '/about', label: 'About' },
      { path: '/contact', label: 'Contact' },
    ];

    if (role === 'dispatcher') {
      links.push({ path: '/dispatcher', label: 'Dispatch Dashboard' });
      links.push({ path: '/responder-tracking', label: 'Live Tracking' });
    } else if (role === 'admin') {
      links.push({ path: '/responder-management', label: 'Responders' });
      links.push({ path: '/hospital-directory', label: 'Hospitals' });
      links.push({ path: '/dispatcher', label: 'Dispatch' });
    } else {
      links.push({ path: '/emergency', label: 'Emergency' });
      links.push({ path: '/emergency-request', label: 'Request Help' });
    }

    return links;
  };

  const navLinks = getNavLinks();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-primary tracking-tight">Emergencycare<span className="text-foreground">360</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />

            {/* Doctor Portal Link */}
            <Link to="/doctors/login">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Stethoscope className="w-4 h-4" />
                Doctor Portal
              </Button>
            </Link>

            {/* Admin Portal Link */}
            <Link to="/admin/login">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {user?.full_name || user?.name || 'Profile'}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm" className="font-semibold">
                  Login / Sign Up
                </Button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background shadow-lg">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Portal links in mobile */}
            <div className="pt-2 mt-2 border-t border-border space-y-2">
              <Link
                to="/doctors/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                <Stethoscope className="w-4 h-4" /> Doctor Portal
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                <Shield className="w-4 h-4" /> Admin Portal
              </Link>
            </div>

            <div className="pt-4 mt-2 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent/50 mb-2"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground text-center"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;