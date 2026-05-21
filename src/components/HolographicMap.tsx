"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, ShieldAlert, Sun, CloudRain, ShieldCheck, Cpu } from "lucide-react";

export type CityKey =
  | "salvador"
  | "ilheus"
  | "itacare"
  | "porto_seguro"
  | "lencois"
  | "juazeiro"
  | "paulo_afonso";

export interface CityData {
  key: CityKey;
  name: string;
  x: number; // SVG X coordinate
  y: number; // SVG Y coordinate
  risk: "green" | "yellow" | "orange" | "red";
  riskLabel: string;
  weather: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  safeScore: number;
  description: string;
  rainVolume: number;
}

export const CITIES_DATABASE: Record<CityKey, CityData> = {
  salvador: {
    key: "salvador",
    name: "Salvador",
    x: 480,
    y: 255,
    risk: "yellow",
    riskLabel: "Alagamento Moderado",
    weather: "Chuva Urbana",
    temp: 26,
    humidity: 88,
    windSpeed: 24,
    safeScore: 48,
    rainVolume: 42,
    description: "Risco de micro-alagamentos em avenidas de vale nas próximas 6h devido à maré alta combinada.",
  },
  ilheus: {
    key: "ilheus",
    name: "Ilhéus",
    x: 455,
    y: 345,
    risk: "red",
    riskLabel: "Enchente Crítica",
    weather: "Tempestade Tropical",
    temp: 24,
    humidity: 98,
    windSpeed: 38,
    safeScore: 12,
    rainVolume: 125,
    description: "Risco extremo de transbordamento do Rio Cachoeira nas próximas 12h. Solo saturado.",
  },
  itacare: {
    key: "itacare",
    name: "Itacaré",
    x: 460,
    y: 310,
    risk: "green",
    riskLabel: "Seguro (Brisa Leve)",
    weather: "Ensolarado c/ Nuvens",
    temp: 28,
    humidity: 68,
    windSpeed: 14,
    safeScore: 92,
    rainVolume: 5,
    description: "Condições ideias para turismo. Ondulações moderadas, sem previsão de chuvas fortes.",
  },
  porto_seguro: {
    key: "porto_seguro",
    name: "Porto Seguro",
    x: 450,
    y: 420,
    risk: "green",
    riskLabel: "Seguro",
    weather: "Ensolarado",
    temp: 29,
    humidity: 62,
    windSpeed: 12,
    safeScore: 95,
    rainVolume: 2,
    description: "Clima limpo em toda a Costa do Descobrimento. Atividades marítimas totalmente seguras.",
  },
  lencois: {
    key: "lencois",
    name: "Lençóis",
    x: 320,
    y: 240,
    risk: "orange",
    riskLabel: "Seca Severa",
    weather: "Calor Crítico",
    temp: 34,
    humidity: 28,
    windSpeed: 18,
    safeScore: 35,
    rainVolume: 0,
    description: "Nível de umidade crítico na Chapada Diamantina. Alto risco de queimadas florestais.",
  },
  juazeiro: {
    key: "juazeiro",
    name: "Juazeiro",
    x: 380,
    y: 70,
    risk: "red",
    riskLabel: "Calor Extremo",
    weather: "Aridez Extrema",
    temp: 39,
    humidity: 18,
    windSpeed: 22,
    safeScore: 18,
    rainVolume: 0,
    description: "Temperaturas excedendo 39°C. Recomendado suspensão de atividades ao ar livre entre 10h-16h.",
  },
  paulo_afonso: {
    key: "paulo_afonso",
    name: "Paulo Afonso",
    x: 480,
    y: 90,
    risk: "orange",
    riskLabel: "Calor e Seca",
    weather: "Estiagem Severa",
    temp: 36,
    humidity: 22,
    windSpeed: 25,
    safeScore: 38,
    rainVolume: 0,
    description: "Canyons monitorados. Baixo volume útil nas represas regionais e calor intenso.",
  },
};

interface HolographicMapProps {
  selectedCity: CityKey;
  onSelectCity: (city: CityKey) => void;
}

type FilterType = "radar" | "temp" | "rain" | "nodes";

