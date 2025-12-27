
import React, { useState, useRef } from 'react';
import { Planet } from '../types';
import { getPlanetDetails } from '../services/geminiService';
import { Rocket, Sparkles, Volume2, StopCircle, X, Move, ArrowLeft } from 'lucide-react';
import { playTextToSpeech, playSoundEffect } from '../utils/sound';

const PLANETS: Planet[] = [
  { name: 'Mercury', color: '#A5A5A5', size: 'w-16 h-16', distance: '58M km', icon: '🌑', fact: 'Smallest planet!' },
  { name: 'Venus', color: '#E3BB76', size: 'w-20 h-20', distance: '108M km', icon: '🌕', fact: 'Hottest planet!' },
  { name: 'Earth', color: '#4F86F7', size: 'w-24 h-24', distance: '150M km', icon: '🌍', fact: 'Our home!' },
  { name: 'Mars', color: '#FF6B6B', size: 'w-20 h-20', distance: '228M km', icon: '🔴', fact: 'The Red Planet' },
  { name: 'Jupiter', color: '#D4A373', size: 'w-32 h-32', distance: '778M km', icon: '🪐', fact: 'Biggest planet!' },
  { name: 'Saturn', color: '#F4E4BA', size: 'w-28 h-28', distance: '1.4B km', icon: '🪐', fact: 'Has beautiful rings!' },
  { name: 'Uranus', color: '#A7D5E8', size: 'w-24 h-24', distance: '2.9B km', icon: '⚪', fact: 'Spins on its side!' },
  { name: 'Neptune', color: '#4b70dd', size: 'w-24 h-24', distance: '4.5B km', icon: '🔵', fact: 'Very windy and cold!' },
];

const SUN_DATA: Planet = {
  name: 'The Sun',
  color: '#FDB813',
  size: 'w-48 h-48',
  distance: 'Center',
  icon: '☀️',
  fact: 'The Sun is actually a STAR!',
  description: 'The Sun is a giant ball of hot gas at the center of our solar system. It gives us light and keeps us warm!'
};

interface SpaceZoneProps {
  onBack: () => void;
}

