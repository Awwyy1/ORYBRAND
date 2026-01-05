
import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-black border-t border-white/5 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <h2 className="brand-font text-2xl mb-4 text-white">ORY</h2>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed uppercase tracking-widest">
            For those with guts. Precision engineered silk for the modern man.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div>
            <h4 className="brand-font text-[10px] text-sky-400 mb-4">Explore</h4>
            <ul className="text-xs space-y-2 text-slate-500 uppercase tracking-widest">
              <li onClick={() => window.scrollTo(0, document.getElementById('shop')?.offsetTop || 0)} className="hover:text-white cursor-pointer transition-colors">Armory</li>
              <li onClick={() => onNavigate('technology')} className="hover:text-white cursor-pointer transition-colors">Technology</li>
              <li className="hover:text-white cursor-pointer transition-colors opacity-50 cursor-not-allowed">Philosophy</li>
            </ul>
          </div>
          <div>
            <h4 className="brand-font text-[10px] text-sky-400 mb-4">Support</h4>
            <ul className="text-xs space-y-2 text-slate-500 uppercase tracking-widest">
              <li onClick={() => onNavigate('shipping')} className="hover:text-white cursor-pointer transition-colors">Logistics</li>
              <li onClick={() => onNavigate('returns')} className="hover:text-white cursor-pointer transition-colors">Returns</li>
              <li onClick={() => onNavigate('privacy')} className="hover:text-white cursor-pointer transition-colors">Privacy</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center border-t border-white/5 pt-8">
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} ORY INDUSTRIES. ESTABLISHED IN THE SHADOWS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
