"use client";

import { useEffect, useState } from "react";
import { normalizeTagKey } from "@/lib/tags";

export function useTagUsage() {
  const [usageMap, setUsageMap] = useState({});

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch("/api/tagusage?all=1");
        if (!response.ok) return;
        const data = await response.json();
        setUsageMap(data.data || {});
      } catch (error) {
        console.error("Error loading tag usage map:", error);
      }
    };

    fetchUsage();
  }, []);

  const getUsage = (tag) => usageMap[normalizeTagKey(tag)] || null;

  const loadTagUsage = async (tag) => {
    const existing = getUsage(tag);
    if (existing) return existing;

    try {
      const response = await fetch(`/api/tagusage?tag=${encodeURIComponent(tag)}`);
      if (!response.ok) return null;
      const data = await response.json();
      if (!data.data) return null;
      setUsageMap((prev) => ({ ...prev, [normalizeTagKey(tag)]: data.data }));
      return data.data;
    } catch (error) {
      console.error("Error loading tag usage:", error);
      return null;
    }
  };

  return {
    usageMap,
    getUsage,
    loadTagUsage,
  };
}
