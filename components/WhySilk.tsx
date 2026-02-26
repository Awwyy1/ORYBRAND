import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Shield, Feather, Sparkles, Heart } from 'lucide-react';

const benefits = [
  {
    icon: Thermometer,
    title: 'Thermoregulation',
    stat: '-1.5°C',
    desc: 'Natural temperature regulation keeps you cool in summer and warm in winter. Silk adapts to your body.',
  },
  {
    icon: Droplets,
    title: 'Moisture Wicking',
    stat: '30%',
    desc: 'Absorbs up to 30% of its weight in moisture without feeling damp. Keeps you dry all day.',
  },
  {
    icon: Shield,
    title: 'Hypoallergenic',
    stat: '0%',
    desc: 'Zero synthetic irritants. Natural sericin protein resists dust mites, mold, and bacteria.',
  },
  {
    icon: Feather,
    title: 'Featherlight',
    stat: '42g',
    desc: 'Each pair weighs just 42 grams. You\'ll forget you\'re wearing them — that\'s the point.',
  },
  {
    icon: Sparkles,
    title: 'Ultra Durable',
    stat: '500+',
    desc: 'Grade 6A silk withstands 500+ washes without losing softness or structural integrity.',
  },
  {
    icon: Heart,
    title: 'Skin-Kind',
    stat: 'pH 5.5',
    desc: 'Matches your skin\'s natural pH. 18 amino acids nourish skin on contact. Dermatologist approved.',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const WhySilk: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-white border-t border-black/5">
      <motion.div {...fadeInUp} className="mb-16 text-center">
        <h2 className="brand-font text-3xl md:text-4xl text-zinc-900 mb-4">Why Silk?</h2>
        <p className="text-slate-600 text-sm font-light max-w-xl mx-auto leading-relaxed">
          Cotton is a compromise. Synthetics are a lie. Silk is the only material engineered by nature to protect what matters most.
        </p>
        <div className="w-20 h-1 bg-sky-600 mx-auto mt-6"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group p-6 bg-zinc-100/30 border border-black/5 hover:border-sky-600/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-6 h-6 text-sky-600" />
                <span className="brand-font text-2xl text-zinc-900/10 group-hover:text-sky-600/30 transition-colors">
                  {b.stat}
                </span>
              </div>
              <h3 className="brand-font text-xs text-zinc-900 tracking-widest mb-3">{b.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-light">{b.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default WhySilk;
