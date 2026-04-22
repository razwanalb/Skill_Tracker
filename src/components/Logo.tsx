import React from 'react';
import logoImage from '../images/my_logo.png';

export function Logo({
  className = "w-8 h-8",
  textClass = "font-extrabold text-xl",
  showText = true
}: {
  className?: string,
  textClass?: string,
  showText?: boolean
}) {
  return (
    <div className="flex items-center gap-2 group">
      <img
        src={logoImage}
        alt="Skill Tracker Logo"
        className={`${className} rounded-[25%] shadow-lg transition-transform group-hover:scale-105`}
      />

      {/* Text matching "text+logo" */}
      {showText && (
        <span className={`tracking-tight text-ink ${textClass}`}>
          Skill Tracker
        </span>
      )}
    </div>
  );
}
