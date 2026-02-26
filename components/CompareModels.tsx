import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../data/products';
import { Check, Minus } from 'lucide-react';

interface Spec {
  label: string;
  values: Record<string, string | boolean>;
}

const SPECS: Spec[] = [
  { label: 'Price', values: { stealth: '$85', carbon: '$95', ice: '$85', midnight: '$110' } },
  { label: 'Silk Grade', values: { stealth: '6A Mulberry', carbon: '6A Mulberry', ice: '6A Mulberry', midnight: '6A+ Ultra-dense' } },
  { label: 'Weight', values: { stealth: 'Lightweight', carbon: 'Medium', ice: 'Lightweight', midnight: 'Heavy' } },
  { label: 'Finish', values: { stealth: 'Obsidian Matte', carbon: 'Matte Fusion', ice: 'Cool Sheen', midnight: 'Deep Lustre' } },
  { label: 'Moisture-wicking', values: { stealth: true, carbon: true, ice: true, midnight: true } },
  { label: 'Cool-touch Technology', values: { stealth: false, carbon: false, ice: true, midnight: false } },
  { label: 'Color-lock Treatment', values: { stealth: true, carbon: false, ice: false, midnight: true } },
  { label: 'Anti-friction Weave', values: { stealth: true, carbon: true, ice: true, midnight: true } },
  { label: 'Thermal Regulation', values: { stealth: 'Standard', carbon: 'Enhanced', ice: 'Cooling (-1.5°)', midnight: 'Premium' } },
  { label: 'Best For', values: { stealth: 'Everyday stealth', carbon: 'Active lifestyle', ice: 'Hot climates', midnight: 'Special occasions' } },
];

const CompareModels: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 md:px-12 bg-[#F8F9FA]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-12">
          <h2 className="brand-font text-3xl text-zinc-900 mb-4">Compare Models</h2>
          <div className="w-20 h-1 bg-sky-600 mb-4"></div>
          <p className="text-slate-600 text-sm max-w-lg">Find the perfect ORY for your lifestyle. Every model uses Grade 6A Mulberry silk — the difference is in the engineering.</p>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="text-left py-4 pr-4 w-48"></th>
                {PRODUCTS.map((p) => (
                  <th key={p.id} className="py-4 px-3 text-center">
                    <div
                      className="cursor-pointer group"
                      onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
                    >
                      <div className="w-16 h-16 mx-auto mb-3 rounded-sm overflow-hidden titanium-border">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="brand-font text-xs text-zinc-900 group-hover:text-sky-600 transition-colors">{p.name}</p>
                      <p className="text-[9px] text-slate-500 mt-1">{p.description}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPECS.map((spec, i) => (
                <tr key={spec.label} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                  <td className="py-4 pr-4 brand-font text-[10px] tracking-widest text-slate-600 whitespace-nowrap">
                    {spec.label}
                  </td>
                  {PRODUCTS.map((p) => {
                    const val = spec.values[p.id];
                    return (
                      <td key={p.id} className="py-4 px-3 text-center">
                        {typeof val === 'boolean' ? (
                          val ? (
                            <Check className="w-4 h-4 text-sky-600 mx-auto" />
                          ) : (
                            <Minus className="w-4 h-4 text-slate-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-xs text-slate-600">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
};

export default CompareModels;
