import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Philosophy from './components/Philosophy';
import Reviews from './components/Reviews';
import Newsletter from './components/Newsletter';
import WhySilk from './components/WhySilk';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import SideMenu from './components/SideMenu';
import CompareModels from './components/CompareModels';

// Lazy-loaded routes (H7: Code splitting)
const ProductDetailPage = lazy(() => import('./components/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./components/CheckoutPage'));
const InfoPage = lazy(() => import('./components/InfoPage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const HomePage: React.FC = () => (
  <>
    <Hero />
    <Philosophy />
    <WhySilk />
    <ProductGrid />
    <CompareModels />
    <Reviews />
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
      <div className="relative min-h-screen bg-[#F8F9FA]">
        {/* H22: Skip-to-content link for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-sky-600 focus:text-white focus:px-6 focus:py-3 focus:brand-font focus:text-xs focus:tracking-widest focus:shadow-lg focus:outline-none"
        >
          Skip to content
        </a>

        <Header onMenuOpen={() => setIsMenuOpen(true)} onHome={() => navigateTo(null)} />

        <main id="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/:pageId" element={<InfoPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Newsletter />
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
