"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Terminal, Play, Radio, Volume2, ShieldCheck, Flame, Droplets, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

interface LogMessage {
  timestamp: string;
  sender: string;
  message: string;
  type: "info" | "warning" | "critical" | "success";
}

export default function DefenseCivilMode() {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [sirenOn, setSirenOn] = useState(false);
  const [evacProgress, setEvacProgress] = useState(64);
  const [saturationRate, setSaturationRate] = useState(88);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Sound generator using Web Audio API for high-tech alerts (pure JS, no assets needed!)
  const playBeep = (freq = 880, duration = 0.15, type: OscillatorType = "sine") => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("AudioContext block: ", e);
    }
  };

  // Sirens sound looper
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sirenOn) {
      interval = setInterval(() => {
        playBeep(980, 0.4, "triangle");
        setTimeout(() => playBeep(650, 0.4, "triangle"), 400);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [sirenOn]);

  // Initial mock logs and real-time feed generator
  useEffect(() => {
    const initialLogs: LogMessage[] = [
      { timestamp: "14:26:01", sender: "SYS", message: "Conectado ao satélite meteorológico INPE-BA-9.", type: "success" },
      { timestamp: "14:26:10", sender: "SENSORES", message: "Ilhéus (Bacia Cachoeira) reportando vazão a 980 m³/s (Cota Vermelha).", type: "critical" },
      { timestamp: "14:26:45", sender: "DEFESA CIVIL", message: "Brigadas de resposta rápida mobilizadas no setor Sul (Base Ilhéus).", type: "info" },
      { timestamp: "14:27:02", sender: "IA DISPATCHER", message: "Calculando rota segura de evacuação para o Bairro Banco da Vitória.", type: "warning" },
      { timestamp: "14:27:12", sender: "TELEMETRIA", message: "Chapada Diamantina: Risco de foco ígneo em Lençóis classificado como SEVERO.", type: "warning" },
    ];
    setLogs(initialLogs);

    // Simulate logs in background
    const timer = setInterval(() => {
      const messages = [
        { sender: "SENSORES", message: "Juazeiro: Pico térmico atingido. Temperatura superficial do solo: 42.4°C.", type: "warning" },
        { sender: "SISTEMA", message: "Disparo SMS massivo enviado para 14.800 terminais móveis de Ilhéus.", type: "success" },
        { sender: "TELEMETRIA", message: "Radar pluviométrico detecta aproximação de frente de instabilidade marítima (Porto Seguro).", type: "info" },
        { sender: "IA DISPATCHER", message: "Recomendação de interdição preventiva da rodovia BA-001 (Trecho Ilhéus-Itacaré).", type: "critical" },
        { sender: "DEFESA CIVIL", message: "Compensação de vazão efetuada na barragem de Paulo Afonso.", type: "info" },
      ];

      const chosen = messages[Math.floor(Math.random() * messages.length)];
      const d = new Date();
      const timestamp = d.toLocaleTimeString("pt-BR", { hour12: false });

      setLogs((prev) => [
        ...prev,
        {
          timestamp,
          sender: chosen.sender,
          message: chosen.message,
          type: chosen.type as any,
        },
      ]);
      playBeep(520, 0.08, "sine");
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Scroll logs container to bottom when updated
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Action Triggers that feed the CLI logs
  const triggerAction = (actionName: string, type: "info" | "warning" | "critical" | "success", message: string) => {
    const d = new Date();
    const timestamp = d.toLocaleTimeString("pt-BR", { hour12: false });
    setLogs((prev) => [
      ...prev,
      {
        timestamp,
        sender: `ADMIN // ${actionName}`,
        message,
        type,
      },
    ]);
    
    // Play alert sound
    if (type === "critical") {
      playBeep(1200, 0.4, "sawtooth");
    } else {
      playBeep(880, 0.2, "sine");
    }
  };

  // Mock forecast telemetry for Recharts area graph
  const flowSimulationData = [
    { name: "10h", vazao: 420 },
    { name: "11h", vazao: 510 },
    { name: "12h", vazao: 640 },
    { name: "13h", vazao: 880 },
    { name: "14h", vazao: 980 },
    { name: "15h", vazao: 1150 },
    { name: "16h", vazao: 1300 },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4 font-mono select-none relative z-10">
      
      {/* 1. Tactical Critical Warning Banner Header */}
      <div className="glass-panel border-red-500/30 bg-red-950/10 p-3 rounded-xl flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-cyber-red animate-ping" />
          <div>
            <h2 className="text-sm font-black text-cyber-red tracking-widest">
              SITUATION COMMAND HUB : ACTIVE THREAT CONTROL
            </h2>
            <p className="text-4xs text-slate-400">RESTRICTED USE // HIGH INTENSITY CIVIL DEFENSE ENGINE</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSirenOn(!sirenOn);
            playBeep(700, 0.1, "sine");
          }}
          className={`flex items-center gap-1.5 px-3 py-1 text-2xs font-bold border rounded-lg transition-all ${
            sirenOn
              ? "bg-red-500 border-red-500 text-white shadow-[0_0_15px_#ef4444]"
              : "border-red-500/40 text-cyber-red hover:bg-red-500/10"
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${sirenOn ? "animate-spin" : ""}`} />
          {sirenOn ? "DESATIVAR SIRENE AUDIO" : "AUDIO ALARME LOCAL"}
        </button>
      </div>

      {/* 2. Main Double Columns Dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow">
        
        {/* Left Column: Command CLI & Incident logs */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 glass-panel border-red-500/20 rounded-2xl relative min-h-[350px]">
          <div className="absolute inset-0 tech-dots opacity-5 pointer-events-none" />

          {/* Console Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-red-500/20 pb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyber-red" />
              <h3 className="text-xs font-bold text-white tracking-widest">INCIDENT COMMAND TERMINAL</h3>
            </div>
            <span className="text-4xs text-slate-500">SYS.LOG.EXE</span>
          </div>

          {/* Active Logs Container */}
          <div className="relative z-10 flex-grow my-4 overflow-y-auto max-h-[220px] bg-slate-950/80 p-3 rounded-lg border border-red-500/10 space-y-2 text-3xs">
            {logs.map((log, i) => {
              let color = "text-slate-400";
              if (log.type === "critical") color = "text-cyber-red font-bold";
              if (log.type === "warning") color = "text-cyber-orange";
              if (log.type === "success") color = "text-cyber-green";

              return (
                <div key={i} className="leading-relaxed">
                  <span className="text-slate-600">[{log.timestamp}]</span>{" "}
                  <span className="text-cyber-cyan font-semibold">[{log.sender}]</span>{" "}
                  <span className={color}>{log.message}</span>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Interactive Trigger Buttons */}
          <div className="relative z-10 grid grid-cols-2 gap-2 font-mono">
            <button
              onClick={() =>
                triggerAction(
                  "SIRENE_DISPARADA",
                  "critical",
                  "Disparo manual executado para todas as sirenes do Rio Cachoeira (Ilhéus). Evacuação recomendada."
                )
              }
              className="px-2 py-2 text-3xs font-black border border-red-500/40 text-cyber-red rounded bg-red-950/10 hover:bg-red-500/20 hover:border-red-500 transition-all text-center animate-pulse"
            >
              ☢️ SIRENES GERAIS
            </button>
            <button
              onClick={() => {
                triggerAction(
                  "SMS_ENVIADO",
                  "success",
                  "Disparos de alertas via rede de celular (SMS geo-localizados) autorizados para a poligonal da Chapada Diamantina."
                );
                setEvacProgress((prev) => Math.min(prev + 5, 100));
              }}
              className="px-2 py-2 text-3xs font-black border border-orange-500/40 text-cyber-orange rounded bg-orange-950/10 hover:bg-orange-500/20 hover:border-orange-500 transition-all text-center"
            >
              💬 DISPARAR SMS
            </button>
            <button
              onClick={() =>
                triggerAction(
                  "BLOQUEIO_EFETUADO",
                  "warning",
                  "Sinalização eletrônica de trânsito em Salvador e Ilhéus atualizada: Desvios de vales ativos."
                )
              }
              className="px-2 py-2 text-3xs font-black border border-cyan-500/40 text-cyber-cyan rounded bg-cyan-950/10 hover:bg-cyan-500/20 hover:border-cyan-500 transition-all text-center"
            >
              🚧 TRÂNSITO COGNITIVO
            </button>
            <button
              onClick={() => {
                triggerAction(
                  "EVACUACAO_FULL",
                  "critical",
                  "Aviso de emergência total repassado à frota aérea de bombeiros civis da Bahia."
                );
                setEvacProgress(92);
              }}
              className="px-2 py-2 text-3xs font-black border border-white/20 text-white rounded bg-slate-900 hover:bg-white/10 transition-all text-center"
            >
              ✈️ APOIO BRIGADA AÉREA
            </button>
          </div>
        </div>

        {/* Center Column: Radar concentric sonar canvas */}
        <div className="lg:col-span-5 flex flex-col justify-between p-4 glass-panel border-red-500/20 rounded-2xl relative min-h-[350px]">
          <div className="absolute inset-0 tech-dots opacity-5 pointer-events-none" />

          {/* Sonar Title */}
          <div className="relative z-10 flex items-center justify-between border-b border-red-500/20 pb-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyber-red animate-pulse" />
              <h3 className="text-xs font-bold text-white tracking-widest">TACTICAL SONAR MONITOR</h3>
            </div>
            <span className="text-4xs text-slate-500">RADAR_SWEEP_ACTIVE</span>
          </div>

          {/* Radar animation graphic */}
          <div className="relative z-10 flex-grow flex items-center justify-center min-h-[220px]">
            {/* Spinning sweeps */}
            <div className="w-48 h-48 rounded-full border border-red-500/20 flex items-center justify-center relative overflow-hidden bg-red-950/5">
              {/* Radar sweep lines */}
              <div className="absolute inset-0 border border-red-500/10 rounded-full" />
              <div className="absolute inset-8 border border-red-500/10 rounded-full" />
              <div className="absolute inset-16 border border-red-500/15 rounded-full" />
              <div className="absolute inset-24 border border-red-500/10 rounded-full" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500/10" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500/10" />

              {/* Glowing radar line */}
              <div className="absolute inset-0 border-r border-red-500/40 rounded-full animate-radar-sweep origin-center" />

              {/* Pulsing City node inside radar */}
              <div className="absolute top-[60%] left-[30%] text-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[7px] text-white block mt-1">ILHÉUS (ALERTA_M)</span>
              </div>

              <div className="absolute top-[25%] left-[65%] text-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-[7px] text-white block mt-1">JUAZEIRO (TÉRMICO)</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[8px] text-slate-500 font-mono text-center">
            GRID SCAN AREA: 15°S 39°W - SECTOR DELTA ACTIVO
          </div>
        </div>

        {/* Right Column: Holographic gauges & Emergency charts */}
        <div className="lg:col-span-3 flex flex-col justify-between p-4 glass-panel border-red-500/20 rounded-2xl relative min-h-[350px]">
          <div className="absolute inset-0 tech-dots opacity-5 pointer-events-none" />

          {/* Gauges header */}
          <div className="relative z-10 flex items-center justify-between border-b border-red-500/20 pb-2">
            <h3 className="text-xs font-bold text-white tracking-widest">TACTICAL TELEMETRY</h3>
            <span className="text-4xs text-slate-500">WARN.VALS</span>
          </div>

          {/* Metrics Gauges column */}
          <div className="relative z-10 flex-grow my-4 space-y-4 text-3xs font-mono text-slate-400">
            {/* Evacuation Progress Meter */}
            <div>
              <div className="flex justify-between mb-1">
                <span>POP. EVACUADA (ILHÉUS ZONA 1):</span>
                <span className="text-cyber-green font-bold">{evacProgress}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 border border-red-500/10 overflow-hidden p-0.5">
                <div
                  className="h-full bg-cyber-green rounded-full transition-all duration-500 shadow-[0_0_8px_#10b981]"
                  style={{ width: `${evacProgress}%` }}
                />
              </div>
            </div>

            {/* Soil saturation progress meter */}
            <div>
              <div className="flex justify-between mb-1">
                <span>SATURAÇÃO HÍDRICA SOLO (SSA/ILHÉUS):</span>
                <span className="text-cyber-red font-bold">{saturationRate}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 border border-red-500/10 overflow-hidden p-0.5">
                <div
                  className="h-full bg-cyber-red rounded-full transition-all duration-500 animate-pulse shadow-[0_0_8px_#ef4444]"
                  style={{ width: `${saturationRate}%` }}
                />
              </div>
            </div>

            {/* Chart Area: Simulated rainfall flow drop */}
            <div className="h-24 w-full bg-slate-950/60 border border-red-500/10 rounded-lg p-2">
              <span className="text-[8px] text-slate-500 uppercase block mb-1">VAZÃO FLUVIAL ESTIMADA (m³/s)</span>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={flowSimulationData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid stroke="rgba(239,68,68,0.03)" vertical={false} />
                  <XAxis dataKey="name" fontSize={7} tickLine={false} axisLine={false} />
                  <YAxis fontSize={7} tickLine={false} axisLine={false} />
                  <Area type="monotone" dataKey="vazao" stroke="#ef4444" strokeWidth={1.5} fill="rgba(239,68,68,0.1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hotline info */}
          <div className="relative z-10 text-[9px] text-slate-500 border-t border-red-500/10 pt-2 flex items-center justify-between">
            <span>DEFESA CIVIL ESTADUAL:</span>
            <span className="text-white font-bold">199</span>
          </div>
        </div>

      </div>
    </div>
  );
}
