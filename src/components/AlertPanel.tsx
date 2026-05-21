"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Flame, Droplets, ArrowUpRight, Compass, ShieldAlert, CheckCircle } from "lucide-react";
import { CityData } from "./HolographicMap";

export interface ClimateAlert {
  id: string;
  cityKey: string;
  cityName: string;
  type: "enchente" | "seca" | "calor extremo" | "deslizamento";
  severity: "critical" | "warning" | "caution";
  time: string;
  impact: string;
  recommendation: string;
  stats: string;
}

const ALERTS_DATABASE: ClimateAlert[] = [
  {
    id: "alert-1",
    cityKey: "ilheus",
    cityName: "Ilhéus",
    type: "enchente",
    severity: "critical",
    time: "REGISTRADO HÁ 14 MINUTOS",
    impact: "Turismo Costeiro e fluvial totalmente bloqueado. Hotéis orientados a evacuar áreas ribeirinhas.",
    recommendation: "Evacuar imediatamente áreas baixas no perímetro do Rio Cachoeira. Acionar plano Alpha de defesa civil municipal.",
    stats: "Nível do rio: +4.8m acima da média",
  },
  {
    id: "alert-2",
    cityKey: "juazeiro",
    cityName: "Juazeiro",
    type: "calor extremo",
    severity: "critical",
    time: "ALERTA ATIVO - PICO TÉRMICO",
    impact: "Atividades de ecoturismo no Vale do São Francisco suspensas. Risco elevado de insolação.",
    recommendation: "Distribuição emergencial de água potável em hubs comunitários. Restrição total de atividades industriais sob sol.",
    stats: "Temperatura de Bulbo Úmido: 31.4°C",
  },
  {
    id: "alert-3",
    cityKey: "lencois",
    cityName: "Lençóis",
    type: "seca",
    severity: "warning",
    time: "MONITORAMENTO DE FOCOS",
    impact: "Trilhas de trekking e banhos de cachoeira na Chapada Diamantina sob alerta de restrição parcial.",
    recommendation: "Proibido acendimento de fogueiras ou qualquer agente inflamável. Brigadas aéreas em alerta máximo.",
    stats: "Umidade do Ar: 28% (Crítico)",
  },
  {
    id: "alert-4",
    cityKey: "salvador",
    cityName: "Salvador",
    type: "deslizamento",
    severity: "caution",
    time: "PREVISÃO ACUMULADO 6H",
    impact: "Trânsito lento nas principais vias urbanas. Visitas a monumentos históricos abertos com cautela.",
    recommendation: "Acionar sensores geológicos em encostas de risco. Evitar rotas com histórico de retenção hídrica.",
    stats: "Precipitação projetada: 45mm/h",
  },
  {
    id: "alert-5",
    cityKey: "paulo_afonso",
    cityName: "Paulo Afonso",
    type: "seca",
    severity: "warning",
    time: "MONITORAMENTO DE VAZÃO",
    impact: "Visitas guiadas aos canyons fluviais autorizadas apenas sob escolta credenciada.",
    recommendation: "Reduzir captação de reservatórios secundários. Monitorar estresse térmico em rebanhos.",
    stats: "Cota de reservatório: 22% útil",
  },
];

interface AlertPanelProps {
  selectedCity: string;
  selectedCityData: CityData;
}

