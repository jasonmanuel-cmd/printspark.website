"use client";

import { useState, useEffect } from "react";

interface LogoInstance {
  id: number;
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  opacity: number;
}

const LOGO_PATH =
  "M8 0L4 16h8L8 32l6-14H8l6-14L8-2z";

function createInstances(): LogoInstance[] {
  const instances: LogoInstance[] = [];
  const colors = ["#FF6B35", "#1E3A8A", "#14B8A6", "#FF8C61", "#2563EB"];

  for (let i = 0; i < 12; i++) {
    const size = 80 + Math.floor(Math.random() * 180);
    instances.push({
      id: i,
      size,
      left: Math.random() * 90,
      top: Math.random() * 90,
      duration: 30 + Math.random() * 30,
      delay: Math.random() * 25,
      opacity: 0.02 + Math.random() * 0.06,
    });
  }

  return instances;
}

export function FloatingLogos() {
  const [logos, setLogos] = useState<LogoInstance[]>([]);

  useEffect(() => {
    setLogos(createInstances());
  }, []);

  if (logos.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {logos.map((logo) => (
        <svg
          key={logo.id}
          viewBox="0 0 32 32"
          className="absolute"
          style={{
            left: `${logo.left}%`,
            top: `${logo.top}%`,
            width: logo.size,
            height: logo.size,
            opacity: logo.opacity,
            animation: `float ${logo.duration}s ease-in-out ${logo.delay}s infinite`,
          }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={LOGO_PATH} fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
