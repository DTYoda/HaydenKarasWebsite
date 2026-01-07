"use client";

import { useState, useEffect } from "react";

export default function CircleChart({
  skills,
  handleClick,
  sectorValue,
  currentCategory,
}) {
  let angle = 360 / skills.length;
  let [newAngle, setAngle] = useState(180 - angle / 2);

  useEffect(() => {
    angle = 360 / skills.length;
    setAngle(180 - angle / 2);
  }, [currentCategory]);

  const styles = {
    transform: "rotate(" + newAngle + "deg)",
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-orange-500/20 blur-xl"></div>
      
      {/* Main wheel container */}
      <div className="relative w-full h-full aspect-square">
        <div className="wrapper-modern transition-all w-full h-full" style={styles}>
          {skills.map((skill, num) => {
            // Sector is active if it matches the selected sectorValue
            // sectorValue is the index of the selected skill in the skills array
            const isActive = sectorValue === num;
            
            return (
              <div
                key={num}
                style={{
                  transform:
                    "rotate(" + angle * num + "deg) skew(" + (90 - angle) + "deg)",
                }}
                className={`sector-modern cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400 z-10"
                    : "bg-gray-800/50 border-gray-700/50 hover:bg-orange-500/30 hover:border-orange-500/50"
                }`}
                onClick={() => {
                  // Calculate rotation needed to bring this sector to the top
                  // The top position is at angle 180 - angle/2 (middle of first sector)
                  const targetAngle = 180 - angle / 2 - (angle * num);
                  let diff = targetAngle - newAngle;
                  
                  // Normalize to shortest rotation
                  while (diff > 180) diff -= 360;
                  while (diff < -180) diff += 360;
                  
                  setAngle((val) => val + diff);
                  handleClick(skill);
                }}
              />
            );
          })}
          
          {/* Text labels - positioned from center of wheel */}
          {skills.map((skill, num) => {
            const isActive = sectorValue === num;
            // Make text bigger
            const textSize = skills.length <= 4 ? "text-xl sm:text-2xl md:text-3xl" 
                          : skills.length <= 6 ? "text-lg sm:text-xl md:text-2xl" 
                          : "text-base sm:text-lg md:text-xl";
            
            // Calculate position - sector middle angle
            const sectorMiddleAngle = angle * num + angle / 2;
            const angleRad = (sectorMiddleAngle * Math.PI) / 180;
            // Position at 45% of radius (closer to center)
            const radiusPercent = 0.45;
            
            // Calculate position from center (50% is center)
            const x = 50 + radiusPercent * 50 * Math.cos(angleRad - Math.PI / 2);
            const y = 50 + radiusPercent * 50 * Math.sin(angleRad - Math.PI / 2);
            
            return (
              <div
                key={`text-${num}`}
                className="select-none font-semibold absolute pointer-events-none z-20"
                style={{
                  left: x + "%",
                  top: y + "%",
                  transform: `translate(-50%, -50%) rotate(${sectorMiddleAngle}deg)`,
                  transformOrigin: "center center",
                }}
              >
                <span
                  className={`${textSize} whitespace-nowrap transition-colors duration-300 ${
                    isActive ? "text-white font-bold drop-shadow-lg" : "text-gray-300"
                  }`}
                  style={{
                    display: "inline-block",
                    // Rotate text to be perpendicular to radius (readable)
                    transform: "rotate(-90deg)",
                    textAlign: "center",
                    lineHeight: "1",
                  }}
                >
                  {skill}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500/30 backdrop-blur-sm flex items-center justify-center">
            <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-orange-500/10 border border-orange-500/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
