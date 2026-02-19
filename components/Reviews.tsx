import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Review {
  name: string;
  location: string;
  product: string;
  rating: number;
  text: string;
}

const reviews: Review[] = [
  {
    name: 'James L.',
    location: 'New York, NY',
    product: 'Ory Stealth',
    rating: 5,
    text: 'I didn\'t know underwear could feel like this. The silk is absurdly soft, and the fit is perfect. I\'ve replaced my entire drawer.',
  },
  {
    name: 'Marcus T.',
    location: 'London, UK',
    product: 'Ory Midnight',
    rating: 5,
    text: 'Worth every penny. The Midnight is on another level — the weight of the silk, the color, the cut. This is what luxury should feel like.',
  },
  {
    name: 'David K.',
    location: 'Berlin, DE',
    product: 'Ory Carbon',
    rating: 5,
    text: 'Bought Carbon for a trip — wore it 14 hours straight on a transatlantic flight. Zero irritation, zero adjustments. Converted for life.',
  },
  {
    name: 'Alex R.',
    location: 'Toronto, CA',
    product: 'Ory Ice',
    rating: 4,
    text: 'The cooling effect is subtle but real. Perfect for summer. Only wish they made more colors. Already ordered two more pairs.',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const Reviews: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#0F0F0F]">
      <motion.div {...fadeInUp} className="mb-16">
        <h2 className="brand-font text-3xl mb-4">What They Say</h2>
        <div className="w-20 h-1 bg-sky-500"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-zinc-900/30 border border-white/5 p-6 flex flex-col"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`w-3 h-3 ${j < review.rating ? 'text-sky-400 fill-sky-400' : 'text-slate-700'}`}
                />
              ))}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-light flex-1 mb-6">
              "{review.text}"
            </p>

            <div className="border-t border-white/5 pt-4">
              <p className="brand-font text-[10px] text-white tracking-widest">{review.name}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">{review.location}</p>
              <p className="text-[9px] text-sky-400/60 uppercase tracking-wider mt-1">{review.product}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeInUp} className="mt-12 text-center">
        <p className="text-slate-500 text-xs uppercase tracking-widest">
          4.8 / 5 average from 1,200+ reviews
        </p>
      </motion.div>
    </section>
  );
};

export default Reviews;
