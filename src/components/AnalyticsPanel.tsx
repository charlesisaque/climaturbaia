"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Sun, CloudRain, Wind, Droplets, Info } from "lucide-react";
import { CityData } from "./HolographicMap";

interface AnalyticsPanelProps {
  selectedCityData: CityData;
}

export default function AnalyticsPanel({ selectedCityData }: AnalyticsPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"temp" | "wind">("temp");

  // Prevent hydration discrepancies with Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  const getSafeScoreMeta = (score: number) => {
    if (score <= 25) {
      return { label: "SEGURO", color: "text-cyber-green", border: "border-emerald-500/20 bg-emerald-950/10", stroke: "#10b981" };
    } else if (score <= 50) {
      return { label: "ATENÇÃO", color: "text-yellow-500", border: "border-yellow-500/20 bg-yellow-950/10", stroke: "#f59e0b" };
    } else if (score <= 75) {
      return { label: "ALTO RISCO", color: "text-cyber-orange", border: "border-orange-500/20 bg-orange-950/10", stroke: "#f97316" };
    } else {
      return { label: "CRÍTICO", color: "text-cyber-red", border: "border-red-500/20 bg-red-950/10", stroke: "#ef4444" };
    }
  };

  const scoreMeta = getSafeScoreMeta(selectedCityData.safeScore);

  // Generate 24h mockup weather telemetry based on city metrics
  const generate24hData = () => {
    const baseTemp = selectedCityData.temp;
    const baseHum = selectedCityData.humidity;
    const baseWind = selectedCityData.windSpeed;
    const baseRain = selectedCityData.rainVolume;

    const hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];

    return hours.map((h, i) => {
      // Create slight variations depending on time of day
      const tempVar = Math.sin((i / 6) * Math.PI * 2 - Math.PI / 2) * 3;
      const humidityVar = -Math.sin((i / 6) * Math.PI * 2 - Math.PI / 2) * 10;
      
      return {
        time: h,
        temperatura: Math.round(baseTemp + tempVar),
        umidade: Math.min(Math.max(Math.round(baseHum + humidityVar), 10), 100),
        vento: Math.round(baseWind + (Math.random() - 0.5) * 6),
        chuva: baseRain > 10 ? Math.round(baseRain / 4 + Math.random() * 10) : baseRain > 0 ? Math.round(Math.random() * 5) : 0,
      };
    });
  };

  const chartData = generate24hData();

  if (!mounted) {
    return (
      <div className="w-full h-80 glass-panel rounded-2xl flex items-center justify-center font-mono text-xs text-slate-500">
        INITIALIZING GRAPHICS HUD...
      </div>
    );
  }

  // Circular gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (selectedCityData.safeScore / 100) * circumference;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Tourist Safe Score Visual Gauge Card */}
      <div className="lg:col-span-4 flex flex-col justify-between p-4 glass-panel border border-cyan-500/10 rounded-2xl relative min-h-[300px]">
        <div className="absolute inset-0 tech-dots opacity-5 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between border-b border-cyan-500/10 pb-2">
          <div>
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">TOURIST SAFE SCORE™</h3>
            <p className="text-4xs text-slate-500">Global Smart Safety Index</p>
          </div>
          <span title="Fatores: Umidade, Temperatura, Velocidade do Vento e Alertas Pluviométricos.">
            <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
          </span>
        </div>

        {/* Circular SVG Gauge Ring */}
        <div className="relative z-10 flex flex-col items-center justify-center my-4">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="rgba(0, 216, 246, 0.05)"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Pulsing indicator gradient arc */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={scoreMeta.stroke}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 6px ${scoreMeta.stroke})`,
              }}
            />
          </svg>

          {/* Number indicator in center */}
          <div className="absolute flex flex-col items-center justify-center font-mono">
            <span className="text-2xl font-black text-white">{selectedCityData.safeScore}</span>
            <span className="text-4xs text-slate-500">INDEX VALUE</span>
          </div>

          {/* Safety level pill banner */}
          <div className={`mt-3 px-3 py-1 border rounded-full text-xs font-bold font-mono tracking-widest ${scoreMeta.border} ${scoreMeta.color}`}>
            {scoreMeta.label}
          </div>
        </div>

        {/* Scale definitions summary */}
        <div className="relative z-10 text-[8px] text-slate-500 font-mono grid grid-cols-4 gap-1 text-center bg-slate-950/60 p-2 rounded-lg border border-cyan-500/5">
          <div>
            <div className="text-cyber-green font-bold">0-25</div>
            <div>SEGURO</div>
          </div>
          <div>
            <div className="text-yellow-500 font-bold">26-50</div>
            <div>ATENÇÃO</div>
          </div>
          <div>
            <div className="text-cyber-orange font-bold">51-75</div>
            <div>ALTO RISCO</div>
          </div>
          <div>
            <div className="text-cyber-red font-bold">76-100</div>
            <div>CRÍTICO</div>
          </div>
        </div>
      </div>

      {/* 2. 24h Interactive Recharts Analytics Area Chart */}
      <div className="lg:col-span-8 flex flex-col justify-between p-4 glass-panel border border-cyan-500/10 rounded-2xl relative min-h-[300px]">
        <div className="absolute inset-0 tech-dots opacity-5 pointer-events-none" />

        {/* Chart Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-cyan-500/10 pb-2">
          <div>
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">PREVISÃO CLIMÁTICA 24H</h3>
            <p className="text-4xs text-slate-500">Estação de telemetria: {selectedCityData.name}</p>
          </div>

          {/* Selector Tabs */}
          <div className="flex overflow-x-auto no-scrollbar max-w-[55%] sm:max-w-none bg-slate-950/80 border border-cyan-500/10 rounded p-0.5 gap-0.5 font-mono">
            <button
              onClick={() => setActiveTab("temp")}
              className={`px-2.5 py-1 text-[8px] sm:text-4xs rounded transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "temp"
                  ? "bg-cyan-500/20 text-cyber-cyan font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              TEMPERATURA / UMIDADE
            </button>
            <button
              onClick={() => setActiveTab("wind")}
              className={`px-2.5 py-1 text-[8px] sm:text-4xs rounded transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "wind"
                  ? "bg-cyan-500/20 text-cyber-cyan font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              VENTO / CHUVA
            </button>
          </div>
        </div>

        {/* Graph Render Container */}
        <div className="relative z-10 flex-grow h-40 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humidityGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="windGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(0,216,246,0.03)" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.3)"
                fontSize={8}
                tickLine={false}
                axisLine={false}
                fontFamily="var(--font-mono)"
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                fontSize={8}
                tickLine={false}
                axisLine={false}
                fontFamily="var(--font-mono)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(2, 6, 23, 0.95)",
                  borderColor: "rgba(0, 242, 254, 0.2)",
                  borderRadius: "8px",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                  color: "#f8fafc",
                }}
              />
              {activeTab === "temp" ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="temperatura"
                    stroke="#00f2fe"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#tempGlow)"
                    name="Temperatura (°C)"
                  />
                  <Area
                    type="monotone"
                    dataKey="umidade"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#humidityGlow)"
                    name="Umidade (%)"
                  />
                </>
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="vento"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#windGlow)"
                    name="Vento (km/h)"
                  />
                  <Area
                    type="monotone"
                    dataKey="chuva"
                    stroke="#00d8f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#tempGlow)"
                    name="Chuva (mm)"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Real-time counters list */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-cyan-500/10 text-left font-mono">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-white/5 text-cyber-cyan shadow-[0_0_8px_rgba(0,216,246,0.1)]">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[7px] text-slate-500 uppercase leading-none">TEMPERATURA</div>
              <div className="text-sm font-black text-white">{selectedCityData.temp}°C</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-white/5 text-red-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[7px] text-slate-500 uppercase leading-none">UMIDADE REL.</div>
              <div className="text-sm font-black text-white">{selectedCityData.humidity}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-white/5 text-cyber-green">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[7px] text-slate-500 uppercase leading-none">VENTO PROJETADO</div>
              <div className="text-sm font-black text-white">{selectedCityData.windSpeed} km/h</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-white/5 text-cyan-400">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[7px] text-slate-500 uppercase leading-none">VOLUME CHUVA</div>
              <div className="text-sm font-black text-white">{selectedCityData.rainVolume} mm</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
