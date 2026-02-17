import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Philosophy from './components/Philosophy';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import SideMenu from './components/SideMenu';
import InfoPage from './components/InfoPage';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';

const HomePage: React.FC = () => (
  <>
    <Hero />
    <Philosophy />
    <ProductGrid />
  </>
);

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigateTo = (page: string | null) => {
    setIsMenuOpen(false);
    if (page === null) {
      navigate('/');
    } else {
      navigate(`/${page}`);
    }
    window.scrollTo(0, 0);
  };

  return (
    <CartProvider>
      <div className="relative min-h-screen bg-[#0F0F0F]">
        <Header onMenuOpen={() => setIsMenuOpen(true)} onHome={() => navigateTo(null)} />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/:pageId" element={<InfoPage />} />
          </Routes>
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
