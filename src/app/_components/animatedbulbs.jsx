"use client";

export default function AnimatedBulbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Animated bulb 1 - top right area */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl animated-bulb-1"></div>
      
      {/* Animated bulb 2 - bottom left area */}
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animated-bulb-2"></div>
      
      {/* Animated bulb 3 - center area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/12 rounded-full blur-3xl animated-bulb-3"></div>
    </div>
  );
}

