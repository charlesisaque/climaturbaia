"use client";

import React from "react";
import { Shield, Sparkles, AlertCircle, Sun, Wind, CloudRain } from "lucide-react";
import { CityData } from "./HolographicMap";

interface TopBarProps {
  selectedCityData: CityData;
  isDefenseActive: boolean;
  globalRiskScore: number;
}

export default function TopBar({
  selectedCityData,
  isDefenseActive,
  globalRiskScore,
}: TopBarProps) {
  // Compute risk level labels and styles for the global score
  const getGlobalRiskText = (score: number) => {
    if (score > 75) return { text: "CRÍTICO", color: "text-red-500 border-red-500/30 bg-red-950/20" };
    if (score > 50) return { text: "SEVERO", color: "text-orange-500 border-orange-500/30 bg-orange-950/20" };
    if (score > 25) return { text: "ATENÇÃO", color: "text-yellow-500 border-yellow-500/30 bg-yellow-950/20" };
    return { text: "ESTÁVEL", color: "text-cyber-green border-emerald-500/30 bg-emerald-950/20" };
  };

  const riskMeta = getGlobalRiskText(globalRiskScore);

  return (
    <header className="relative w-full border-b border-cyan-500/10 bg-slate-950/75 backdrop-blur-xl p-3 flex flex-col md:flex-row items-center justify-between gap-4 font-mono select-none z-20">
      
      {/* 1. Scrolling Headline Marquee / AI Status */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Pulsing indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/20 border border-cyber-cyan/30 rounded-lg text-cyber-cyan text-2xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan"></span>
          </span>
          IA CLIMÁTICA ONLINE
        </div>

        {/* System active indicator */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 border rounded-lg text-2xs font-semibold transition-all duration-300 ${
            isDefenseActive
              ? "border-red-500/40 text-red-500 bg-red-950/20 animate-pulse"
              : "border-emerald-500/30 text-cyber-green bg-emerald-950/10"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isDefenseActive ? "bg-red-500 animate-ping" : "bg-cyber-green"
            }`}
          />
          {isDefenseActive ? "D. CIVIL ATIVA" : "SISTEMA ATIVO"}
        </div>
      </div>

      {/* 2. Core Cinematic Headline Ticker */}
      <div className="flex-1 max-w-xl overflow-hidden hidden lg:block border-x border-cyan-500/5 px-4">
        <div className="text-[10px] text-slate-400 font-sans tracking-wide leading-relaxed truncate text-center">
          <span className="text-cyber-cyan font-bold font-mono mr-2">{"//"} INTEL:</span>
          "Transformamos dados climáticos em alertas inteligentes para proteger vidas, turismo e cidades baianas."
        </div>
      </div>

      {/* 3. Global Risks Telemetry HUD */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {/* Selected City metrics overview */}
        <div className="flex items-center gap-3 border-r border-cyan-500/10 pr-4">
          <div className="text-right">
            <div className="text-[8px] text-slate-500">MONITORANDO:</div>
            <div className="text-2xs font-bold text-white tracking-widest uppercase">
              {selectedCityData.name}
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-1">
            {selectedCityData.risk === "green" ? (
              <Sun className="w-3.5 h-3.5 text-cyber-green" />
            ) : selectedCityData.risk === "yellow" ? (
              <Wind className="w-3.5 h-3.5 text-yellow-500" />
            ) : (
              <CloudRain className="w-3.5 h-3.5 text-cyber-red" />
            )}
            <span className="text-2xs text-cyber-cyan font-bold font-mono">{selectedCityData.temp}°C</span>
          </div>
        </div>

        {/* Global Bahia Threat Level gauge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[8px] text-slate-500">RISCO GLOBAL BAHIA:</div>
            <div className="text-2xs font-bold text-white">
              SCORE: <span className="text-cyber-cyan font-mono">{globalRiskScore}</span>/100
            </div>
          </div>
          <div className={`px-2.5 py-1 text-2xs font-bold border rounded uppercase ${riskMeta.color}`}>
            {riskMeta.text}
          </div>
        </div>
      </div>
    </header>
  );
}
