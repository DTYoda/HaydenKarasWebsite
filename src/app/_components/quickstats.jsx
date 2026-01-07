"use client";

import { useEffect, useState } from "react";

const fallbackStats = [
  { value: "8+", label: "Years", sublabel: "Coding" },
  { value: "7+", label: "Languages", sublabel: "Proficient" },
  { value: "20+", label: "Projects", sublabel: "Completed" },
  { value: "Top 10", label: "National", sublabel: "Competitions" },
];

export default function QuickStats() {
  const [stats, setStats] = useState(fallbackStats);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/quickstats");
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="glass rounded-xl p-6 text-center hover-lift fade-in group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
            {stat.value}
          </div>
          <div className="text-sm font-semibold text-gray-300">{stat.label}</div>
          <div className="text-xs text-gray-500 mt-1">{stat.sublabel}</div>
        </div>
      ))}
    </div>
  );
}

