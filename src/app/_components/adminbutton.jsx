"use client";

import { useState } from "react";
import { useAuth } from "./authprovider";
import LoginModal from "./loginmodal";

export default function AdminButton() {
  const { isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (isAuthenticated) {
    return (
      <button
        onClick={logout}
        className="fixed bottom-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-2 shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
        title="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span className="hidden sm:inline">Logout</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLogin(true)}
        className="fixed bottom-4 right-4 z-50 bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
        title="Admin Login"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span className="hidden sm:inline">Admin</span>
      </button>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

