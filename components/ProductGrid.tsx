import React from 'react';
import ProductCard from './ProductCard';
import { PRODUCTS } from '../data/products';

const ProductGrid: React.FC = () => {
  return (
    <section id="shop" className="py-24 px-6 md:px-12 bg-[#0F0F0F]">
      <div className="mb-16">
        <h2 className="brand-font text-3xl mb-4">The Armory</h2>
        <div className="w-20 h-1 bg-sky-500"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
