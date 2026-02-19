import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'stealth',
    name: 'Ory Stealth',
    price: 85,
    description: 'Black Obsidian Silk',
    longDescription: "Engineered for complete thermal regulation and absolute discretion. Our Stealth series utilizes a bespoke Obsidian weave that traps zero moisture while providing a weightless, high-tensile fit. The ultimate base layer for those who don't settle for less.",
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1200'
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
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=1200'
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
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1558171814-2e52eb2bfb36?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617952739858-28043cec9b50?auto=format&fit=crop&q=80&w=1200'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    faq: [
      { question: "How does the 'cooling' work?", answer: "The triangular structure of the silk fiber reflects light and dissipates heat more efficiently than any other natural material." },
      { question: "Does the silver weave tarnish?", answer: "No, the 'silver' refers to the optical grade of the silk fiber, which maintains its brilliance for the life of the garment." }
    ]
  },
  {
    id: 'midnight',
    name: 'Ory Midnight',
    price: 110,
    description: 'Royal Deep Blue',
    longDescription: 'The pinnacle of the collection. The Midnight series uses ultra-dense silk harvesting to create a rich, light-absorbing blue that exudes authority and sophistication. Our heaviest silk weight for maximum luxury.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1200'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    faq: [
      { question: "Why is the price higher?", answer: "Midnight uses 30% more silk thread per square inch compared to our standard series, resulting in a significantly more luxurious hand-feel." },
      { question: "Will the blue color bleed?", answer: "Every Midnight garment undergoes a 24-hour color-locking bath to ensure the deep blue remains vibrant through countless wears." }
    ]
  }
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}
