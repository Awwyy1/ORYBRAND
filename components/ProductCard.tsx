import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingCart } from 'lucide-react';
import { Product, ProductSize } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[1]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isAnimating) return;

    setIsAnimating(true);
    addToCart(product, selectedSize);

    setTimeout(() => {
      setIsAnimating(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }, 1200);
  };

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden aspect-[3/4] titanium-border rounded-sm bg-zinc-100">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          src={product.image}
          alt={`${product.name} — ${product.description}, premium silk underwear by ORY`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 brightness-75 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSize(size);
              }}
              className={`w-7 h-7 text-[9px] brand-font flex items-center justify-center border transition-all ${
                selectedSize === size
                  ? 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-white/60 border-black/10 text-zinc-900/60 hover:border-black/20 hover:text-zinc-900'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            disabled={isAnimating}
            className={`relative w-full py-4 brand-font text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 overflow-hidden transition-all duration-500 ${
              showSuccess
                ? 'bg-sky-600/10 border-sky-600 text-sky-600'
                : 'bg-white text-black hover:bg-sky-500 titanium-border'
            }`}
          >
            <AnimatePresence mode="wait">
              {isAnimating ? (
                <motion.div
                  key="animating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="relative z-10">ADDING...</span>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    <motion.path
                      d="M -20 20 Q 50 -10 120 20 T 260 20"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-sky-600/40"
                      initial={{ pathLength: 0, x: -100 }}
                      animate={{
                        pathLength: [0, 1, 0],
                        x: [0, 200],
                        transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                      }}
                    />
                  </svg>
                  <motion.div
                    className="absolute inset-0 bg-sky-600/20"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
                  />
                </motion.div>
              ) : showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>ADDED</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  className="flex items-center gap-2 z-10"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-start">
        <div>
          <h3 className="brand-font text-sm text-zinc-900 mb-1 group-hover:text-sky-600 transition-colors">{product.name}</h3>
          <p className="text-[10px] uppercase text-slate-600 tracking-widest">{product.description}</p>
        </div>
        <p className="brand-font text-sky-600 text-sm">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
