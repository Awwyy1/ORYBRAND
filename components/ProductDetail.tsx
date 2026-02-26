
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronDown, ShoppingBag, Truck, CreditCard, Box, ZoomIn } from 'lucide-react';
import { Product, ProductSize } from '../types';
import { useCart } from '../context/CartContext';
import OptimizedImage from './OptimizedImage';
import SizeChart from './SizeChart';
import Breadcrumbs from './Breadcrumbs';
import ImageZoom from './ImageZoom';
import RecentlyViewed from './RecentlyViewed';
import { useRecentlyViewed } from '../lib/useRecentlyViewed';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const FAQAccordion: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-black/5 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <span className="brand-font text-[10px] tracking-widest text-slate-600 group-hover:text-sky-600 transition-colors">
          {question}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-slate-600" />
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
            <p className="mt-4 text-sm text-slate-600 leading-relaxed font-light">
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
  const { addViewed } = useRecentlyViewed();
  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[1]);
  const [isAdding, setIsAdding] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const activeGalleryIndex = product.gallery.indexOf(activeImage);
  const zoomIndex = activeGalleryIndex >= 0 ? activeGalleryIndex : 0;

  useEffect(() => {
    addViewed(product.id);
  }, [product.id, addViewed]);

  const handleAdd = () => {
    setIsAdding(true);
    addToCart(product, selectedSize);
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8F9FA] pt-24 pb-32 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs items={[
          { label: 'Collection', href: '/' },
          { label: product.name },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Gallery Section */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="aspect-[4/5] titanium-border overflow-hidden bg-zinc-100 rounded-sm relative group cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)}
            >
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                src={activeImage}
                className="w-full h-full object-cover"
                alt={`${product.name} — ${product.description}, full product view`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-zinc-900 opacity-0 group-hover:opacity-80 transition-opacity" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.gallery.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square overflow-hidden border transition-all ${
                    activeImage === img ? 'border-sky-600 ring-2 ring-sky-500/20' : 'border-black/5 opacity-50 hover:opacity-100'
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
              <span className="brand-font text-[10px] text-sky-600 tracking-[0.3em] mb-2 block">ORY Collection</span>
              <h1 className="brand-font text-4xl md:text-5xl text-zinc-900 mb-4">{product.name}</h1>
              <p className="brand-font text-2xl text-sky-600 tracking-tighter">${product.price}</p>
            </div>

            <div className="mb-12">
              <p className="text-slate-600 leading-relaxed text-lg font-light">
                {product.longDescription}
              </p>
            </div>

            <div className="space-y-8 mb-12">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="brand-font text-[10px] text-slate-600 tracking-widest">Select Your Size</span>
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
                          : 'bg-transparent border-black/10 text-slate-600 hover:border-black/20'
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
                className="w-full py-6 bg-sky-600 hover:bg-sky-500 text-white brand-font text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] relative overflow-hidden"
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
            <div className="space-y-4 pt-12 border-t border-black/5">
              <div className="flex items-center gap-4 mb-8">
                <Box className="w-5 h-5 text-sky-600" />
                <span className="brand-font text-[10px] tracking-widest text-zinc-900">The Details</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-zinc-100/50 border border-black/5 rounded-sm">
                  <Truck className="w-4 h-4 text-sky-600 mb-2" />
                  <p className="brand-font text-[8px] text-slate-600 mb-1">Shipping</p>
                  <p className="text-[10px] text-zinc-900">Free Delivery in 3-5 Days</p>
                </div>
                <div className="p-4 bg-zinc-100/50 border border-black/5 rounded-sm">
                  <CreditCard className="w-4 h-4 text-sky-600 mb-2" />
                  <p className="brand-font text-[8px] text-slate-600 mb-1">Payment</p>
                  <p className="text-[10px] text-zinc-900">Secure Payment</p>
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

      <div className="max-w-7xl mx-auto">
        <RecentlyViewed currentProductId={product.id} />
      </div>

      <ImageZoom
        images={product.gallery}
        activeIndex={zoomIndex}
        alt={`${product.name} — ${product.description}`}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        onIndexChange={(i) => setActiveImage(product.gallery[i])}
      />
    </motion.div>
  );
};

export default ProductDetail;