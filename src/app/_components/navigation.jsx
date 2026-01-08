"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const active = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Work" },
    { href: "/experience", label: "Experience" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          <Link
            href="/"
            className="mono text-xl font-bold gradient-text hover:scale-105 transition-transform duration-300"
          >
            {"<HK />"}
          </Link>
          <div className="gap-2 items-center flex">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
