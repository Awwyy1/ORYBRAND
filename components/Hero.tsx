
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <picture>
          <source
            srcSet="/images/hero.png 1920w"
            sizes="100vw"
            type="image/png"
          />
          <img
            src="/images/hero.png"
            alt="Luxury silk fabric texture"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-110"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F0F0F]/50 to-[#0F0F0F]"></div>
      </div>

      <motion.div
        style={{ y: y1, opacity }}
        className="relative z-10 text-center px-4 mt-32 md:mt-44"

      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xs md:text-sm text-slate-400 tracking-[0.4em] uppercase mb-6"
        >
          Premium Silk Underwear for Men
        </motion.p>

        <h1 className="brand-font text-xl md:text-4xl tracking-[0.35em] text-sky-400 mb-8 uppercase">
          FOR THOSE WITH BALLS
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
