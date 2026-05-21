"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Globe,
  AlertTriangle,
  Palmtree,
  ShieldAlert,
  LineChart,
  Sliders,
  Cpu,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";

export type SidebarTab =
  | "dashboard"
  | "mapa"
  | "alertas"
  | "turismo"
  | "defesa_civil"
  | "analytics"
  | "config";

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  isDefenseActive: boolean;
  setIsDefenseActive: (active: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

interface MenuItem {
  id: SidebarTab;
  label: string;
  icon: React.ComponentType<any>;
  glowColor: string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isDefenseActive,
  setIsDefenseActive,
  soundEnabled,
  setSoundEnabled,
}: SidebarProps) {
  const [cpuUsage, setCpuUsage] = useState(14.2);
  const [sysTime, setSysTime] = useState("");

  // Simulated server ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => {
        const delta = (Math.random() - 0.5) * 4;
        const next = prev + delta;
        return Number(Math.min(Math.max(next, 5), 35).toFixed(1));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Time stamp formatter
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setSysTime(
        d.toLocaleTimeString("pt-BR", { hour12: false }) +
          "." +
          String(d.getMilliseconds()).padStart(3, "0")
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, glowColor: "shadow-cyber-cyan" },
    { id: "mapa", label: "Mapa Climático", icon: Globe, glowColor: "shadow-cyber-blue" },
    { id: "alertas", label: "Alertas Críticos", icon: AlertTriangle, glowColor: "shadow-cyber-orange" },
    { id: "turismo", label: "Turismo Seguro", icon: Palmtree, glowColor: "shadow-cyber-green" },
    { id: "defesa_civil", label: "Defesa Civil", icon: ShieldAlert, glowColor: "shadow-cyber-red" },
    { id: "analytics", label: "Analytics", icon: LineChart, glowColor: "shadow-cyber-cyan" },
    { id: "config", label: "Configurações", icon: Sliders, glowColor: "shadow-slate-500" },
  ];

  const handleTabClick = (tabId: SidebarTab) => {
    setActiveTab(tabId);
    if (tabId === "defesa_civil") {
      setIsDefenseActive(true);
    } else {
      setIsDefenseActive(false);
    }
  };

  return (
    <aside className="w-64 h-full flex flex-col justify-between p-4 bg-slate-950/80 border-r border-cyan-500/10 backdrop-blur-xl relative font-mono select-none z-30">
      {/* tech-dots mask for design styling */}
      <div className="absolute inset-0 tech-dots opacity-5 pointer-events-none" />

      {/* Main Top Brand Area */}
      <div className="flex flex-col gap-6">
        {/* Brand/Logo */}
        <div className="flex items-center gap-3 border-b border-cyan-500/10 pb-4">
          <div className="w-8 h-8 rounded border border-cyber-cyan/50 flex items-center justify-center relative overflow-hidden bg-cyan-950/20">
            {/* Spinning holographic core */}
            <div className="absolute inset-0.5 rounded-full border border-dashed border-cyber-cyan animate-spin" style={{ animationDuration: "12s" }} />
            <Cpu className="w-4 h-4 text-cyber-cyan animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-white flex items-center gap-1">
              CLIMA<span className="text-cyber-cyan">TUR</span>
            </h1>
            <p className="text-[8px] text-slate-500 tracking-[0.2em] uppercase font-bold">BAIA INTEL SYSTEM</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            // Check if defence mode is active and styling needs red Alert overlay
            let activeStyle = "text-slate-400 hover:text-white hover:bg-white/5 border-transparent";
            if (isActive) {
              const isDef = (item.id as string) === "defesa_civil";
              if (isDef) {
                activeStyle = "bg-red-500/10 text-cyber-red border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]";
              } else {
                activeStyle = "bg-cyan-500/10 text-cyber-cyan border-cyber-cyan/50 shadow-[0_0_15px_rgba(0,216,246,0.15)]";
              }
            }

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold border-l-2 rounded-r transition-all duration-200 cursor-pointer ${activeStyle}`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? "scale-105" : ""}`} />
                <span className="tracking-widest uppercase">{item.label}</span>

                {/* Pulsing state dots for specific critical tabs */}
                {item.id === "alertas" && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_4px_#f97316]" />
                )}
                {item.id === "defesa_civil" && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shadow-[0_0_6px_#ef4444]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Diagnostics / Ticker at Bottom */}
      <div className="flex flex-col gap-3 border-t border-cyan-500/10 pt-4 text-3xs text-slate-500">
        {/* Core telemetry details */}
        <div className="flex items-center justify-between">
          <span>AI CORE LOAD:</span>
          <span className="text-cyber-cyan font-bold font-mono">{cpuUsage}%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-1 border border-cyan-500/5 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isDefenseActive ? "bg-red-500" : "bg-cyber-cyan"
            }`}
            style={{ width: `${cpuUsage * 2}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span>HOST TIME:</span>
          <span className="text-slate-400 font-mono">{sysTime}</span>
        </div>

        <div className="flex items-center justify-between border-t border-cyan-500/5 pt-2">
          <span className="flex items-center gap-1.5">
            <RefreshCw className="w-2.5 h-2.5 animate-spin text-slate-600" />
            STATION ID: SSA_NODE_A
          </span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 hover:bg-slate-900 border border-slate-800 rounded transition-all"
            title="Toggle Dashboard Audio Alerts"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyber-cyan" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
