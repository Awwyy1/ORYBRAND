
import React from 'react';
import { motion } from 'framer-motion';

const Philosophy: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <section className="py-32 px-6 md:px-24 bg-[#0F0F0F]">
      <div className="max-w-4xl mx-auto space-y-24">
        <motion.div {...fadeInUp}>
          <h2 className="brand-font text-2xl md:text-4xl leading-tight mb-8">
            Ordinary cotton is for ordinary days. <br/>
            <span className="text-sky-400">Silk is for the moments that matter.</span>
          </h2>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <p className="text-lg md:text-2xl font-light text-slate-400 leading-relaxed border-l-2 border-sky-400 pl-8">
            Friction-free engineering for your most valuable assets. 
            Designed in the shadows, built for the spotlight. 
            The feeling of liquid titanium against your skin.
          </p>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="flex justify-end">
          <div className="text-right">
            <h3 className="brand-font text-sky-400 mb-2">Technical Specification</h3>
            <p className="text-slate-500 uppercase text-xs tracking-widest leading-loose">
              100% Grade 6A Mulberry Silk<br/>
              Reinforced Stealth Stitching<br/>
              Zero-Pressure Waistband
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Philosophy;
