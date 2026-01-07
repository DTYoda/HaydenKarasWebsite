"use client";

import Link from "next/link";
import Image from "next/image";

export default function PageSnippet({
  title,
  description,
  href,
  image,
  icon,
  stats,
  index,
}) {
  return (
    <Link
      href={href}
      className="group block glass rounded-2xl p-6 hover-lift transition-all duration-300 overflow-hidden relative"
      style={{
        animation: `floatIn 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && <span className="text-3xl">{icon}</span>}
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
              {title}
            </h2>
          </div>
          <span className="text-orange-500 text-xl group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-400 mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Image or Stats */}
        {image && (
          <div className="relative h-32 rounded-lg overflow-hidden mb-4 border border-orange-500/20">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        {stats && (
          <div className="flex gap-4 mt-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-bold text-orange-500">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom accent */}
        <div className="mt-4 pt-4 border-t border-orange-500/20">
          <span className="text-sm text-orange-500 font-semibold">
            View Full Page →
          </span>
        </div>
      </div>
    </Link>
  );
}
