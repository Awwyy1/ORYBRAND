
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronDown, ShoppingBag, Truck, CreditCard, Box } from 'lucide-react';
import { Product, ProductSize } from '../types';
import { useCart } from '../context/CartContext';
import OptimizedImage from './OptimizedImage';
import SizeChart from './SizeChart';
import Breadcrumbs from './Breadcrumbs';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const FAQAccordion: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <span className="brand-font text-[10px] tracking-widest text-slate-300 group-hover:text-sky-400 transition-colors">
          {question}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-sm text-slate-400 leading-relaxed font-light">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[1]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addToCart(product, selectedSize);
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0F0F0F] pt-24 pb-32 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={[
          { label: 'Collection', href: '/' },
          { label: product.name },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Gallery Section */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/5] titanium-border overflow-hidden bg-zinc-900 rounded-sm">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                src={activeImage}
                className="w-full h-full object-cover"
                alt={`${product.name} — ${product.description}, full product view`}
                loading="lazy"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.gallery.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square overflow-hidden border transition-all ${
                    activeImage === img ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-white/5 opacity-50 hover:opacity-100'
                  }`}
                >
                  <OptimizedImage src={img} className="w-full h-full object-cover" alt={`${product.name} — detail view ${i + 1} of ${product.gallery.length}`} widths={[200, 400]} sizes="25vw" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8">
              <span className="brand-font text-[10px] text-sky-400 tracking-[0.3em] mb-2 block">ORY Collection</span>
              <h1 className="brand-font text-4xl md:text-5xl text-white mb-4">{product.name}</h1>
              <p className="brand-font text-2xl text-sky-400 tracking-tighter">${product.price}</p>
            </div>

            <div className="mb-12">
              <p className="text-slate-300 leading-relaxed text-lg font-light">
                {product.longDescription}
              </p>
            </div>

            <div className="space-y-8 mb-12">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="brand-font text-[10px] text-slate-400 tracking-widest">Select Your Size</span>
                  <SizeChart
                    selectedSize={selectedSize}
                    onSizeSelect={(s) => setSelectedSize(s as any)}
                  />
                </div>
                <div className="flex gap-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 brand-font text-xs flex items-center justify-center border transition-all ${
                        selectedSize === size
                          ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                          : 'bg-transparent border-white/10 text-slate-400 hover:border-white/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAdd}
                disabled={isAdding}
                className="w-full py-6 bg-sky-500 hover:bg-sky-400 text-white brand-font text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] relative overflow-hidden"
              >
                {isAdding ? (
                  <>
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO BAG</span>
                  </>
                )}
              </button>
            </div>

            {/* Smart FAQ & Logistics */}
            <div className="space-y-4 pt-12 border-t border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <Box className="w-5 h-5 text-sky-400" />
                <span className="brand-font text-[10px] tracking-widest text-white">The Details</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-sm">
                  <Truck className="w-4 h-4 text-sky-400 mb-2" />
                  <p className="brand-font text-[8px] text-slate-400 mb-1">Shipping</p>
                  <p className="text-[10px] text-white">Free Delivery in 3-5 Days</p>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-sm">
                  <CreditCard className="w-4 h-4 text-sky-400 mb-2" />
                  <p className="brand-font text-[8px] text-slate-400 mb-1">Payment</p>
                  <p className="text-[10px] text-white">Secure Payment</p>
                </div>
              </div>

              <div className="space-y-2">
                {product.faq.map((item, i) => (
                  <FAQAccordion key={i} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;