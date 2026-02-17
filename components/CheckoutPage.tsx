import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CreditCard, Truck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] pt-40 flex flex-col items-center justify-center text-center px-6">
        <h1 className="brand-font text-4xl text-white mb-4">Cart is Empty</h1>
        <p className="text-slate-400 mb-8">Add some armor before checking out.</p>
        <button
          onClick={() => navigate('/')}
          className="brand-font text-xs tracking-widest text-sky-400 hover:text-white transition-colors"
        >
          ← Browse Collection
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      clearCart();
    }, 2500);
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#0F0F0F] pt-40 pb-32 flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <CheckCircle2 className="w-24 h-24 text-green-500 mb-8 mx-auto" />
        </motion.div>
        <h1 className="brand-font text-4xl text-white mb-4">Transaction Secured</h1>
        <p className="brand-font text-sm text-sky-400 tracking-[0.3em] mb-2">WELCOME TO THE ELITE</p>
        <p className="text-slate-400 max-w-md mb-12">
          Your armor is being prepared for stealth delivery. You will receive a confirmation at your email.
        </p>
        <p className="text-slate-500 text-xs mb-8 italic">
          (This is a demo checkout — no real payment was processed)
        </p>
        <button
          onClick={() => navigate('/')}
          className="brand-font text-xs tracking-widest text-sky-400 hover:text-white transition-colors"
        >
          ← Return to Armory
        </button>
      </motion.div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] pt-40 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-sky-400 border-t-transparent rounded-full mb-8"
        />
        <h2 className="brand-font text-xl text-white mb-2">Securing Transaction</h2>
        <p className="text-slate-500 brand-font text-[10px] tracking-[0.3em] uppercase">Encrypting payment data...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0F0F0F] pt-28 pb-32 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="brand-font text-[10px] tracking-widest uppercase">Back to Armory</span>
        </button>

        <h1 className="brand-font text-3xl md:text-4xl text-white mb-12">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            {/* Contact */}
            <div>
              <h3 className="brand-font text-xs text-sky-400 tracking-widest mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Contact
              </h3>
              <input
                type="email"
                required
                placeholder="Email address"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-sm focus:border-sky-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Shipping */}
            <div>
              <h3 className="brand-font text-xs text-sky-400 tracking-widest mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Shipping Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="bg-zinc-900 border border-white/10 px-4 py-3 text-white text-sm focus:border-sky-400 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="bg-zinc-900 border border-white/10 px-4 py-3 text-white text-sm focus:border-sky-400 focus:outline-none transition-colors"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Address"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full mt-4 bg-zinc-900 border border-white/10 px-4 py-3 text-white text-sm focus:border-sky-400 focus:outline-none transition-colors"
              />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="bg-zinc-900 border border-white/10 px-4 py-3 text-white text-sm focus:border-sky-400 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder="ZIP code"
                  value={form.zip}
                  onChange={(e) => updateField('zip', e.target.value)}
                  className="bg-zinc-900 border border-white/10 px-4 py-3 text-white text-sm focus:border-sky-400 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="bg-zinc-900 border border-white/10 px-4 py-3 text-white text-sm focus:border-sky-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Payment */}
            <div>
              <h3 className="brand-font text-xs text-sky-400 tracking-widest mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment (Demo)
              </h3>
              <p className="text-[10px] text-slate-500 mb-4 uppercase tracking-wider">
                This is a mockup — no real payment will be processed
              </p>
              <input
                type="text"
                required
                placeholder="Card number"
                value={form.cardNumber}
                onChange={(e) => updateField('cardNumber', e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white text-sm focus:border-sky-400 focus:outline-none transition-colors"
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={(e) => updateField('expiry', e.target.value)}
                  className="bg-zinc-900 border border-white/10 px-4 py-3 text-white text-sm focus:border-sky-400 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder="CVC"
                  value={form.cvc}
                  onChange={(e) => updateField('cvc', e.target.value)}
                  className="bg-zinc-900 border border-white/10 px-4 py-3 text-white text-sm focus:border-sky-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-sky-500 hover:bg-sky-400 text-white brand-font text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              COMPLETE ORDER — ${totalPrice}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900/50 border border-white/5 p-8 sticky top-28">
              <h3 className="brand-font text-xs text-white tracking-widest mb-8">Order Summary</h3>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-zinc-900 overflow-hidden border border-white/5 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <p className="brand-font text-[10px] text-white tracking-widest">{item.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase mt-1">Size: {item.selectedSize} / Qty: {item.quantity}</p>
                      <p className="brand-font text-sky-400 text-xs mt-2">${item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="brand-font text-xs text-slate-400 tracking-widest">Total</span>
                  <span className="brand-font text-xl text-white">${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
