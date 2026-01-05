
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  onProductClick?: (product: Product) => void;
}

const PRODUCTS: Product[] = [
  {
    id: 'stealth',
    name: 'Ory Stealth',
    price: 85,
    description: 'Black Obsidian Silk',
    longDescription: 'Engineered for complete thermal regulation and absolute discretion. Our Stealth series utilizes a bespoke Obsidian weave that traps zero moisture while providing a weightless, high-tensile fit. The ultimate base layer for those who move in the shadows.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=2070',
    gallery: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=2070',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=2070',
      'https://images.unsplash.com/photo-1590673366451-3f63d0431ae2?auto=format&fit=crop&q=80&w=2070'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    faq: [
      { question: "How does the silk handle active movement?", answer: "Our Grade 6A silk is reinforced with microscopic elastic polymers, allowing it to stretch and recover without losing its anatomical form." },
      { question: "Is the Obsidian dye skin-safe?", answer: "We use hypoallergenic, pH-neutral organic dyes that are molecularly bonded to the silk fibers to prevent any bleeding or irritation." },
      { question: "Washing instructions?", answer: "Hand wash in cold water or use a delicate mesh bag on a cold cycle. Do not tumble dry." }
    ]
  },
  {
    id: 'carbon',
    name: 'Ory Carbon',
    price: 95,
    description: 'Matte Grey Fusion',
    longDescription: 'A technical marvel in textile engineering. The Carbon series features a matte-finish silk blend that offers superior durability without compromising on the signature ORY softness. Designed for high-performance durability.',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=2030',
    gallery: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=2030',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=2030',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=2030'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    faq: [
      { question: "What is Matte Fusion?", answer: "It is a proprietary process that treats silk at the molecular level to give it a non-reflective, rugged texture while maintaining internal smoothness." },
      { question: "Is it suitable for high-humidity climates?", answer: "Yes, silk is naturally moisture-wicking and breathable, making it more effective than synthetic fabrics in humid conditions." }
    ]
  },
  {
    id: 'ice',
    name: 'Ory Ice',
    price: 85,
    description: 'Cold Silver Weave',
    longDescription: 'Infused with cool-touch technology, the Ice series is specifically woven to lower perceived skin temperature by 1.5 degrees. Perfect for intense environments where thermal management is critical.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1780',
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1780',
      'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&q=80&w=1780',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=1780'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    faq: [
      { question: "How does the 'cooling' work?", answer: "The triangular structure of the silk fiber reflects light and dissipates heat more efficiently than any other natural material." },
      { question: "Does the silver weave tarnish?", answer: "No, the 'silver' refers to the optical grade of the silk fiber, which maintains its brilliance for the life of the garment." }
    ]
  },
  {
    id: 'deep-blue',
    name: 'Ory Midnight',
    price: 110,
    description: 'Royal Deep Blue',
    longDescription: 'The pinnacle of the collection. The Midnight series uses ultra-dense silk harvesting to create a rich, light-absorbing blue that exudes authority and sophistication. Our heaviest silk weight for maximum luxury.',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2070',
    gallery: [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2070',
      'https://images.unsplash.com/photo-1617135671685-dd999798c147?auto=format&fit=crop&q=80&w=2070',
      'https://images.unsplash.com/photo-1594932224828-b4b059b6f68a?auto=format&fit=crop&q=80&w=2070'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    faq: [
      { question: "Why is the price higher?", answer: "Midnight uses 30% more silk thread per square inch compared to our standard series, resulting in a significantly more luxurious hand-feel." },
      { question: "Will the blue color bleed?", answer: "Every Midnight garment undergoes a 24-hour color-locking bath to ensure the deep blue remains vibrant through countless wears." }
    ]
  }
];

const ProductGrid: React.FC<ProductGridProps> = ({ onProductClick }) => {
  return (
    <section id="shop" className="py-24 px-6 md:px-12 bg-[#0F0F0F]">
      <div className="mb-16">
        <h2 className="brand-font text-3xl mb-4">The Armory</h2>
        <div className="w-20 h-1 bg-sky-500"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {PRODUCTS.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onOpenDetail={onProductClick}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;