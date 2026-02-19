
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const usps = [
    { label: '100% Grade 6A Silk', detail: 'Mulberry' },
    { label: 'Free Shipping', detail: 'Worldwide' },
    { label: '30-Day Returns', detail: 'No Questions' },
  ];

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=1920"
          alt="Luxury silk fabric texture"
          loading="eager"
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F0F0F]/50 to-[#0F0F0F]"></div>
      </div>

      <motion.div
        style={{ y: y1, opacity }}
        className="relative z-10 text-center px-4"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xs md:text-sm text-slate-400 tracking-[0.4em] uppercase mb-6"
        >
          Premium Silk Underwear for Men
        </motion.p>

        <h1 className="brand-font text-7xl md:text-[12rem] font-bold text-gradient-silver tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          ORY
        </h1>

        <p className="brand-font text-sm md:text-xl tracking-[1em] text-sky-400 mb-6 uppercase">
          FOR THOSE WITH BALLS
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-slate-400 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed font-light"
        >
          Engineered from the finest Mulberry silk. Zero friction, absolute comfort, unmatched confidence. Starting at $85.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-sky-500 hover:bg-sky-400 px-10 py-4 brand-font text-xs tracking-widest text-white transition-all duration-300"
          >
            Shop the Collection
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/technology')}
            className="glass titanium-border px-10 py-4 brand-font text-xs tracking-widest text-white hover:bg-white/5 transition-all duration-300"
          >
            Our Technology
          </motion.button>
        </div>

        {/* USP Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {usps.map((usp) => (
            <div key={usp.label} className="text-center">
              <p className="brand-font text-[10px] md:text-xs text-white tracking-widest">{usp.label}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">{usp.detail}</p>
            </div>
          ))}
        </motion.div>
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
