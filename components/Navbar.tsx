'use client';

import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LANGUAGES } from '@/types';
import Icon from './ui/Icon';
import Avatar from './ui/Avatar';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/camera', label: 'Camera' },
  { path: '/games', label: 'Games' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, languageName } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(path);
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-soft border-neutral-200'
          : 'bg-white/80 backdrop-blur-xl border-neutral-100'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (user) {
                  router.push('/dashboard');
                } else {
                  router.push('/');
                }
              }}
              className="flex items-center gap-3 cursor-pointer group transition-transform duration-200 hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 flex items-center justify-center shadow-soft group-hover:shadow-soft-lg transition-shadow duration-300">
                <Icon name="heart" size={20} className="text-white drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-neutral-900 group-hover:text-primary-700 transition-colors leading-tight">
                  YaadKar
                </span>
                <span className="text-xs text-neutral-500 leading-tight">याद कर</span>
              </div>
            </a>

            {/* Center Navigation - Desktop Only */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(link.path);
                    }}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${active
                      ? 'text-primary-600'
                      : 'text-neutral-600 hover:text-primary-500'
                      }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-600 rounded-full" />
                    )}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 transition-transform duration-200 origin-left ${active ? 'scale-x-100' : 'scale-x-0'
                        }`}
                    />
                  </a>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Language Selector - Desktop */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-100 transition-all duration-200 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label="Change Language"
                  aria-expanded={showLangDropdown}
                >
                  <Icon name="globe" size={18} className="text-primary-600" />
                  <span className="text-neutral-700">{language.toUpperCase().split('-')[0]}</span>
                </button>

                {showLangDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLangDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-soft-lg border border-neutral-200 z-50 py-2 animate-fade-in overflow-hidden">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLangDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 hover:bg-primary-50 hover:pl-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset ${language === lang.code
                            ? 'text-primary-700 bg-primary-50 font-semibold'
                            : 'text-neutral-700'
                            }`}
                        >
                          <span className="font-medium">{lang.nativeName}</span>
                          {language === lang.code && (
                            <Icon name="check" size={16} className="text-primary-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* User Menu - Desktop */}
              {user && (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-neutral-100 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    aria-label="User Menu"
                    aria-expanded={showUserMenu}
                  >
                    <Avatar
                      src={user.photoURL || undefined}
                      name={user.displayName || ''}
                      size="sm"
                    />
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-soft-lg border border-neutral-200 z-50 py-2 animate-fade-in overflow-hidden">
                        {/* User Header */}
                        <div className="px-4 py-3 border-b border-neutral-100">
                          <p className="font-semibold text-neutral-900 truncate">
                            {user.displayName || 'User'}
                          </p>
                          <p className="text-sm text-neutral-500 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        {/* Settings */}
                        <button
                          onClick={() => {
                            router.push('/settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-all duration-200 hover:pl-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
                        >
                          <Icon name="settings" size={16} />
                          <span className="font-medium">Settings</span>
                        </button>

                        {/* Help */}
                        <button
                          onClick={() => {
                            // Add help page route or modal
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-all duration-200 hover:pl-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
                        >
                          <Icon name="help" size={16} />
                          <span className="font-medium">Help</span>
                        </button>

                        {/* Divider */}
                        <div className="h-px bg-neutral-100 my-1" />

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 hover:pl-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-inset"
                        >
                          <Icon name="logout" size={16} />
                          <span className="font-medium">Sign out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="Menu"
              >
                <Icon
                  name={isMobileMenuOpen ? 'x' : 'menu'}
                  size={24}
                  className="text-neutral-700"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-[70] shadow-2xl transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 flex items-center justify-center">
                  <Icon name="heart" size={20} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-neutral-900">YaadKar</span>
                  <span className="text-xs text-neutral-500">याद कर</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-neutral-100 transition-all"
                aria-label="Close"
              >
                <Icon name="x" size={24} className="text-neutral-700" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-4 space-y-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                  >
                    {link.path === '/dashboard' && <Icon name="home" size={20} />}
                    {link.path === '/camera' && <Icon name="camera" size={20} />}
                    {link.path === '/games' && <Icon name="gamepad" size={20} />}
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Language Selector - Mobile */}
            <div className="p-4 border-t border-neutral-200">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-neutral-700 hover:bg-neutral-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Icon name="globe" size={20} className="text-primary-600" />
                  <span>Language</span>
                </div>
                <span className="text-sm text-neutral-500">{languageName}</span>
              </button>

              {showLangDropdown && (
                <div className="mt-2 space-y-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${language === lang.code
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                    >
                      <span>{lang.nativeName}</span>
                      {language === lang.code && (
                        <Icon name="check" size={16} className="text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Section - Mobile */}
            {user && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 bg-neutral-50">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar
                    src={user.photoURL || undefined}
                    name={user.displayName || ''}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 truncate">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      router.push('/settings');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-100 transition-all"
                  >
                    <Icon name="settings" size={18} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-all"
                  >
                    <Icon name="logout" size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
