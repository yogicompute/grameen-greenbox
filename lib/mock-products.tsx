export interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
    images:string[]
  hoverImage?: string
  rating: number
  reviews: number
  category: string
  badge?: {
    text: string
    type: 'new' | 'sale'
  }
  stockStatus?: {
    count: number
    showWarning?: boolean
  }
  description: string
  longDescription: string
  features: string[]
  specifications: Record<string, string>
  variants?: Array<{
    id: string
    label: string
    options: string[]
  }>
}

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Basmati Rice 1kg',
    price: 299,
    originalPrice: 399,
    image: '/byuli-dal/byuli-dal-1.png',
    images:['/byuli-dal/byuli-dal-1.png','/byuli-dal/byuli-dal-2.png','/byuli-dal/byuli-dal-3.png'],
    hoverImage: '/premium-rice-closeup.jpg',
    rating: 4.5,
    reviews: 328,
    category: 'Grains',
    badge: { text: 'Sale', type: 'sale' },
    stockStatus: { count: 15, showWarning: false },
    description: 'Premium quality long grain basmati rice',
    longDescription: 'High-quality basmati rice sourced from the best farms. Perfect for biryanis, pilafs, and everyday cooking.',
    features: ['Long grain', 'Aromatic', 'Aged 2 years', 'No broken grains'],
    specifications: { weight: '1kg', origin: 'India', type: 'Basmati' },
  },
  {
    id: '2',
    title: 'Organic Red Lentils 500g',
    price: 149,
    originalPrice: 189,
    image: '/red-lentils.jpg',
    images:['/red-lentils/red-lentils-1.png','/red-lentils/red-lentils-2.png','/red-lentils/red-lentils-3.png'],
    rating: 4.8,
    reviews: 512,
    category: 'Pulses',
    badge: { text: 'New', type: 'new' },
    stockStatus: { count: 2, showWarning: true },
    description: 'Organic red lentils, naturally protein-rich',
    longDescription: 'Pure organic red lentils perfect for dal, soups, and curries. High in protein and fiber.',
    features: ['100% Organic', 'High protein', 'No chemicals', 'Easy to cook'],
    specifications: { weight: '500g', origin: 'India', type: 'Red Lentils' },
  },
  {
    id: '3',
    title: 'Pure Ghee 500ml',
    price: 449,
    originalPrice: 549,
    image: '/ghee-container.jpg',
    images:['/pure-ghee/pure-ghee-1.png','/pure-ghee/pure-ghee-2.png','/pure-ghee/pure-ghee-3.png'],
    hoverImage: '/pure-ghee-clarified-butter.jpg',
    rating: 4.9,
    reviews: 1024,
    category: 'Natural Goodness',
    stockStatus: { count: 45, showWarning: false },
    description: 'Pure A2 cow ghee, handcrafted',
    longDescription: 'Traditional handcrafted A2 ghee from grass-fed cows. Rich, aromatic, and perfect for cooking and consumption.',
    features: ['A2 Ghee', 'Handcrafted', 'Grass-fed', 'No preservatives'],
    specifications: { weight: '500ml', type: 'A2 Ghee', origin: 'India' },
  },
  {
    id: '4',
    title: 'Raw Honey 500g',
    price: 299,
    originalPrice: 379,
    image: '/golden-honey-jar.png',
    images:['/raw-honey/raw-honey-1.jpg','/raw-honey/raw-honey-2.jpg','/raw-honey/raw-honey-3.jpg'],
    hoverImage: '/raw-honey-golden.jpg',
    rating: 4.7,
    reviews: 456,
    category: 'Natural Goodness',
    badge: { text: 'New', type: 'new' },
    stockStatus: { count: 30, showWarning: false },
    description: 'Pure raw unfiltered honey',
    longDescription: 'Natural raw honey with all beneficial enzymes intact. Great for health and wellness.',
    features: ['100% Raw', 'Unfiltered', 'No additives', 'Rich in enzymes'],
    specifications: { weight: '500g', type: 'Raw Honey', purity: '100%' },
  },
  {
    id: '5',
    title: 'Moong Dal 1kg',
    price: 199,
    originalPrice: 249,
    image: '/moong-dal.jpg',
    images:['/moong-dal/moong-dal-1.jpg','/moong-dal/moong-dal-2.jpg','/moong-dal/moong-dal-3.jpg'],
    rating: 4.6,
    reviews: 278,
    category: 'Pulses',
    stockStatus: { count: 60, showWarning: false },
    description: 'Premium split moong dal',
    longDescription: 'Fresh, clean moong dal perfect for khichdi, dal preparations, and sprouts.',
    features: ['Premium quality', 'No stones', 'Fresh harvest', 'Easy to cook'],
    specifications: { weight: '1kg', type: 'Moong Dal', origin: 'India' },
  },
  {
    id: '6',
    title: 'Whole Wheat Flour 2kg',
    price: 129,
    originalPrice: 179,
    image: '/wheat-flour-bag.png',
    images:['/whole-wheat-flour/whole-wheat-flour-1.jpg','/whole-wheat-flour/whole-wheat-flour-2.jpg','/whole-wheat-flour/whole-wheat-flour-3.jpg'],
    hoverImage: '/whole-wheat-flour.png',
    rating: 4.4,
    reviews: 189,
    category: 'Grains',
    badge: { text: 'Sale', type: 'sale' },
    stockStatus: { count: 100, showWarning: false },
    description: 'Stone-ground whole wheat flour',
    longDescription: 'Premium whole wheat flour ground fresh from select wheat grains. Perfect for rotis and whole grain baking.',
    features: ['Stone-ground', 'Fiber-rich', 'No additives', 'Fresh'],
    specifications: { weight: '2kg', type: 'Wheat Flour', grind: 'Stone-ground' },
  },
]
