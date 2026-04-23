"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./authprovider";

export default function Navigation() {
  const active = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/portfolio", label: "Work" },
    { href: "/experience", label: "Experience" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          <Link
            href="/"
            className="mono text-lg sm:text-xl font-bold gradient-text hover:scale-105 transition-transform duration-300"
            onClick={closeMobileMenu}
          >
            {"<HK />"}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 items-center">
            {navItems.map((item) => {
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? "text-orange-500 bg-orange-500/10"
                      : "text-gray-300 hover:text-orange-500 hover:bg-orange-500/5"
                  }`}
                  href={item.href}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <span className="absolute inset-0 bg-orange-500/20 rounded-lg blur-sm"></span>
                  )}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transition-all duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                  active === "/admin/blog"
                    ? "text-orange-500 bg-orange-500/10"
                    : "text-gray-300 hover:text-orange-500 hover:bg-orange-500/5"
                }`}
                href="/admin/blog"
              >
                <span className="relative z-10">Admin Blog</span>
                {active === "/admin/blog" && (
                  <span className="absolute inset-0 bg-orange-500/20 rounded-lg blur-sm"></span>
                )}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transition-all duration-300 ${
                    active === "/admin/blog"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-300 hover:text-orange-500 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActive
                      ? "text-orange-500 bg-orange-500/10 border-l-4 border-orange-500"
                      : "text-gray-300 hover:text-orange-500 hover:bg-orange-500/5"
                  }`}
                  href={item.href}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                  active === "/admin/blog"
                    ? "text-orange-500 bg-orange-500/10 border-l-4 border-orange-500"
                    : "text-gray-300 hover:text-orange-500 hover:bg-orange-500/5"
                }`}
                href="/admin/blog"
                onClick={closeMobileMenu}
              >
                Admin Blog
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
