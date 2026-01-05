
import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Philosophy from './components/Philosophy';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import SideMenu from './components/SideMenu';
import InfoPage from './components/InfoPage';
import ProductDetail from './components/ProductDetail';
import { Product } from './types';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const navigateTo = (page: string | null) => {
    setActivePage(page);
    setSelectedProduct(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo(0, 0);
  };

  return (
    <CartProvider>
      <div className="relative min-h-screen bg-[#0F0F0F]">
        <Header onMenuOpen={() => setIsMenuOpen(true)} onHome={() => navigateTo(null)} />
        
        <main>
          {selectedProduct ? (
            <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
          ) : activePage ? (
            <InfoPage pageId={activePage} onClose={() => navigateTo(null)} />
          ) : (
            <>
              <Hero />
              <Philosophy />
              <ProductGrid onProductClick={handleOpenProduct} />
            </>
          )}
        </main>

        <Footer onNavigate={navigateTo} />
        
        <SideMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          onNavigate={navigateTo} 
        />
        <CartDrawer />
      </div>
    </CartProvider>
  );
};

export default App;