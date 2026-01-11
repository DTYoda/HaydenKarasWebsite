import Image from "next/image";

// Format date as "Month Year"
const formatDateDisplay = (dateStr) => {
  if (!dateStr || dateStr === "undefined" || dateStr === "null") return "";
  
  try {
    // Handle YYYY-MM format
    const yyyyMmMatch = dateStr.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
    if (yyyyMmMatch) {
      const year = parseInt(yyyyMmMatch[1]);
      const month = parseInt(yyyyMmMatch[2]) - 1; // Month is 0-indexed
      const date = new Date(year, month, 1);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
    
    // Try parsing as date string
    const date = new Date(dateStr + "T00:00:00");
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
  } catch {}
  
  return dateStr;
};

export default function PortfolioResult({ link, title, type, date, image }) {
  // Handle both local paths and Supabase URLs
  const getImageSrc = () => {
    if (!image) return "/icon.png"; // Fallback
    // If it's already a full URL (Supabase), return as is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    // Otherwise, construct local path
    return "/" + link + "/" + image;
  };

  return (
    <a className="w-64 text-left group block" href={"/portfolio/" + link}>
      <div className="relative overflow-hidden rounded-2xl mb-4 hover-lift">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/100 rounded-2xl transition-all duration-300 z-10"></div>
        <Image
          height={256}
          width={256}
          className="w-64 h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          src={getImageSrc()}
          alt={title}
        />
      </div>
      <div className="w-64 flex flex-col">
        <div className="font-bold text-lg mb-1 text-gray-200 group-hover:text-orange-500 transition-colors duration-300">
          {title}
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500 mt-1"></span>
        </div>
        <div className="text-sm text-orange-500/80 font-medium mb-1">
          {type}
        </div>
        <div className="text-xs text-gray-500">{formatDateDisplay(date)}</div>
      </div>
    </a>
  );
}
