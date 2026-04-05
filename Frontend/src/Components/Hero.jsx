import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import images
import top_bun from '../assets/top_bun.png';
import pata from '../assets/pata.png';
import tomato from '../assets/tomato.png';
import meat from '../assets/meat.png';
import onion from '../assets/onion.png';
import bottom_bun from '../assets/bottom_bun.png';

const BurgerPart = ({ src, label, y, opacity, zIndex, scale = 1 }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex }}>
    <motion.div
      style={{ y, scale }}
      className="relative w-full max-w-[220px] md:max-w-[320px] h-auto flex items-center justify-center"
    >
      <img src={src} alt={label} className="w-full h-auto object-contain drop-shadow-2xl" />

      {/* Label */}
      <motion.div
        style={{ opacity }}
        className="absolute left-[65%] md:left-[75%] ml-4 md:ml-12 whitespace-nowrap"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-6 md:w-16 h-[2px] bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
          <span className="text-[12px] md:text-2xl font-black tracking-[0.2em] uppercase italic text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
            {label}
          </span>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

const Hero = ({ onExploreMenu, onOrderNow, siteSettings }) => {
  const containerRef = useRef(null);
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  }));
  const isDesktop = viewport.width > 768;

  useEffect(() => {
    const syncViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const baseSpread = isDesktop ? 100 : 80;
  // Cap the exploded distance so the buns stay inside the sticky viewport.
  const explodedSpread = Math.min(
    Math.max(viewport.height * (isDesktop ? 0.25 : 0.15), isDesktop ? 200 : 180),
    isDesktop ? 300 : 220
  );

  const initialGap = isDesktop ? 85 : 75;

  const topBunY = useTransform(scrollYProgress, [0, 1], [-initialGap, -explodedSpread]);
  const pataY = useTransform(scrollYProgress, [0, 1], [-initialGap * 0.60, -explodedSpread * 0.65]);
  const tomatoY = useTransform(scrollYProgress, [0, 1], [-initialGap * 0.3, -explodedSpread * 0.3]);
  const meatY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const onionY = useTransform(scrollYProgress, [0, 1], [initialGap * 0.35, explodedSpread * 0.35]);
  const bottomBunY = useTransform(scrollYProgress, [0, 1], [initialGap * 0.65, explodedSpread * 0.65]);

  // Horizontal movement: Start shifted left, move to a slightly offset center to allow labels
  const burgerX = useTransform(scrollYProgress, [0, 0.6], [isDesktop ? "-25%" : "-10%", "-5%"]);

  // Vertical container movement: move towards bottom as it expands, with margin
  const burgerContainerY = useTransform(scrollYProgress, [0, 1], [isDesktop ? 0 : -40, isDesktop ? 60 : 40]);

  // Label opacity (fades in as burger explodes)
  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.4], [0, 1]);

  // Text disappearance logic
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textX = useTransform(scrollYProgress, [0, 0.3], [0, isDesktop ? 50 : 20]);
  const textDisplay = useTransform(scrollYProgress, (v) => v > 0.4 ? 'none' : 'flex');

  const burgerParts = [
    { src: top_bun, label: 'Glazed Brioche', y: topBunY, zIndex: 60, scale: 1.0 },
    { src: pata, label: 'Crispy Lettuce', y: pataY, zIndex: 50, scale: 0.95 },
    { src: tomato, label: 'Fresh Tomato', y: tomatoY, zIndex: 40, scale: 0.95 },
    { src: meat, label: 'Premium Beef', y: meatY, zIndex: 30, scale: 0.95 },
    { src: onion, label: 'Red Onion', y: onionY, zIndex: 20, scale: 0.95 },
    { src: bottom_bun, label: 'Toasted Base', y: bottomBunY, zIndex: 10, scale: 1.2 },
  ];

  return (
    <div ref={containerRef} className="h-[150vh] relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black md:pt-0 pb-12 md:pb-24">
        {/* Burger Container - Dynamic X/Y movement */}
        <motion.div
          style={{ x: burgerX, y: burgerContainerY }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <div className="relative w-full h-full flex items-center justify-center px-4 md:px-0 pr-20 md:pr-40">
            {burgerParts.map((part, index) => (
              <BurgerPart
                key={index}
                src={part.src}
                label={part.label}
                y={part.y}
                opacity={labelOpacity}
                zIndex={part.zIndex}
                scale={part.scale}
              />
            ))}
          </div>
        </motion.div>

        {/* Right Side: Hero Text */}
        <motion.div
          style={{
            opacity: textOpacity,
            x: textX,
            display: textDisplay
          }}
          className="absolute right-4 md:right-32 text-right pointer-events-none flex flex-col items-end max-w-[90vw]"
        >
          <h2 className="text-3xl sm:text-6xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] italic mb-4 break-words">
            Tasty<br />Town
          </h2>
          <div className="flex flex-col items-end gap-1 md:gap-2 mb-4 md:mb-8">
            <p className="text-sm md:text-3xl font-light tracking-[0.2em] uppercase text-white/80">
              {siteSettings?.heroBadge || 'The Ultimate'}
            </p>
            <p className="text-xs sm:text-xl md:text-4xl font-bold tracking-[0.3em] uppercase bg-white text-black px-2 md:px-4 py-0.5 md:py-1 italic">
              Food Experience
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 md:gap-4 pointer-events-auto">
            <button
              type="button"
              onClick={onOrderNow}
              className="rounded-full bg-orange-500 px-4 md:px-8 py-2 md:py-4 text-xs md:text-base font-bold text-white transition-transform duration-200 hover:scale-105 hover:bg-orange-400 shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
            >
              Order Now
            </button>
            <button
              type="button"
              onClick={onExploreMenu}
              className="rounded-full border border-white/40 bg-white/5 backdrop-blur-sm px-4 md:px-8 py-2 md:py-4 text-xs md:text-base font-bold text-white transition-all duration-200 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5"
            >
              Explore Menu
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
