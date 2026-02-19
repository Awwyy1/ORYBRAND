import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Plus, Minus, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import OptimizedImage from './OptimizedImage';

const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 280], [1, 0]);
  const bgColor = useTransform(x, [0, 280], ["#0ea5e9", "#22c55e"]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  const handleDragEnd = () => {
    if (x.get() > 250) {
      setIsCartOpen(false);
      navigate('/checkout');
      x.set(0);
    } else {
      x.set(0);
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 titanium-border border-l z-50 p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="brand-font text-xl text-white tracking-widest">Your Bag</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
              >
                <X className="w-6 h-6 text-slate-400 hover:text-white transition-colors" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <p className="text-slate-500 brand-font text-xs uppercase tracking-widest">Nothing here yet</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-sky-400 brand-font text-[10px] underline underline-offset-4 uppercase"
                  >
                    Go find your fit
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    layout
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-24 bg-zinc-900 overflow-hidden flex-shrink-0 border border-white/5">
                      <OptimizedImage src={item.image} className="w-full h-full object-cover" alt={`${item.name}, size ${item.selectedSize} — in your bag`} widths={[100, 200]} sizes="80px" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="brand-font text-[10px] text-white tracking-widest">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            aria-label={`Remove ${item.name} size ${item.selectedSize}`}
                          >
                            <X className="w-3 h-3 text-slate-600 hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase mt-1">Size: {item.selectedSize}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 bg-zinc-900/50 p-1 px-3 border border-white/5">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 text-slate-400 hover:text-white" />
                          </button>
                          <span className="text-xs font-mono text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 text-slate-400 hover:text-white" />
                          </button>
                        </div>
                        <p className="brand-font text-sky-400 text-xs">${item.price * item.quantity}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="brand-font text-xs text-slate-400 tracking-widest">Total</span>
                  <span className="brand-font text-xl text-white tracking-tighter">${totalPrice}</span>
                </div>

                {/* Drag to checkout slider */}
                <div className="relative">
                  <div
                    className="relative h-16 bg-zinc-900/50 rounded-full flex items-center p-1 border border-white/5 overflow-hidden"
                  >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <motion.span
                        style={{ opacity }}
                        className="brand-font text-[10px] tracking-[0.3em] text-slate-500 uppercase"
                      >
                        Slide to Checkout
                      </motion.span>
                    </div>

                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 300 }}
                      dragElastic={0.1}
                      style={{ x, backgroundColor: bgColor }}
                      onDragEnd={handleDragEnd}
                      className="h-14 w-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-grab active:cursor-grabbing z-20"
                      tabIndex={0}
                      role="slider"
                      aria-label="Slide to proceed to checkout"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCheckoutClick();
                        }
                      }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.div>

                    <motion.div
                      className="absolute left-1 top-1 bottom-1 bg-sky-500/20 rounded-full"
                      style={{ width: x }}
                    />
                  </div>
                </div>

                {/* Keyboard-accessible checkout button (C10) */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white brand-font text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  PROCEED TO CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
