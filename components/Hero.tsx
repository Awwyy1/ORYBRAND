
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=1920"
          alt="Luxury silk fabric texture" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F0F0F]/50 to-[#0F0F0F]"></div>
      </div>

      <motion.div 
        style={{ y: y1, opacity }}
        className="relative z-10 text-center px-4"
      >
        <h1 className="brand-font text-7xl md:text-[12rem] font-bold text-gradient-silver tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          ORY
        </h1>
        
        <p className="brand-font text-sm md:text-xl tracking-[1em] text-sky-400 mb-12 uppercase">
          FOR THOSE WITH BALLS
        </p>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('shop')?.scrollIntoView()}
          className="glass titanium-border px-10 py-4 brand-font text-xs tracking-widest text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          Shop the Collection
        </motion.button>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-0 w-full flex flex-col items-center justify-center gap-2 pointer-events-none"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent opacity-30"></div>
        <span className="brand-font text-[10px] tracking-[0.4em] opacity-50 uppercase text-center w-full">Explore</span>
      </motion.div>
    </section>
  );
};

export default Hero;
