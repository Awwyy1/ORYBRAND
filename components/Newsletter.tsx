import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    // H18: Client-side email validation + sanitization
    const cleanEmail = email.replace(/[<>]/g, '').trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(cleanEmail) || cleanEmail.length > 254) {
      setErrorMsg('Please enter a valid email address');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-white border-t border-black/5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto text-center"
      >
        <Mail className="w-8 h-8 text-sky-600 mx-auto mb-6" />
        <h2 className="brand-font text-2xl md:text-3xl text-zinc-900 mb-4">Stay in the Loop</h2>
        <p className="text-slate-600 text-sm font-light mb-8 leading-relaxed">
          New drops, exclusive offers, and early access. No spam, just silk.
        </p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-3 py-4"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="brand-font text-xs text-green-400 tracking-widest">YOU'RE IN</span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex gap-0"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-100 border border-black/10 border-r-0 px-5 py-4 text-zinc-900 text-sm focus:border-sky-600 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-sky-600 hover:bg-sky-500 px-6 py-4 brand-font text-xs tracking-widest text-white transition-all flex items-center gap-2 active:scale-[0.98]"
              >
                {status === 'loading' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <span className="hidden sm:inline">SUBSCRIBE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {status === 'error' && (
          <p className="text-red-400 text-xs mt-3">{errorMsg}</p>
        )}

        <p className="text-slate-600 text-[10px] mt-4 uppercase tracking-wider">
          Unsubscribe anytime. We respect your privacy.
        </p>
      </motion.div>
    </section>
  );
};

export default Newsletter;