export default function AlertPanel({ selectedCity, selectedCityData }: AlertPanelProps) {
  const [filter, setFilter] = useState<"todos" | "criticos" | "recomendacoes">("todos");

  // Filter alerts based on current city and selected category
  const filteredAlerts = ALERTS_DATABASE.filter((alert) => {
    // If a city is selected, show only alerts for that city or general alerts
    const cityMatches = selectedCity ? alert.cityKey === selectedCity : true;
    
    if (!cityMatches) return false;

    if (filter === "criticos") {
      return alert.severity === "critical" || alert.severity === "warning";
    }
    return true;
  });

  const getAlertIcon = (type: ClimateAlert["type"]) => {
    switch (type) {
      case "enchente":
        return <Droplets className="w-4 h-4 text-cyber-blue" />;
      case "seca":
        return <Compass className="w-4 h-4 text-cyber-orange" />;
      case "calor extremo":
        return <Flame className="w-4 h-4 text-cyber-red animate-pulse" />;
      case "deslizamento":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getSeverityBadge = (severity: ClimateAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "border-red-500/35 text-red-500 bg-red-950/20";
      case "warning":
        return "border-orange-500/35 text-orange-500 bg-orange-950/20";
      case "caution":
      default:
        return "border-yellow-500/35 text-yellow-500 bg-yellow-950/10";
    }
  };

  const getCardStyle = (severity: ClimateAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "glass-panel-red border-red-500/20";
      case "warning":
        return "glass-panel-orange border-orange-500/20";
      case "caution":
      default:
        return "glass-panel border-cyan-500/10 hover:border-yellow-500/20";
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 glass-panel border border-cyan-500/10 rounded-2xl overflow-hidden min-h-[480px]">
      <div className="absolute inset-0 tech-dots opacity-5 pointer-events-none" />

      {/* Title & Actions */}
      <div className="relative z-10 flex items-center justify-between border-b border-cyan-500/10 pb-3">
        <div>
          <h3 className="text-md font-mono text-white tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyber-red animate-pulse" />
            LIVE ALERTS ENGINE
          </h3>
          <p className="text-xs text-slate-400 font-mono">IA Climate Threat Database</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950/80 border border-cyan-500/10 rounded p-0.5 gap-0.5">
          <button
            onClick={() => setFilter("todos")}
            className={`px-2 py-0.5 text-3xs font-mono rounded transition-all ${
              filter === "todos"
                ? "bg-cyan-500/20 text-cyber-cyan font-bold"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            TODOS
          </button>
          <button
            onClick={() => setFilter("criticos")}
            className={`px-2 py-0.5 text-3xs font-mono rounded transition-all ${
              filter === "criticos"
                ? "bg-red-500/20 text-cyber-red font-bold"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            CRÍTICOS
          </button>
        </div>
      </div>

      {/* Alerts List Container */}
      <div className="flex-grow my-4 overflow-y-auto max-h-[360px] pr-1 space-y-3 relative z-10">
        <AnimatePresence mode="wait">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={`p-3.5 border rounded-xl relative overflow-hidden flex flex-col gap-3 group transition-all duration-300 ${getCardStyle(
                  alert.severity
                )}`}
              >
                {/* Visual pulsating threat indicator */}
                <div
                  className={`absolute top-0 right-0 w-1 h-full ${
                    alert.severity === "critical"
                      ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
                      : alert.severity === "warning"
                      ? "bg-orange-500 shadow-[0_0_6px_#f97316]"
                      : "bg-yellow-500"
                  }`}
                />

                {/* Card Title Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center border border-white/5">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-widest">
                        {alert.cityName.toUpperCase()} : {alert.type.toUpperCase()}
                      </h4>
                      <p className="text-4xs text-slate-500 font-mono tracking-wider">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 border rounded-full font-bold font-mono tracking-widest ${getSeverityBadge(
                      alert.severity
                    )}`}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>

                {/* Impact details */}
                <div className="text-[10px] text-slate-300 leading-relaxed font-sans pl-1 border-l border-cyan-500/10">
                  <span className="text-3xs text-slate-500 font-mono uppercase block mb-1">IMPACTO TURÍSTICO:</span>
                  {alert.impact}
                </div>

                {/* AI Automated Recommendation command block */}
                <div className="bg-slate-950/80 border border-cyan-500/5 rounded-lg p-2.5 font-mono text-[9px] text-cyber-cyan relative">
                  <div className="text-4xs text-slate-500 uppercase mb-1 flex items-center justify-between">
                    <span>⚡ CONSOLE_RECOMENDACAO_IA</span>
                    <span className="text-cyber-green text-[8px] animate-pulse">AUTO_EXEC</span>
                  </div>
                  <div className="leading-normal text-slate-200">
                    <span className="text-cyber-cyan font-bold mr-1">&gt;</span>
                    {alert.recommendation}
                  </div>
                  <div className="mt-1.5 pt-1 border-t border-cyan-500/5 text-4xs text-slate-500 flex justify-between">
                    <span>TELEMETRIA: {alert.stats}</span>
                    <ArrowUpRight className="w-3 h-3 text-cyber-cyan opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-32 flex flex-col items-center justify-center border border-dashed border-cyan-500/10 rounded-xl bg-slate-950/20 text-slate-500 font-mono text-center p-4"
            >
              <CheckCircle className="w-8 h-8 text-cyber-green mb-2 opacity-55 animate-pulse" />
              <span className="text-2xs uppercase tracking-widest text-slate-400">NENHUM ALERTA DETECTADO</span>
              <span className="text-3xs text-slate-600 mt-1 max-w-[200px]">
                {selectedCity
                  ? `Nenhum perigo climatológico ativo para a estação ${selectedCityData.name}.`
                  : "Todas as estações climatológicas da Bahia operando em regime de conformidade técnica."}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Telemetry bottom line */}
      <div className="border-t border-cyan-500/10 pt-3 relative z-10 flex items-center justify-between text-4xs text-slate-600 font-mono">
        <span>SENSOR STATUS: SYNCED</span>
        <span>BROADCASTING LIVE FEED</span>
      </div>
    </div>
  );
}
