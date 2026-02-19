import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Shield, Truck, Zap, Eye, Quote } from 'lucide-react';

const InfoPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const getContent = () => {
    switch(pageId) {
      case 'philosophy':
        return {
          title: "Philosophy",
          icon: <Quote className="w-12 h-12 text-sky-400" />,
          sections: [
            { h: "THE SILK COVENANT", p: "We believe that luxury shouldn't be fragile. Our philosophy centers on the intersection of biological comfort and mechanical precision. To wear ORY is to enter a pact with your own skin—a promise of zero friction and absolute confidence." },
            { h: "ANATOMICAL ENGINEERING", p: "We don't design underwear; we engineer habitats. Every curve and stitch is dictated by the physics of the male body in motion. We use 100% Grade 6A Mulberry silk because it is the only material that respects the complexity of human biology." },
            { h: "QUIET LUXURY", p: "True confidence is silent. Our garments carry no external logos. The value of ORY is known only to the wearer. It is a private standard of excellence for the man who demands the best where it matters most." }
          ]
        };
      case 'technology':
        return {
          title: "The Technology",
          icon: <Zap className="w-12 h-12 text-sky-400" />,
          sections: [
            { h: "GRADE 6A MULBERRY SILK", p: "The world's rarest and most resilient fiber. Our silk is harvested under precise temperature control to ensure a uniform molecular structure for maximum durability." },
            { h: "FRICTIONLESS SEAMS", p: "Engineered using high-precision laser cutting. Every seam is flat-locked to eliminate skin irritation, even during high-intensity movement." },
            { h: "TITANIUM-WAISTBAND", p: "A zero-pressure elastic core that remembers its original form. It provides support without constriction, fitting like a second skin." }
          ]
        };
      case 'shipping':
        return {
          title: "Shipping & Delivery",
          icon: <Truck className="w-12 h-12 text-sky-400" />,
          sections: [
            { h: "DISCREET PACKAGING", p: "No logos. No branding. Your privacy is our priority. Every ORY shipment arrives in a matte-black, vacuum-sealed container." },
            { h: "GLOBAL NETWORK", p: "Direct-to-consumer courier services across 180 countries. Average delivery time: 3-5 business days." },
            { h: "ORDER TRACKING", p: "Real-time updates straight to your inbox. Track your order every step of the way." }
          ]
        };
      case 'returns':
        return {
          title: "The Guarantee",
          icon: <Shield className="w-12 h-12 text-sky-400" />,
          sections: [
            { h: "30-DAY TRIAL", p: "Confidence must be earned. If ORY doesn't change your standard of comfort within 30 days, we'll facilitate a return." },
            { h: "HYGIENE POLICY", p: "To maintain our standards, only unworn items in original sealed packaging are eligible for return. Tried items are recycled for industrial fiber." },
            { h: "QUALITY AUDIT", p: "Every boxer undergoes a 12-point inspection before it leaves our facility." }
          ]
        };
      case 'privacy':
        return {
          title: "Privacy Policy",
          icon: <Eye className="w-12 h-12 text-sky-400" />,
          sections: [
            { h: "YOUR DATA", p: "We do not sell your preferences. Your measurements and orders are stored behind bank-level encryption." },
            { h: "PAYMENT PRIVACY", p: "Anonymous payment options supported. We only keep the records necessary for legal compliance." },
            { h: "NO COOKIE TRACKING", p: "Our site runs clean. We value your digital space as much as your physical comfort." }
          ]
        };
      default:
        return { title: "Section", icon: null, sections: [] };
    }
  };

  const content = getContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen pt-40 pb-24 px-6 md:px-24 bg-[#0F0F0F]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-6">
            {content.icon}
            <h1 className="brand-font text-4xl md:text-6xl text-white">{content.title}</h1>
          </div>
          <button onClick={() => navigate('/')} className="p-4 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-10 h-10 text-white" />
          </button>
        </div>

        <div className="space-y-24">
          {content.sections.map((sec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="border-l-2 border-sky-400/30 pl-12"
            >
              <h3 className="brand-font text-xl text-sky-400 mb-6">{sec.h}</h3>
              <p className="text-xl md:text-2xl font-light text-slate-300 leading-relaxed max-w-2xl">
                {sec.p}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 pt-12 border-t border-white/5">
          <button
            onClick={() => navigate('/')}
            className="brand-font text-xs tracking-widest text-white hover:text-sky-400 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoPage;
