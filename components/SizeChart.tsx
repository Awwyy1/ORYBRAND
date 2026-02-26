import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, X } from 'lucide-react';

const sizeData = [
  { size: 'S',  waist: '28–30"', hip: '34–36"', thigh: '20–22"', rise: '9.5"',  weight: '130–155 lbs' },
  { size: 'M',  waist: '31–33"', hip: '37–39"', thigh: '22–24"', rise: '10"',   weight: '155–175 lbs' },
  { size: 'L',  waist: '34–36"', hip: '40–42"', thigh: '24–26"', rise: '10.5"', weight: '175–200 lbs' },
  { size: 'XL', waist: '37–40"', hip: '43–46"', thigh: '26–28"', rise: '11"',   weight: '200–230 lbs' },
];

const columns = ['Size', 'Waist', 'Hip', 'Thigh', 'Rise', 'Weight'];

interface SizeChartProps {
  selectedSize?: string;
  onSizeSelect?: (size: string) => void;
}

const SizeChart: React.FC<SizeChartProps> = ({ selectedSize, onSizeSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors"
      >
        <Ruler className="w-3 h-3" />
        <span className="text-[10px] uppercase tracking-widest underline underline-offset-4">Size Guide</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-zinc-950 border border-white/10 z-50 p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-sky-400" />
                  <h3 className="brand-font text-lg text-white tracking-widest">Size Guide</h3>
                </div>
                <button onClick={() => setIsOpen(false)} aria-label="Close size guide">
                  <X className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="brand-font text-[9px] text-sky-400 tracking-widest pb-4 pr-4 whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row) => {
                      const isSelected = selectedSize === row.size;
                      return (
                        <tr
                          key={row.size}
                          onClick={() => {
                            onSizeSelect?.(row.size);
                            setIsOpen(false);
                          }}
                          className={`border-t border-white/5 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-sky-500/10'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <td className={`py-4 pr-4 brand-font text-xs tracking-widest ${isSelected ? 'text-sky-400' : 'text-white'}`}>
                            {row.size}
                          </td>
                          <td className="py-4 pr-4 text-sm text-slate-300 font-mono">{row.waist}</td>
                          <td className="py-4 pr-4 text-sm text-slate-300 font-mono">{row.hip}</td>
                          <td className="py-4 pr-4 text-sm text-slate-300 font-mono">{row.thigh}</td>
                          <td className="py-4 pr-4 text-sm text-slate-300 font-mono">{row.rise}</td>
                          <td className="py-4 pr-4 text-sm text-slate-400">{row.weight}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Measurements in inches. If between sizes, we recommend sizing up for a relaxed fit
                  or sizing down for a compression fit. All ORY products feature 4-way stretch silk
                  that adapts to your body.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SizeChart;
