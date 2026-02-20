
import React, { useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string | null) => void;
}

const SWIPE_CLOSE_THRESHOLD = 80;
const SWIPE_VELOCITY_THRESHOLD = 300;

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const links = [
    { label: 'Collection', id: null, scroll: 'shop' },
    { label: 'Philosophy', id: 'philosophy' },
    { label: 'Technology', id: 'technology' },
    { label: 'Shipping', id: 'shipping' },
    { label: 'Support', id: 'returns' },
  ];

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipedLeft = info.offset.x < -SWIPE_CLOSE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD;
    if (swipedLeft) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60]"
          />
          <motion.div
            ref={menuRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.4, right: 0 }}
            dragDirectionLock
            onDragEnd={handleDragEnd}
            style={{ touchAction: 'pan-y' }}
            className="fixed top-0 left-0 h-full w-full max-w-sm bg-zinc-950 titanium-border border-r z-[70] p-12 flex flex-col"
          >
            <div className="flex justify-between items-center mb-24">
              <span className="brand-font text-lg text-sky-400">Navigation</span>
              <button onClick={onClose}>
                <X className="w-8 h-8 text-white hover:text-sky-400 transition-colors" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col gap-12">
              {links.map((link, idx) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    if (link.scroll) {
                      onNavigate(null);
                      setTimeout(() => document.getElementById(link.scroll!)?.scrollIntoView(), 100);
                      onClose();
                    } else {
                      onNavigate(link.id);
                    }
                  }}
                  className="flex items-center justify-between group"
                >
                  <span className="brand-font text-3xl text-white group-hover:text-sky-400 transition-colors uppercase">
                    {link.label}
                  </span>
                  <ArrowRight className="w-6 h-6 text-sky-400 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </motion.button>
              ))}
            </nav>

            {/* Swipe hint for mobile */}
            <div className="md:hidden text-center mb-6">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">Swipe left to close</span>
            </div>

            <div className="mt-auto">
              <p className="brand-font text-[10px] text-slate-400 uppercase tracking-widest leading-loose">
                ORY<br/>
                PREMIUM SILK<br/>
                EST. 2024
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;
