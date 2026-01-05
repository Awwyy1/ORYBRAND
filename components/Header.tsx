
import React, { useEffect } from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onMenuOpen: () => void;
  onHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuOpen, onHome }) => {
  const { cartCount, setIsCartOpen, cartBump } = useCart();
  const controls = useAnimation();

  useEffect(() => {
    if (cartBump > 0) {
      controls.start({
        scale: [1, 1.4, 1],
        rotate: [0, -10, 10, -10, 0],
        transition: { duration: 0.5, ease: "easeOut" }
      });
    }
  }, [cartBump, controls]);

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 py-4 md:px-12 md:py-8 flex justify-between items-center mix-blend-difference">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center"
      >
        <button 
          onClick={onMenuOpen}
          className="group flex items-center gap-3 focus:outline-none"
        >
          <Menu className="w-6 h-6 text-white group-hover:text-sky-400 transition-colors" />
          <span className="brand-font text-[10px] tracking-widest hidden md:block text-white group-hover:text-sky-400">Index</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onHome}
        className="brand-font text-2xl md:text-3xl font-bold text-white tracking-[0.3em] cursor-pointer"
      >
        ORY
      </motion.div>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setIsCartOpen(true)}
        className="relative group focus:outline-none"
      >
        <motion.div animate={controls}>
          <ShoppingBag className="w-6 h-6 text-white group-hover:text-sky-400 transition-colors" />
        </motion.div>
        {cartCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={cartCount}
            className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-[0_0_10px_rgba(56,189,248,0.8)]"
          >
            {cartCount}
          </motion.span>
        )}
      </motion.button>
    </header>
  );
};

export default Header;