export const SpaceZone: React.FC<SpaceZoneProps> = ({ onBack }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [aiData, setAiData] = useState<{fact: string, description: string} | null>(null);
  const [loadingFact, setLoadingFact] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Dragging state
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePlanetClick = async (planet: Planet) => {
    playSoundEffect('click');
    setSelectedPlanet(planet);
    setAiData(null);
    setLoadingFact(true);
    setModalPosition({ x: 0, y: 0 }); // Reset position
    
    // Use local description for Sun immediately to prevent "planet" AI confusion, or fetch for others
    if (planet.name === 'The Sun') {
       setAiData({ fact: planet.fact, description: planet.description || '' });
       setLoadingFact(false);
    } else {
       const data = await getPlanetDetails(planet.name);
       setAiData(data);
       setLoadingFact(false);
    }
  };

  const handleSpeak = () => {
    playSoundEffect('click');
    if (!aiData || !selectedPlanet) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    // Construct the text to speak
    const textToSpeak = `This is ${selectedPlanet.name}. ${aiData.description} Fun fact: ${aiData.fact}`;

    playTextToSpeech(
      textToSpeak,
      () => setIsSpeaking(false),
      'sincere'
    );
  };

  const handleClose = () => {
    playSoundEffect('click');
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSelectedPlanet(null);
  };

  // Pointer event handlers for dragging
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - modalPosition.x, y: e.clientY - modalPosition.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      setModalPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B0B2A] to-[#1B1B4B] rounded-3xl border-4 border-indigo-900/50 shadow-2xl">
      
      {/* Starry Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full opacity-60 animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 3 + 2 + 's'
            }}
          />
        ))}
      </div>

      <div className="absolute top-4 left-4 z-30">
        <button 
          onClick={() => { playSoundEffect('click'); onBack(); }}
          className="flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <ArrowLeft size={24} /> Back
        </button>
      </div>

      <div className="text-center mb-6 md:mb-12 z-10 pt-16 md:pt-0">
        <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3">
          <Rocket className="animate-bounce" size={48} /> Solar System
        </h2>
        <p className="text-indigo-200 font-bold text-lg md:text-xl mt-2 drop-shadow-md">Tap a planet to explore!</p>
      </div>

      {/* Orbit Visualization */}
      <div className="relative w-full h-80 md:h-96 flex items-center justify-start overflow-x-auto p-8 md:p-12 no-scrollbar z-10 mask-linear-fade">
        <div className="absolute top-1/2 left-0 min-w-[150%] h-0.5 bg-white/10 -translate-y-1/2 rounded-full"></div>
        
        {/* Sun - Now Clickable */}
        <div 
          onClick={() => handlePlanetClick(SUN_DATA)}
          className="shrink-0 flex items-center justify-center w-32 h-32 md:w-48 md:h-48 bg-yellow-400 rounded-full shadow-[0_0_80px_rgba(255,200,0,0.6)] animate-[pulse_4s_infinite] mx-8 md:mr-16 z-10 border-4 md:border-8 border-orange-300 relative group cursor-pointer transition-transform hover:scale-105"
        >
          <span className="text-6xl md:text-8xl select-none">☀️</span>
          <span className="absolute -bottom-10 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm whitespace-nowrap">The Sun</span>
        </div>

        {PLANETS.map((planet, idx) => (
          <button
            key={planet.name}
            onClick={() => handlePlanetClick(planet)}
            className={`
              shrink-0 relative rounded-full shadow-2xl transition-all duration-500 hover:scale-125 hover:-translate-y-4 z-20 mx-4 md:mx-8
              flex items-center justify-center border-2 md:border-4 border-white/20 backdrop-blur-sm group
              ${selectedPlanet?.name === planet.name ? 'ring-4 md:ring-8 ring-white scale-110 shadow-[0_0_50px_rgba(255,255,255,0.5)]' : ''}
              ${planet.size}
            `}
            style={{ backgroundColor: planet.color }}
          >
            <span className="text-3xl md:text-5xl drop-shadow-md animate-float select-none" style={{ animationDelay: `${idx * 0.5}s` }}>{planet.icon}</span>
            <div className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 font-bold text-white text-sm md:text-lg bg-black/40 px-3 py-1 rounded-full backdrop-blur-md whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
              {planet.name}
            </div>
          </button>
        ))}
        
        {/* Padding for scroll */}
        <div className="w-12 shrink-0"></div>
      </div>

      {selectedPlanet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in" onClick={handleClose}>
          <div 
            className="bg-gradient-to-br from-indigo-900 via-[#2E2E5E] to-indigo-900 p-1 rounded-[2.5rem] shadow-2xl max-w-lg w-full cursor-move touch-none"
            onClick={e => e.stopPropagation()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{ 
              transform: `translate(${modalPosition.x}px, ${modalPosition.y}px)`,
              touchAction: 'none'
            }}
          >
            <div className="bg-black/40 backdrop-blur-xl rounded-[2.3rem] p-6 border border-white/10 relative overflow-hidden flex flex-col max-h-[85vh] w-full">
              
              {/* Drag Handle Indicator */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full shrink-0"></div>
              
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                 <div className="text-white/30 p-2" title="Drag to move"><Move size={18} /></div>
                 <button 
                    onClick={handleClose}
                    onPointerDown={(e) => e.stopPropagation()} 
                    className="text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
              </div>

              <div className="flex flex-col items-center mb-4 shrink-0 pt-4">
                 <div className="text-7xl md:text-8xl animate-[bounce_4s_infinite] drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-2 md:mb-4 select-none">
                    {selectedPlanet.icon}
                 </div>
                 <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 select-none">
                    {selectedPlanet.name}
                 </h3>
                 <span className="text-kid-secondary font-bold tracking-widest text-xs md:text-sm uppercase mt-1 md:mt-2 border border-kid-secondary/50 px-3 py-1 rounded-full select-none">
                    {selectedPlanet.distance} away
                 </span>
              </div>

              <div className="flex justify-center mb-4 shrink-0">
                <button 
                    onClick={handleSpeak}
                    onPointerDown={(e) => e.stopPropagation()}
                    disabled={loadingFact}
                    className="flex items-center gap-2 bg-kid-accent text-kid-dark px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg font-black text-base"
                  >
                    {isSpeaking ? <StopCircle size={20} /> : <Volume2 size={20} />}
                    {isSpeaking ? 'Stop' : 'Read to Me'}
                </button>
              </div>
              
              <div 
                className="space-y-3 overflow-y-auto pr-2 flex-1 min-h-0 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                onPointerDown={(e) => e.stopPropagation()} 
                style={{ touchAction: 'pan-y' }} 
              >
                {loadingFact ? (
                  <div className="space-y-4 animate-pulse px-2">
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-5/6"></div>
                    <div className="h-20 bg-white/5 rounded-xl w-full mt-4"></div>
                  </div>
                ) : (
                   <div className="space-y-3 pb-2">
                     <div className="bg-white/10 p-5 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-base md:text-lg font-medium text-white leading-relaxed">
                          {aiData?.description}
                        </p>
                     </div>
                     
                     <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-2xl border border-yellow-400/30 flex gap-4 items-start">
                       <div className="bg-yellow-400 text-yellow-900 p-2 rounded-xl shrink-0 shadow-lg">
                          <Sparkles size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-yellow-400 uppercase mb-1 tracking-wider">
                              Fun Fact
                          </p>
                          <p className="font-bold text-white text-base md:text-lg leading-snug">
                              {aiData?.fact}
                          </p>
                       </div>
                     </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
