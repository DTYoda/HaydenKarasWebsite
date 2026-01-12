"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";
import AddButton from "./addbutton";

export default function EditableQuickStats({ initialData }) {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const { openEditModal, handleDelete, EditModalComponent } = useEditable("quickstat", () => {
    fetchStats();
  });

  useEffect(() => {
    // Only fetch if initialData wasn't provided
    if (!initialData) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/quickstats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statFields = [
    { name: "value", label: "Value", type: "text", required: true },
    { name: "label", label: "Label", type: "text", required: true },
    { name: "sublabel", label: "Sublabel", type: "text", required: true },
    { name: "order", label: "Order", type: "number", required: false },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-xl p-6 text-center animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 relative">
        {isAuthenticated && (
          <div className="absolute -top-12 right-0 z-10">
            <AddButton
              onClick={() => openEditModal(null, statFields)}
              label="Add Stat"
            />
          </div>
        )}
        {stats.length === 0 ? (
          <div className="col-span-4 text-center text-gray-400 py-8">
            No stats available. {isAuthenticated && "Add your first stat!"}
          </div>
        ) : (
          stats.map((stat, index) => (
          <div
            key={stat.id || index}
            className="glass rounded-xl p-6 text-center hover-lift fade-in group relative"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {isAuthenticated && (
              <>
                <EditButton
                  onClick={() => openEditModal(stat, statFields)}
                  className="absolute top-2 right-2 z-10"
                />
                <DeleteButton
                  onClick={() => handleDelete(stat.id)}
                  className="absolute top-2 left-2 z-10"
                />
              </>
            )}
            <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
              {stat.value}
            </div>
            <div className="text-sm font-semibold text-gray-300">{stat.label}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.sublabel}</div>
          </div>
        ))
        )}
      </div>
      {EditModalComponent}
    </>
  );
}

