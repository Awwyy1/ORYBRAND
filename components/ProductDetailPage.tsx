import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../data/products';
import ProductDetail from './ProductDetail';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = productId ? getProductById(productId) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] pt-40 flex flex-col items-center justify-center text-center px-6">
        <h1 className="brand-font text-4xl text-white mb-4">Product Not Found</h1>
        <p className="text-slate-400 mb-8">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="brand-font text-xs tracking-widest text-sky-400 hover:text-white transition-colors"
        >
          ← Return to Collection
        </button>
      </div>
    );
  }

  return <ProductDetail product={product} onClose={() => navigate('/')} />;
};

export default ProductDetailPage;
