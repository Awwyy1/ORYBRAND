import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="brand-font text-[8rem] md:text-[12rem] font-bold text-gradient-silver leading-none mb-4">
          404
        </h1>
        <p className="brand-font text-sm md:text-lg tracking-[0.5em] text-sky-400 mb-6 uppercase">
          Page Not Found
        </p>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-12 leading-relaxed font-light">
          The page you're looking for doesn't exist or has been moved. Let's get you back to the collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="bg-sky-500 hover:bg-sky-400 px-10 py-4 brand-font text-xs tracking-widest text-white transition-all duration-300"
          >
            Back to Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="glass titanium-border px-10 py-4 brand-font text-xs tracking-widest text-white hover:bg-white/5 transition-all duration-300"
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
