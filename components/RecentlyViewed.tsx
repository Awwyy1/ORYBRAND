import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../data/products';
import { useRecentlyViewed } from '../lib/useRecentlyViewed';

interface RecentlyViewedProps {
  currentProductId?: string;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId }) => {
  const navigate = useNavigate();
  const { viewedIds } = useRecentlyViewed();

  const products = viewedIds
    .filter(id => id !== currentProductId)
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  if (products.length === 0) return null;

  return (
    <section className="mt-24 pt-16 border-t border-black/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="brand-font text-lg text-zinc-900 mb-2">Recently Viewed</h3>
        <div className="w-12 h-0.5 bg-sky-600 mb-8"></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product!.id}
              whileHover={{ y: -4 }}
              className="cursor-pointer group"
              onClick={() => { navigate(`/product/${product!.id}`); window.scrollTo(0, 0); }}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-zinc-100 titanium-border mb-3">
                <img
                  src={product!.image}
                  alt={product!.name}
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="brand-font text-xs text-zinc-900 group-hover:text-sky-600 transition-colors">{product!.name}</p>
              <p className="text-[10px] text-slate-500 mt-1">${product!.price}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default RecentlyViewed;
