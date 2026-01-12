"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_components/authprovider";
import Navigation from "../_components/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(password);

    if (result.success) {
      setPassword("");
      // Redirect to home page after successful login
      router.push("/");
    } else {
      setError(result.message || "Invalid password");
    }

    setLoading(false);
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen relative">
      <div style={{ zIndex: 10, position: 'relative' }}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6">
        <div className="glass rounded-2xl p-8 max-w-md w-full border border-orange-500/50">
          <div className="mb-6">
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Admin Login
            </h2>
            <p className="text-gray-400 text-sm">
              Enter your password to access admin features
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