export default function HolographicMap({ selectedCity, onSelectCity }: HolographicMapProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("radar");
  const [hoveredCity, setHoveredCity] = useState<CityData | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "red":
        return "#ef4444"; // Red
      case "orange":
        return "#f97316"; // Orange
      case "yellow":
        return "#f59e0b"; // Yellow
      case "green":
      default:
        return "#10b981"; // Green
    }
  };

  const getRiskPulseClass = (risk: string) => {
    switch (risk) {
      case "red":
        return "bg-red-500 shadow-[0_0_12px_#ef4444]";
      case "orange":
        return "bg-orange-500 shadow-[0_0_10px_#f97316]";
      case "yellow":
        return "bg-yellow-500 shadow-[0_0_8px_#f59e0b]";
      case "green":
      default:
        return "bg-emerald-500 shadow-[0_0_8px_#10b981]";
    }
  };

  return (
    <div className="relative w-full h-[40vh] md:h-[55vh] lg:h-[480px] xl:h-full flex flex-col justify-between p-4 glass-panel border border-cyan-500/10 rounded-2xl overflow-hidden">
      {/* Background Cybernetic Scanning overlay */}
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />
      
      {/* Laser line sweeping vertically */}
      <div className="laser-beam animate-scanline" style={{ top: "0%", height: "1.5px" }} />

      {/* Map Control Headers */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 w-full border-b border-cyan-500/10 pb-3">
        <div>
          <h2 className="text-sm md:text-md font-mono tracking-widest text-cyber-cyan flex items-center gap-2">
            <Radio className="w-4 h-4 animate-pulse text-red-500" />
            HOLOGRAPHIC SENSOR NETWORK
          </h2>
          <p className="text-2xs md:text-xs text-slate-400 font-mono">Bahia Weather System Map (Sensors: Active)</p>
        </div>

        {/* Filters Toggles (Swipeable horizontally on mobile) */}
        <div className="flex overflow-x-auto no-scrollbar max-w-full bg-slate-950/80 border border-cyan-500/20 rounded-lg p-1 gap-1">
          <button
            onClick={() => setActiveFilter("radar")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-2xs font-mono rounded transition-all whitespace-nowrap shrink-0 ${
              activeFilter === "radar"
                ? "bg-cyan-500/20 text-cyber-cyan border border-cyber-cyan/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            RADAR IA
          </button>
          <button
            onClick={() => setActiveFilter("temp")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-2xs font-mono rounded transition-all whitespace-nowrap shrink-0 ${
              activeFilter === "temp"
                ? "bg-orange-500/20 text-cyber-orange border border-cyber-orange/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            TÉRMICO
          </button>
          <button
            onClick={() => setActiveFilter("rain")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-2xs font-mono rounded transition-all whitespace-nowrap shrink-0 ${
              activeFilter === "rain"
                ? "bg-blue-500/20 text-cyan-400 border border-cyan-400/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            PLUVIOMÉTRICO
          </button>
          <button
            onClick={() => setActiveFilter("nodes")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-2xs font-mono rounded transition-all whitespace-nowrap shrink-0 ${
              activeFilter === "nodes"
                ? "bg-emerald-500/20 text-cyber-green border border-cyber-green/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            SEGURO
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative flex-grow flex items-center justify-center min-h-[200px] sm:min-h-[300px] lg:min-h-[360px]">
        {/* Radar concentric expanding rings on the selected city */}
        {(() => {
          const selected = CITIES_DATABASE[selectedCity];
          return (
            <div
              className="absolute pointer-events-none transition-all duration-700"
              style={{
                left: `${(selected.x / 600) * 100}%`,
                top: `${(selected.y / 500) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`w-16 h-16 rounded-full border border-dashed animate-radar-ping absolute -translate-x-1/2 -translate-y-1/2`}
                style={{
                  borderColor: getRiskColor(selected.risk),
                }}
              />
              <div
                className={`w-32 h-32 rounded-full border animate-radar-ping absolute -translate-x-1/2 -translate-y-1/2`}
                style={{
                  borderColor: getRiskColor(selected.risk),
                  animationDelay: "1.3s",
                }}
              />
            </div>
          );
        })()}

        {/* Dotted Radar Lines overlay behind map */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
          <div className="w-[80%] h-[80%] rounded-full border border-cyan-500/10 border-dashed animate-spin" style={{ animationDuration: "120s" }} />
          <div className="w-[50%] h-[50%] rounded-full border border-cyan-500/20 border-dashed animate-spin" style={{ animationDuration: "60s", animationDirection: "reverse" }} />
        </div>

        {/* Vector SVG State of Bahia */}
        <svg
          viewBox="0 0 600 500"
          className="w-full max-h-[440px] drop-shadow-[0_0_25px_rgba(0,216,246,0.06)] relative z-10"
        >
          {/* Definitions for Glow Gradients */}
          <defs>
            <radialGradient id="heatGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rainGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d8f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00d8f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Radar Overlay Filters */}
          {activeFilter === "temp" && (
            <>
              {/* Hotspots around Juazeiro & Lençóis */}
              <circle cx="380" cy="70" r="100" fill="url(#heatGradient)" />
              <circle cx="320" cy="240" r="70" fill="url(#heatGradient)" />
            </>
          )}

          {activeFilter === "rain" && (
            <>
              {/* Rain storm cells around Ilhéus & Salvador */}
              <circle cx="455" cy="345" r="90" fill="url(#rainGradient)" className="animate-pulse" />
              <circle cx="480" cy="255" r="60" fill="url(#rainGradient)" />
            </>
          )}

          {/* 2. Sensor Grid Mesh (Connecting lines) */}
          {activeFilter === "radar" && (
            <g opacity="0.3" stroke="#00d8f6" strokeWidth="1" strokeDasharray="3,3">
              {/* Connecting sensors together */}
              <line x1="380" y1="70" x2="480" y2="90" />
              <line x1="380" y1="70" x2="320" y2="240" />
              <line x1="320" y1="240" x2="480" y2="255" />
              <line x1="480" y1="255" x2="460" y2="310" />
              <line x1="460" y1="310" x2="455" y2="345" />
              <line x1="455" y1="345" x2="450" y2="420" />
              <line x1="320" y1="240" x2="455" y2="345" />
            </g>
          )}

          {/* 3. Bahia Vector Boundary Outline */}
          <motion.path
            d="M 220,40 L 330,30 L 400,45 L 430,70 L 490,75 L 530,130 L 515,190 L 492,230 L 485,255 L 476,258 L 470,253 L 472,263 L 484,264 L 475,278 L 468,284 L 465,305 L 462,325 L 456,360 L 452,410 L 442,460 L 420,465 L 360,440 L 300,410 L 250,390 L 195,370 L 155,340 L 120,290 L 110,230 L 85,150 L 110,120 L 160,110 Z"
            fill="rgba(9, 15, 29, 0.4)"
            stroke="rgba(0, 216, 246, 0.4)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="transition-all duration-300"
            animate={{
              stroke: selectedCity ? "rgba(0, 242, 254, 0.6)" : "rgba(0, 216, 246, 0.4)",
              fill: selectedCity ? "rgba(9, 15, 29, 0.55)" : "rgba(9, 15, 29, 0.4)",
            }}
          />

          {/* Detailed Internal Wireframe Grids */}
          <path
            d="M 220,40 L 330,30 L 400,45 L 430,70 L 490,75 L 530,130 L 515,190 L 492,230 L 485,255 L 476,258 L 470,253 L 472,263 L 484,264 L 475,278 L 468,284 L 465,305 L 462,325 L 456,360 L 452,410 L 442,460 L 420,465 L 360,440 L 300,410 L 250,390 L 195,370 L 155,340 L 120,290 L 110,230 L 85,150 L 110,120 L 160,110 Z"
            fill="none"
            stroke="rgba(0, 216, 246, 0.05)"
            strokeWidth="8"
            strokeLinejoin="round"
            pointerEvents="none"
          />

          {/* Latitude & Longitude grid lines inside the state outline */}
          <g stroke="rgba(0, 216, 246, 0.05)" strokeWidth="0.5" pointerEvents="none">
            <line x1="50" y1="100" x2="550" y2="100" />
            <line x1="50" y1="200" x2="550" y2="200" />
            <line x1="50" y1="300" x2="550" y2="300" />
            <line x1="50" y1="400" x2="550" y2="400" />
            <line x1="150" y1="20" x2="150" y2="480" />
            <line x1="250" y1="20" x2="250" y2="480" />
            <line x1="350" y1="20" x2="350" y2="480" />
            <line x1="450" y1="20" x2="450" y2="480" />
          </g>

          {/* 4. Interactive City Nodes */}
          {Object.values(CITIES_DATABASE).map((city) => {
            const isSelected = selectedCity === city.key;
            
            // Check filters to show glows
            let showPulse = true;
            if (activeFilter === "temp" && city.risk !== "red" && city.risk !== "orange") showPulse = false;
            if (activeFilter === "rain" && city.key !== "ilheus" && city.key !== "salvador") showPulse = false;
            if (activeFilter === "nodes" && city.risk !== "green") showPulse = false;

            return (
              <g
                key={city.key}
                onClick={() => onSelectCity(city.key)}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                {/* Expanding pulse animation */}
                {showPulse && (
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isSelected ? 18 : 10}
                    fill="transparent"
                    stroke={getRiskColor(city.risk)}
                    strokeWidth={isSelected ? 1.5 : 1}
                    className="origin-center"
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                    }}
                  >
                    <animate
                      attributeName="r"
                      values={`${isSelected ? 8 : 4};${isSelected ? 26 : 16}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="1;0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Core City Ring */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isSelected ? 7 : 4.5}
                  fill={isSelected ? "#00f2fe" : "#020617"}
                  stroke={isSelected ? "#00f2fe" : getRiskColor(city.risk)}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all duration-300 group-hover:scale-125"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                />

                {/* City name text label on SVG */}
                <text
                  x={city.x + 10}
                  y={city.y + 4}
                  fill={isSelected ? "#00f2fe" : "#f8fafc"}
                  fontSize={isSelected ? "11px" : "9px"}
                  fontWeight={isSelected ? "700" : "500"}
                  fontFamily="var(--font-sans)"
                  className="transition-all duration-300 pointer-events-none tracking-wider select-none font-mono"
                  opacity={isSelected ? 1 : 0.7}
                >
                  {city.name.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover/Interactive Floating HUD Card */}
        <AnimatePresence>
          {(hoveredCity || selectedCity) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-20 p-2 sm:p-3 bg-slate-950/90 border border-cyan-500/20 backdrop-blur-xl rounded-xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 text-left font-mono"
            >
              {(() => {
                const target = hoveredCity || CITIES_DATABASE[selectedCity];
                const borderClass =
                  target.risk === "red"
                    ? "border-red-500/40"
                    : target.risk === "orange"
                    ? "border-orange-500/40"
                    : target.risk === "yellow"
                    ? "border-yellow-500/40"
                    : "border-emerald-500/40";
                
                const titleColor =
                  target.risk === "red"
                    ? "text-red-500"
                    : target.risk === "orange"
                    ? "text-orange-500"
                    : target.risk === "yellow"
                    ? "text-yellow-500"
                    : "text-cyber-green";

                return (
                  <>
                    <div className="flex-1 min-w-[180px] w-full">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${getRiskPulseClass(target.risk)}`} />
                        <h4 className="text-xs sm:text-sm font-bold text-white tracking-widest">{target.name.toUpperCase()}</h4>
                        <span className={`text-[8px] sm:text-3xs px-2 py-0.5 rounded bg-slate-900 border uppercase font-mono ${borderClass} ${titleColor}`}>
                          {target.riskLabel}
                        </span>
                      </div>
                      <p className="text-3xs sm:text-2xs text-slate-400 mt-0.5 sm:mt-1 max-w-[450px] leading-relaxed">
                        {target.description}
                      </p>
                    </div>

                    <div className="flex gap-3 sm:gap-4 border-t sm:border-t-0 sm:border-l border-cyan-500/10 pt-2 sm:pt-0 pl-0 sm:pl-4 w-full sm:w-auto justify-around sm:justify-start">
                      <div className="text-center sm:text-left">
                        <div className="text-[8px] sm:text-3xs text-slate-500">TEMP</div>
                        <div className="text-xs sm:text-sm font-semibold text-cyber-cyan">{target.temp}°C</div>
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="text-[8px] sm:text-3xs text-slate-500">UMIDADE</div>
                        <div className="text-xs sm:text-sm font-semibold text-cyber-cyan">{target.humidity}%</div>
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="text-[8px] sm:text-3xs text-slate-500">SAFE SCORE</div>
                        <div className={`text-xs sm:text-sm font-semibold ${titleColor}`}>{target.safeScore}%</div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lat/Long corner telemetry markers */}
      <div className="absolute top-2 left-2 text-[8px] text-cyan-500/30 font-mono pointer-events-none select-none">
        LAT: 12° 58' 16" S<br />
        LON: 38° 30' 39" W
      </div>
      <div className="absolute top-2 right-2 text-[8px] text-cyan-500/30 font-mono text-right pointer-events-none select-none">
        SYS.LOC: GRID_BA_9.3<br />
        ALTITUDE: 12M
      </div>
      <div className="absolute bottom-2 left-2 text-[8px] text-cyan-500/30 font-mono pointer-events-none select-none">
        NODE STATE: ONLINE<br />
        GPS LOCK: 100%
      </div>
    </div>
  );
}
