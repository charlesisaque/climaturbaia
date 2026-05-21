"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar, { SidebarTab } from "../components/Sidebar";
import TopBar from "../components/TopBar";
import HolographicMap, { CityKey, CITIES_DATABASE, CityData } from "../components/HolographicMap";
import AlertPanel from "../components/AlertPanel";
import AnalyticsPanel from "../components/AnalyticsPanel";
import DefenseCivilMode from "../components/DefenseCivilMode";
import WeatherParticles from "../components/WeatherParticles";
import { Palmtree, Sliders, ShieldCheck, HelpCircle, Sun, CloudRain, ShieldAlert } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");
  const [selectedCity, setSelectedCity] = useState<CityKey>("ilheus");
  const [isDefenseActive, setIsDefenseActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Simulation controls state (modified by Config tab)
  const [simRainFactor, setSimRainFactor] = useState(0); // 0 to 100 increase mm
  const [simTempFactor, setSimTempFactor] = useState(0); // -10 to +10 degrees C
  const [simWindFactor, setSimWindFactor] = useState(0); // 0 to 50 km/h

  // Sound generator helper for page navigation clicks
  const playClick = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.08);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      console.warn("AudioContext error: ", e);
    }
  };

  // Trigger sound when changing tabs
  useEffect(() => {
    playClick();
  }, [activeTab]);

  // Compute selected city data merged with active simulations
  const getSimulatedCityData = (cityKey: CityKey): CityData => {
    const defaultData = CITIES_DATABASE[cityKey];
    
    // Apply simulations
    const temp = defaultData.temp + simTempFactor;
    const windSpeed = defaultData.windSpeed + simWindFactor;
    
    let rainVolume = defaultData.rainVolume;
    if (defaultData.risk === "red" || defaultData.risk === "yellow") {
      rainVolume = defaultData.rainVolume + simRainFactor;
    } else if (simRainFactor > 40) {
      // dry cities get mild rain
      rainVolume = Math.round(simRainFactor / 3);
    }

    // Recompute risk dynamic colors and safe scores based on simulations
    let safeScore = defaultData.safeScore;
    if (simRainFactor > 30 && (cityKey === "ilheus" || cityKey === "salvador")) {
      safeScore = Math.max(safeScore - Math.round(simRainFactor / 2), 5);
    }
    if (simTempFactor > 5 && (cityKey === "juazeiro" || cityKey === "lencois")) {
      safeScore = Math.max(safeScore - (simTempFactor * 3), 5);
    }

    let risk = defaultData.risk;
    if (safeScore < 20) {
      risk = "red";
    } else if (safeScore < 45) {
      risk = "orange";
    } else if (safeScore < 70) {
      risk = "yellow";
    } else {
      risk = "green";
    }

    const riskLabelsMap = {
      red: "Crítico / Risco Extremo",
      orange: "Severo / Alerta Laranja",
      yellow: "Moderado / Monitoramento",
      green: "Seguro / Normalidade",
    };

    return {
      ...defaultData,
      temp,
      windSpeed,
      rainVolume,
      safeScore,
      risk,
      riskLabel: riskLabelsMap[risk],
    };
  };

  const activeCityData = getSimulatedCityData(selectedCity);

  // Compute global threat index based on simulated scores of all cities
  const computeGlobalRisk = (): number => {
    const citiesKeys = Object.keys(CITIES_DATABASE) as CityKey[];
    const totalSafeScore = citiesKeys.reduce((acc, cur) => acc + getSimulatedCityData(cur).safeScore, 0);
    const avgSafeScore = totalSafeScore / citiesKeys.length;
    // Threat level is inverse of safety score
    return Math.round(100 - avgSafeScore);
  };

  const globalRiskScore = computeGlobalRisk();

  // Resolve active particle weather based on city risk type
  const getWeatherParticleType = () => {
    if (isDefenseActive) return "defense";
    if (activeCityData.risk === "red" && (selectedCity === "ilheus" || selectedCity === "salvador")) return "rain";
    if (activeCityData.risk === "red" && selectedCity === "juazeiro") return "heatwave";
    if (activeCityData.risk === "orange") return "drought";
    return "normal";
  };

  return (
    <main className="w-screen h-screen flex overflow-hidden relative bg-[#02040a] font-sans">
      
      {/* Background Weather Particles Simulator */}
      <WeatherParticles weatherType={getWeatherParticleType()} />

      {/* Futuristic Scanline Grids overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />

      {/* Main Container */}
      <div className="flex w-full h-full relative z-20">
        
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDefenseActive={isDefenseActive}
          setIsDefenseActive={setIsDefenseActive}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />

        {/* Content Panel Area */}
        <div className="flex-grow h-full flex flex-col overflow-hidden">
          
          {/* Top Ticker Status HUD */}
          <TopBar
            selectedCityData={activeCityData}
            isDefenseActive={isDefenseActive}
            globalRiskScore={globalRiskScore}
          />

          {/* Scrolling Content Panels */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="wait">
              
              {/* DEFESA CIVIL Tactical Mode */}
              {isDefenseActive && (
                <motion.div
                  key="defesa-civil"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <DefenseCivilMode />
                </motion.div>
              )}

              {/* DASHBOARD standard layout (Map + Alerts + Graphs) */}
              {!isDefenseActive && activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                    <div className="xl:col-span-8 h-[480px]">
                      <HolographicMap
                        selectedCity={selectedCity}
                        onSelectCity={setSelectedCity}
                      />
                    </div>
                    <div className="xl:col-span-4 h-[480px]">
                      <AlertPanel
                        selectedCity={selectedCity}
                        selectedCityData={activeCityData}
                      />
                    </div>
                  </div>
                  <AnalyticsPanel selectedCityData={activeCityData} />
                </motion.div>
              )}

              {/* MAP ONLY focused viewport */}
              {!isDefenseActive && activeTab === "mapa" && (
                <motion.div
                  key="map-focused"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="w-full h-[80vh] flex flex-col justify-between"
                >
                  <HolographicMap
                    selectedCity={selectedCity}
                    onSelectCity={setSelectedCity}
                  />
                </motion.div>
              )}

              {/* ALERTS focused database list */}
              {!isDefenseActive && activeTab === "alertas" && (
                <motion.div
                  key="alerts-focused"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="w-full max-w-4xl mx-auto"
                >
                  <AlertPanel
                    selectedCity={selectedCity}
                    selectedCityData={activeCityData}
                  />
                </motion.div>
              )}

              {/* TURISMO SEGURO planner dashboard */}
              {!isDefenseActive && activeTab === "turismo" && (
                <motion.div
                  key="turismo-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-4 max-w-5xl mx-auto font-mono"
                >
                  <div className="glass-panel border-emerald-500/20 bg-emerald-950/5 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Palmtree className="w-8 h-8 text-cyber-green animate-pulse" />
                      <div>
                        <h2 className="text-sm font-black text-white tracking-widest">
                          COLEGIADO DE TURISMO INTELIGENTE DA BAHIA
                        </h2>
                        <p className="text-4xs text-slate-400">Rotas mapeadas por IA com base em risco de eventos meteorológicos</p>
                      </div>
                    </div>
                    <span className="text-3xs px-2 py-0.5 border border-emerald-500/35 text-cyber-green rounded-full font-bold">
                      COSTA RESILIENTE
                    </span>
                  </div>

                  {/* Tourism Grid Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Itacaré */}
                    {(() => {
                      const simData = getSimulatedCityData("itacare");
                      return (
                        <div className="p-4 border border-cyan-500/10 glass-panel rounded-xl flex flex-col justify-between h-56">
                          <div>
                            <div className="flex justify-between items-start border-b border-cyan-500/10 pb-2 mb-2">
                              <div>
                                <h3 className="text-xs font-bold text-white uppercase">Itacaré</h3>
                                <p className="text-4xs text-slate-500">Costa do Cacau</p>
                              </div>
                              <span className="text-4xs px-2 py-0.5 border border-emerald-500/30 text-cyber-green bg-emerald-950/20 rounded font-bold">
                                {simData.safeScore}% SAFE
                              </span>
                            </div>
                            <p className="text-3xs text-slate-300 leading-relaxed font-sans">
                              Condição climática limpa. Temperatura ideal para praias e surf. Chapada e trilhas de restinga seguras.
                            </p>
                          </div>
                          <div className="border-t border-cyan-500/5 pt-2 flex items-center justify-between text-4xs text-slate-500">
                            <span>RECOMENDAÇÃO: LIBERADO</span>
                            <span className="text-cyber-cyan font-bold">CONFIÁVEL</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Porto Seguro */}
                    {(() => {
                      const simData = getSimulatedCityData("porto_seguro");
                      return (
                        <div className="p-4 border border-cyan-500/10 glass-panel rounded-xl flex flex-col justify-between h-56">
                          <div>
                            <div className="flex justify-between items-start border-b border-cyan-500/10 pb-2 mb-2">
                              <div>
                                <h3 className="text-xs font-bold text-white uppercase">Porto Seguro</h3>
                                <p className="text-4xs text-slate-500">Costa do Descobrimento</p>
                              </div>
                              <span className="text-4xs px-2 py-0.5 border border-emerald-500/30 text-cyber-green bg-emerald-950/20 rounded font-bold">
                                {simData.safeScore}% SAFE
                              </span>
                            </div>
                            <p className="text-3xs text-slate-300 leading-relaxed font-sans">
                              Clima ideal para navegação, atividades náuticas e passeios históricos em Trancoso / Arraial d'Ajuda.
                            </p>
                          </div>
                          <div className="border-t border-cyan-500/5 pt-2 flex items-center justify-between text-4xs text-slate-500">
                            <span>RECOMENDAÇÃO: EXCELENTE</span>
                            <span className="text-cyber-cyan font-bold">100% LIBERADO</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Lençóis */}
                    {(() => {
                      const simData = getSimulatedCityData("lencois");
                      return (
                        <div className="p-4 border border-orange-500/20 glass-panel-orange rounded-xl flex flex-col justify-between h-56">
                          <div>
                            <div className="flex justify-between items-start border-b border-orange-500/20 pb-2 mb-2">
                              <div>
                                <h3 className="text-xs font-bold text-white uppercase">Lençóis</h3>
                                <p className="text-4xs text-slate-500">Chapada Diamantina</p>
                              </div>
                              <span className="text-4xs px-2 py-0.5 border border-orange-500/30 text-cyber-orange bg-orange-950/20 rounded font-bold">
                                {simData.safeScore}% SAFE
                              </span>
                            </div>
                            <p className="text-3xs text-slate-300 leading-relaxed font-sans">
                              ATENÇÃO: Devido à baixa umidade (28%) e calor crítico, trilhas de longo curso devem ser monitoradas. Evite fogo.
                            </p>
                          </div>
                          <div className="border-t border-orange-500/10 pt-2 flex items-center justify-between text-4xs text-slate-500">
                            <span>RECOMENDAÇÃO: CAUTELA</span>
                            <span className="text-cyber-orange font-bold">RESTRITO</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Ilhéus */}
                    {(() => {
                      const simData = getSimulatedCityData("ilheus");
                      return (
                        <div className="p-4 border border-red-500/20 glass-panel-red rounded-xl flex flex-col justify-between h-56">
                          <div>
                            <div className="flex justify-between items-start border-b border-red-500/20 pb-2 mb-2">
                              <div>
                                <h3 className="text-xs font-bold text-white uppercase">Ilhéus</h3>
                                <p className="text-4xs text-slate-500">Costa do Cacau</p>
                              </div>
                              <span className="text-4xs px-2 py-0.5 border border-red-500/30 text-cyber-red bg-red-950/20 rounded font-bold">
                                {simData.safeScore}% SAFE
                              </span>
                            </div>
                            <p className="text-3xs text-slate-300 leading-relaxed font-sans">
                              CRÍTICO: Risco severo de transbordamento de encostas fluviais e maré de ressaca. Interditar praias.
                            </p>
                          </div>
                          <div className="border-t border-red-500/10 pt-2 flex items-center justify-between text-4xs text-slate-500">
                            <span>RECOMENDAÇÃO: SUSPENSO</span>
                            <span className="text-cyber-red font-bold animate-pulse">PERIGO</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              )}

              {/* ANALYTICS extended charts view */}
              {!isDefenseActive && activeTab === "analytics" && (
                <motion.div
                  key="analytics-extended"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-4 max-w-5xl mx-auto"
                >
                  <AnalyticsPanel selectedCityData={activeCityData} />
                </motion.div>
              )}

              {/* SIMULATION CONFIGURATIONS */}
              {!isDefenseActive && activeTab === "config" && (
                <motion.div
                  key="config-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="max-w-xl mx-auto glass-panel p-6 rounded-2xl border border-cyan-500/15 font-mono space-y-6 relative"
                >
                  <div className="absolute inset-0 tech-dots opacity-5 pointer-events-none" />

                  <div className="flex items-center gap-2 border-b border-cyan-500/10 pb-3">
                    <Sliders className="w-5 h-5 text-cyber-cyan" />
                    <div>
                      <h2 className="text-sm font-black text-white uppercase tracking-widest">
                        CENTRAL DE SIMULAÇÃO CLIMÁTICA
                      </h2>
                      <p className="text-4xs text-slate-500">Altere variáveis e teste resiliência da rede</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Rain factor dial */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300">Fator de Precipitação Adicional:</span>
                        <span className="text-cyber-cyan font-bold font-mono">+{simRainFactor} mm</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={simRainFactor}
                        onChange={(e) => setSimRainFactor(Number(e.target.value))}
                        className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyber-cyan border border-cyan-500/10"
                      />
                      <div className="flex justify-between text-[8px] text-slate-500 mt-1">
                        <span>Padrão</span>
                        <span>Precipitação Crítica</span>
                      </div>
                    </div>

                    {/* Temp offset dial */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300">Offset Térmico Geral:</span>
                        <span className="text-cyber-cyan font-bold font-mono">
                          {simTempFactor >= 0 ? `+${simTempFactor}` : simTempFactor}°C
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        value={simTempFactor}
                        onChange={(e) => setSimTempFactor(Number(e.target.value))}
                        className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyber-cyan border border-cyan-500/10"
                      />
                      <div className="flex justify-between text-[8px] text-slate-500 mt-1">
                        <span>Resfriamento</span>
                        <span>Aquecimento Global Extremo</span>
                      </div>
                    </div>

                    {/* Wind dial */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300">Velocidade Adicional Ventos:</span>
                        <span className="text-cyber-cyan font-bold font-mono">+{simWindFactor} km/h</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={simWindFactor}
                        onChange={(e) => setSimWindFactor(Number(e.target.value))}
                        className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyber-cyan border border-cyan-500/10"
                      />
                      <div className="flex justify-between text-[8px] text-slate-500 mt-1">
                        <span>Brisa</span>
                        <span>Gale / Ventania Ciclônica</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-cyan-500/10 pt-4 flex gap-3 text-3xs">
                    <button
                      onClick={() => {
                        setSimRainFactor(0);
                        setSimTempFactor(0);
                        setSimWindFactor(0);
                        playClick();
                      }}
                      className="px-3 py-1.5 border border-slate-700 text-slate-300 rounded hover:bg-slate-900 transition-all cursor-pointer"
                    >
                      RESETAR SIMULAÇÃO
                    </button>
                    
                    <button
                      onClick={() => {
                        setSimRainFactor(80);
                        setSimTempFactor(6);
                        setSimWindFactor(35);
                        playClick();
                      }}
                      className="px-3 py-1.5 border border-red-500/30 text-cyber-red rounded bg-red-950/10 hover:bg-red-500/20 transition-all cursor-pointer"
                    >
                      FORÇAR ESTRESSE DE REDE (CRÍTICO)
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
