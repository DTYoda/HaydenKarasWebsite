"use client";

export default function AddButton({ onClick, className = "", label = "Add" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${className}`}
    >
      <span className="flex items-center gap-2">
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        {label}
      </span>
    </button>
  );
}

