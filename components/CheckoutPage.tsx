import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CreditCard, Truck, CheckCircle2, ArrowLeft, AlertCircle, Mail, Package, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createPaymentIntent, createOrder } from '../lib/api';
import type { Order } from '../lib/api';
import Breadcrumbs from './Breadcrumbs';

const STRIPE_TEST_HINT = [
  { card: '4242 4242 4242 4242', result: 'Success (Visa)' },
  { card: '5555 5555 5555 4444', result: 'Success (MC)' },
  { card: '4000 0000 0000 9995', result: 'Decline' },
];

function formatCard(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

// H18: Client-side validation helpers
function sanitizeInput(str: string): string {
  return str.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim();
}

function validateForm(form: Record<string, string>): string | null {
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(form.email)) return 'Please enter a valid email address.';
  if (form.firstName.length < 1 || form.firstName.length > 50) return 'First name is required (max 50 chars).';
  if (form.lastName.length < 1 || form.lastName.length > 50) return 'Last name is required (max 50 chars).';
  if (form.address.length < 3) return 'Please enter a valid address.';
  if (form.city.length < 2) return 'Please enter a valid city.';
  if (!/^[A-Za-z0-9\s\-]{2,15}$/.test(form.zip)) return 'Please enter a valid ZIP/postal code.';
  if (form.country.length < 2) return 'Please enter a country.';
  const cardDigits = form.cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cardDigits)) return 'Please enter a valid card number (13-19 digits).';
  if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return 'Expiry must be MM/YY format.';
  const [mm] = form.expiry.split('/').map(Number);
  if (mm < 1 || mm > 12) return 'Invalid expiry month.';
  if (!/^\d{3,4}$/.test(form.cvc)) return 'CVC must be 3 or 4 digits.';
  return null;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, subtotalPrice, discount, appliedPromo, promoError, applyPromo, removePromo, clearCart } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [formErrors, setFormErrors] = useState('');
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
      <div className="min-h-screen bg-[#F8F9FA] pt-40 flex flex-col items-center justify-center text-center px-6">
        <h1 className="brand-font text-4xl text-zinc-900 mb-4">Cart is Empty</h1>
        <p className="text-slate-600 mb-8">Your bag is empty. Add something bold.</p>
        <button
          onClick={() => navigate('/')}
          className="brand-font text-xs tracking-widest text-sky-600 hover:text-zinc-900 transition-colors"
        >
          &larr; Browse Collection
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors('');

    // H18: Client-side validation before sending
    const validationError = validateForm(form);
    if (validationError) {
      setFormErrors(validationError);
      return;
    }

    setStep('processing');
    setErrorMsg('');

    try {
      // Step 1: Process payment via mock Stripe
      const payment = await createPaymentIntent(totalPrice, form.cardNumber.replace(/\s/g, ''));

      if (payment.status === 'failed') {
        const messages: Record<string, string> = {
          insufficient_funds: 'Insufficient funds. Try test card 4242 4242 4242 4242.',
          card_declined: 'Card declined. Try test card 4242 4242 4242 4242.',
          stolen_card: 'Card flagged. Try test card 4242 4242 4242 4242.',
        };
        setErrorMsg(messages[payment.error || ''] || 'Payment failed. Please try again.');
        setStep('error');
        return;
      }

      // Step 2: Create order in backend
      const orderItems = cart.map(item => ({
        productId: item.id,
        size: item.selectedSize,
        quantity: item.quantity,
      }));

      const newOrder = await createOrder(orderItems, {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        city: form.city,
        zip: form.zip,
        country: form.country,
      }, payment.id);

      setOrder(newOrder);
      setStep('success');
      clearCart();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStep('error');
    }
  };

  const updateField = (field: string, value: string) => {
    // H18: Sanitize text inputs (skip card/expiry/cvc which have their own formatters)
    const sanitized = ['cardNumber', 'expiry', 'cvc'].includes(field) ? value : sanitizeInput(value);
    setForm(prev => ({ ...prev, [field]: sanitized }));
    if (formErrors) setFormErrors('');
  };

  // ─── SUCCESS ────────────────────────────────────────────────────
  if (step === 'success' && order) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#F8F9FA] pt-32 pb-32 px-6 md:px-12"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-500 mb-8 mx-auto" />
          </motion.div>
          <h1 className="brand-font text-4xl text-zinc-900 mb-4">Order Confirmed</h1>
          <p className="brand-font text-sm text-sky-600 tracking-[0.3em] mb-8">WELCOME TO THE CLUB</p>

          {/* Order details card */}
          <div className="bg-zinc-100/50 border border-black/5 p-8 text-left mb-8 space-y-6">
            <div className="flex justify-between items-center border-b border-black/5 pb-4">
              <span className="brand-font text-[10px] text-slate-600 tracking-widest">ORDER ID</span>
              <span className="brand-font text-sm text-zinc-900">{order.id}</span>
            </div>

            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.name} ({item.size}) x{item.quantity}</span>
                  <span className="text-zinc-900">${item.total}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-black/5 pt-4 flex justify-between">
              <span className="brand-font text-xs text-slate-600 tracking-widest">TOTAL</span>
              <span className="brand-font text-xl text-zinc-900">${order.total}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-black/5">
              <div className="flex items-center gap-3 p-3 bg-zinc-100 border border-black/5">
                <Package className="w-5 h-5 text-sky-600 flex-shrink-0" />
                <div>
                  <p className="brand-font text-[8px] text-slate-600">TRACKING</p>
                  <p className="text-xs text-zinc-900 font-mono">{order.trackingNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-100 border border-black/5">
                <Truck className="w-5 h-5 text-sky-600 flex-shrink-0" />
                <div>
                  <p className="brand-font text-[8px] text-slate-600">DELIVERY</p>
                  <p className="text-xs text-zinc-900">{order.estimatedDelivery}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-100 border border-black/5">
                <Mail className="w-5 h-5 text-sky-600 flex-shrink-0" />
                <div>
                  <p className="brand-font text-[8px] text-slate-600">CONFIRMATION</p>
                  <p className="text-xs text-zinc-900">Sent to email</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-slate-600 text-xs mb-8 italic">
            (Test mode — mock Stripe payment processed, confirmation email logged to server)
          </p>

          <button
            onClick={() => navigate('/')}
            className="brand-font text-xs tracking-widest text-sky-600 hover:text-zinc-900 transition-colors"
          >
            &larr; Back to Shop
          </button>
        </div>
      </motion.div>
    );
  }

  // ─── PROCESSING ─────────────────────────────────────────────────
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] pt-40 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-sky-600 border-t-transparent rounded-full mb-8"
        />
        <h2 className="brand-font text-xl text-zinc-900 mb-2">Processing Payment</h2>
        <p className="text-slate-600 brand-font text-[10px] tracking-[0.3em] uppercase">
          Connecting to Stripe (test mode)...
        </p>
      </div>
    );
  }

  // ─── ERROR ──────────────────────────────────────────────────────
  if (step === 'error') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] pt-40 flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <AlertCircle className="w-20 h-20 text-red-500 mb-8 mx-auto" />
        </motion.div>
        <h1 className="brand-font text-3xl text-zinc-900 mb-4">Payment Failed</h1>
        <p className="text-slate-600 max-w-md mb-8">{errorMsg}</p>
        <button
          onClick={() => setStep('form')}
          className="bg-sky-600 hover:bg-sky-500 px-8 py-4 brand-font text-xs tracking-widest text-white transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ─── FORM ───────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8F9FA] pt-28 pb-32 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs items={[{ label: 'Checkout' }]} />

        <h1 className="brand-font text-3xl md:text-4xl text-zinc-900 mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            {/* Contact */}
            <div>
              <h3 className="brand-font text-xs text-sky-600 tracking-widest mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Contact
              </h3>
              <input
                type="email"
                required
                placeholder="Email address"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full bg-zinc-100 border border-black/10 px-4 py-3 text-zinc-900 text-sm focus:border-sky-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Shipping */}
            <div>
              <h3 className="brand-font text-xs text-sky-600 tracking-widest mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Shipping Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="bg-zinc-100 border border-black/10 px-4 py-3 text-zinc-900 text-sm focus:border-sky-600 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="bg-zinc-100 border border-black/10 px-4 py-3 text-zinc-900 text-sm focus:border-sky-600 focus:outline-none transition-colors"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Address"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full mt-4 bg-zinc-100 border border-black/10 px-4 py-3 text-zinc-900 text-sm focus:border-sky-600 focus:outline-none transition-colors"
              />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="bg-zinc-100 border border-black/10 px-4 py-3 text-zinc-900 text-sm focus:border-sky-600 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder="ZIP code"
                  value={form.zip}
                  onChange={(e) => updateField('zip', e.target.value)}
                  className="bg-zinc-100 border border-black/10 px-4 py-3 text-zinc-900 text-sm focus:border-sky-600 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="bg-zinc-100 border border-black/10 px-4 py-3 text-zinc-900 text-sm focus:border-sky-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Payment — Mock Stripe */}
            <div>
              <h3 className="brand-font text-xs text-sky-600 tracking-widest mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment
                <span className="ml-auto text-[9px] text-slate-600 font-normal tracking-normal normal-case">
                  Stripe Test Mode
                </span>
              </h3>

              {/* Test card hints */}
              <div className="mb-4 p-3 bg-sky-600/5 border border-sky-600/10 rounded-sm">
                <p className="text-[10px] text-sky-600 uppercase tracking-wider mb-2 brand-font">Test Cards</p>
                <div className="space-y-1">
                  {STRIPE_TEST_HINT.map(h => (
                    <div key={h.card} className="flex justify-between text-[10px]">
                      <span className="text-slate-600 font-mono">{h.card}</span>
                      <span className="text-slate-600">{h.result}</span>
                    </div>
                  ))}
                </div>
              </div>

              <input
                type="text"
                required
                placeholder="Card number"
                value={form.cardNumber}
                onChange={(e) => updateField('cardNumber', formatCard(e.target.value))}
                maxLength={19}
                className="w-full bg-zinc-100 border border-black/10 px-4 py-3 text-zinc-900 text-sm focus:border-sky-600 focus:outline-none transition-colors font-mono"
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={(e) => updateField('expiry', formatExpiry(e.target.value))}
                  maxLength={5}
                  className="bg-zinc-100 border border-black/10 px-4 py-3 text-zinc-900 text-sm focus:border-sky-600 focus:outline-none transition-colors font-mono"
                />
                <input
                  type="text"
                  required
                  placeholder="CVC"
                  value={form.cvc}
                  onChange={(e) => updateField('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  className="bg-zinc-100 border border-black/10 px-4 py-3 text-zinc-900 text-sm focus:border-sky-600 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {formErrors && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-sm">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {formErrors}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-5 bg-sky-600 hover:bg-sky-500 text-white brand-font text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              PAY ${totalPrice}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-100/50 border border-black/5 p-8 sticky top-28">
              <h3 className="brand-font text-xs text-zinc-900 tracking-widest mb-8">Order Summary</h3>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-zinc-100 overflow-hidden border border-black/5 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={`${item.name}, size ${item.selectedSize} — checkout item`} loading="lazy" />
                    </div>
                    <div className="flex-1">
                      <p className="brand-font text-[10px] text-zinc-900 tracking-widest">{item.name}</p>
                      <p className="text-[10px] text-slate-600 uppercase mt-1">Size: {item.selectedSize} / Qty: {item.quantity}</p>
                      <p className="brand-font text-sky-600 text-xs mt-2">${item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-black/5 space-y-3">
                {/* Promo Code */}
                <div className="pb-3">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-sky-600/10 border border-sky-600/20 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-sky-600" />
                        <span className="brand-font text-[10px] text-sky-600 tracking-widest">{appliedPromo.code}</span>
                        <span className="text-[10px] text-slate-600">{appliedPromo.description}</span>
                      </div>
                      <button onClick={removePromo} className="text-slate-600 hover:text-zinc-900 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyPromo(promoInput); setPromoInput(''); } }}
                        className="flex-1 bg-zinc-100 border border-black/10 px-3 py-2 text-zinc-900 text-xs brand-font tracking-widest focus:border-sky-600 focus:outline-none transition-colors uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => { applyPromo(promoInput); setPromoInput(''); }}
                        className="px-4 py-2 bg-black/5 border border-black/10 brand-font text-[10px] text-zinc-900 tracking-widest hover:bg-black/10 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {promoError && <p className="text-red-400 text-[10px] mt-1">{promoError}</p>}
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal</span>
                  <span>${subtotalPrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-sky-600">Discount</span>
                    <span className="text-sky-600">-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-black/5">
                  <span className="brand-font text-xs text-slate-600 tracking-widest">Total</span>
                  <span className="brand-font text-xl text-zinc-900">${totalPrice}</span>
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
