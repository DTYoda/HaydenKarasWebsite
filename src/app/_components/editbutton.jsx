"use client";

export default function EditButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-2 right-2 z-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 ${className}`}
      title="Edit"
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
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </button>
  );
}

