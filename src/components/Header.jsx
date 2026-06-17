import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo.jsx';
import { Menu, X, User, LogOut, Stethoscope, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import LanguageSwitcher from '@/components/LanguageSwitcher.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTranslation } from '@/contexts/TranslationContext.jsx';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, role, logout, user } = useAuth();
  const { t } = useTranslation();

  // Hide the main header on doctor/admin dashboard and clinical operations pages
  const hideHeaderPaths = [
    '/admin',
    '/dispatcher',
    '/doctors/availability',
    '/doctors/dashboard',
    '/hospitals'
  ];
  if (hideHeaderPaths.some(p => pathname.startsWith(p))) {
    return null;
  }

  const getNavLinks = () => {
    let links = [
      { path: '/', label: t('home') },
      { path: '/about', label: t('about') || 'About Us' },
      { path: '/services', label: t('services') },
      { path: '/contact', label: t('contact') },
    ];

    if (role === 'dispatcher') {
      links.push({ path: '/dispatcher', label: t('dashboard') });
      links.push({ path: '/responder-tracking', label: t('coverage') });
    } else if (role === 'admin') {
      links.push({ path: '/responder-management', label: t('services') });
      links.push({ path: '/hospital-directory', label: t('about') });
      links.push({ path: '/dispatcher', label: t('dashboard') });
    }

    return links;
  };

  const navLinks = getNavLinks();
  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-10 h-10 sm:w-12 sm:h-12" />
            <span className="text-2xl font-extrabold text-primary tracking-tight">Emergencycare<span className="text-foreground">360</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
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

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {user?.full_name || user?.name || 'Profile'}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="font-semibold gap-2">
                    Sign In <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-md">
                  <DropdownMenuLabel>Select Portal</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer w-full flex items-center gap-2">
                      <User className="w-4 h-4" /> Patient Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/doctors/login" className="cursor-pointer w-full flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" /> Doctor Portal
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/login" className="cursor-pointer w-full flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Admin Portal
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                href={link.path}
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
                href="/doctors/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                <Stethoscope className="w-4 h-4" /> Doctor Portal
              </Link>
              <Link
                href="/admin/login"
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
                    href="/profile"
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
                  href="/login"
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