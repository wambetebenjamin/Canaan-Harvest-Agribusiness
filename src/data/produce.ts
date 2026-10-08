/**
 * Produce catalogue.
 *
 * NOTE ON THE CATEGORY COUNT
 * The build brief specifies the rail be labelled "Produce categories, 8 items."
 * while listing seven named categories (Vegetables, Fruits, Herbs and Spices,
 * Grains and Legumes, Dairy, Poultry and Eggs, Tubers). Both are satisfied by
 * including "All Produce" as the first, default chip — total 8 items. The
 * accessible label is derived from this array's length, so it can never drift
 * out of sync with the list. See docs/DECISIONS.md.
 */

export type Freshness = 'today' | '24h' | '48h';

export interface ProduceItem {
  id: string;
  name: string;
  category: CategoryId;
  /** Physical farm the item originates from. */
  originFarm: string;
  county: 'Nakuru' | 'Meru' | 'Machakos';
  /** Unit price in Kenyan Shillings. */
  unitPrice: number;
  /** What "unit" means for the price above. */
  unit: string;
  packSizes: string[];
  freshness: Freshness;
  image: string;
  alt: string;
  /** Cold-chain items surface in the neumorphic temperature indicator. */
  coldChain?: boolean;
  organic?: boolean;
}

export type CategoryId =
  | 'all'
  | 'vegetables'
  | 'fruits'
  | 'herbs-spices'
  | 'grains-legumes'
  | 'dairy'
  | 'poultry-eggs'
  | 'tubers';

export const CATEGORIES: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'all', label: 'All Produce', icon: 'leaf' },
  { id: 'vegetables', label: 'Vegetables', icon: 'leaf' },
  { id: 'fruits', label: 'Fruits', icon: 'apple' },
  { id: 'herbs-spices', label: 'Herbs and Spices', icon: 'sprout' },
  { id: 'grains-legumes', label: 'Grains and Legumes', icon: 'wheat' },
  { id: 'dairy', label: 'Dairy', icon: 'droplets' },
  { id: 'poultry-eggs', label: 'Poultry and Eggs', icon: 'egg' },
  { id: 'tubers', label: 'Tubers', icon: 'carrot' },
];

const P = '/photos/produce';
const F = '/photos/farm';

export const PRODUCE: ProduceItem[] = [
  // ── Vegetables ───────────────────────────────────────────────────────────
  {
    id: 'sukuma-wiki',
    name: 'Sukuma Wiki (Collard Greens)',
    category: 'vegetables',
    originFarm: 'Nakuru Highlands Farm',
    county: 'Nakuru',
    unitPrice: 45,
    unit: 'per kg',
    packSizes: ['5 kg crate', '12 kg crate', '25 kg sack'],
    freshness: 'today',
    image: `${P}/fresh-leaves.jpg`,
    alt: 'Bundles of fresh leafy greens on display',
    organic: true,
  },
  {
    id: 'managu',
    name: 'Managu (African Nightshade)',
    category: 'vegetables',
    originFarm: 'Nakuru Highlands Farm',
    county: 'Nakuru',
    unitPrice: 90,
    unit: 'per kg',
    packSizes: ['2 kg box', '5 kg box'],
    freshness: 'today',
    image: `${F}/harvest-greens.jpg`,
    alt: 'A farmer carrying a basket through leafy crops',
    organic: true,
  },
  {
    id: 'terere',
    name: 'Terere (Amaranth Greens)',
    category: 'vegetables',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 75,
    unit: 'per kg',
    packSizes: ['3 kg box', '8 kg box'],
    freshness: 'today',
    image: `${P}/chard-beetroot.jpg`,
    alt: 'Fresh greens and beetroot side by side at market',
  },
  {
    id: 'tomatoes',
    name: 'Tomatoes (Anna F1)',
    category: 'vegetables',
    originFarm: 'Meru Ridge Farm',
    county: 'Meru',
    unitPrice: 110,
    unit: 'per kg',
    packSizes: ['10 kg crate', '20 kg crate'],
    freshness: '24h',
    image: `${P}/vegetable-basket.jpg`,
    alt: 'A basket of freshly picked tomatoes, peppers, cucumber and celery',
  },
  {
    id: 'hoho',
    name: 'Hoho (Green Bell Pepper)',
    category: 'vegetables',
    originFarm: 'Meru Ridge Farm',
    county: 'Meru',
    unitPrice: 140,
    unit: 'per kg',
    packSizes: ['5 kg crate', '10 kg crate'],
    freshness: '24h',
    image: `${F}/harvest-basket.jpg`,
    alt: 'A woven basket of freshly harvested vegetables and fruit',
    coldChain: true,
  },
  {
    id: 'carrots',
    name: 'Carrots (Nantes)',
    category: 'vegetables',
    originFarm: 'Nakuru Highlands Farm',
    county: 'Nakuru',
    unitPrice: 85,
    unit: 'per kg',
    packSizes: ['10 kg bag', '20 kg bag'],
    freshness: 'today',
    image: `${F}/soil-cultivation.jpg`,
    alt: 'Farmers working the soil with hand tools',
    coldChain: true,
  },

  // ── Fruits ───────────────────────────────────────────────────────────────
  {
    id: 'avocado-hass',
    name: 'Avocado (Hass)',
    category: 'fruits',
    originFarm: 'Meru Ridge Farm',
    county: 'Meru',
    unitPrice: 210,
    unit: 'per kg',
    packSizes: ['4 kg carton', '10 kg carton', 'Export 4 kg tray'],
    freshness: '24h',
    image: `${P}/fresh-leaves.jpg`,
    alt: 'Bundles of fresh leafy greens on display',
    coldChain: true,
  },
  {
    id: 'banana',
    name: 'Banana (Apple Banana)',
    category: 'fruits',
    originFarm: 'Meru Ridge Farm',
    county: 'Meru',
    unitPrice: 95,
    unit: 'per kg',
    packSizes: ['8 kg bunch', '18 kg crate'],
    freshness: '24h',
    image: `${P}/vegetable-basket.jpg`,
    alt: 'A basket of freshly picked tomatoes, peppers, cucumber and celery',
  },
  {
    id: 'mango',
    name: 'Mango (Apple Mango)',
    category: 'fruits',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 130,
    unit: 'per kg',
    packSizes: ['6 kg carton', '12 kg carton'],
    freshness: '48h',
    image: `${F}/harvest-basket.jpg`,
    alt: 'A woven basket of freshly harvested vegetables and fruit',
  },
  {
    id: 'passion',
    name: 'Passion Fruit (Purple)',
    category: 'fruits',
    originFarm: 'Meru Ridge Farm',
    county: 'Meru',
    unitPrice: 180,
    unit: 'per kg',
    packSizes: ['3 kg box', '8 kg box'],
    freshness: '48h',
    image: `${P}/chard-beetroot.jpg`,
    alt: 'Fresh greens and beetroot side by side at market',
  },

  // ── Herbs and Spices ─────────────────────────────────────────────────────
  {
    id: 'coriander',
    name: 'Coriander (Dhania)',
    category: 'herbs-spices',
    originFarm: 'Nakuru Highlands Farm',
    county: 'Nakuru',
    unitPrice: 60,
    unit: 'per kg',
    packSizes: ['1 kg bunch pack', '5 kg crate'],
    freshness: 'today',
    image: `${P}/fresh-leaves.jpg`,
    alt: 'Bundles of fresh leafy greens on display',
    coldChain: true,
  },
  {
    id: 'basil',
    name: 'Sweet Basil',
    category: 'herbs-spices',
    originFarm: 'Meru Ridge Farm',
    county: 'Meru',
    unitPrice: 320,
    unit: 'per kg',
    packSizes: ['500 g punnet', '1 kg box'],
    freshness: 'today',
    image: `${F}/harvest-greens.jpg`,
    alt: 'A farmer carrying a basket through leafy crops',
    coldChain: true,
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    category: 'herbs-spices',
    originFarm: 'Meru Ridge Farm',
    county: 'Meru',
    unitPrice: 280,
    unit: 'per kg',
    packSizes: ['500 g pack', '2 kg box'],
    freshness: '48h',
    image: `${P}/chard-beetroot.jpg`,
    alt: 'Fresh greens and beetroot side by side at market',
  },
  {
    id: 'chilli',
    name: 'Red Chilli (Bird\'s Eye)',
    category: 'herbs-spices',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 400,
    unit: 'per kg',
    packSizes: ['1 kg box', '5 kg box'],
    freshness: '48h',
    image: `${P}/vegetable-basket.jpg`,
    alt: 'A basket of freshly picked tomatoes, peppers, cucumber and celery',
  },

  // ── Grains and Legumes ───────────────────────────────────────────────────
  {
    id: 'maize',
    name: 'White Maize (Dry)',
    category: 'grains-legumes',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 65,
    unit: 'per kg',
    packSizes: ['25 kg bag', '50 kg bag', '90 kg bag'],
    freshness: '48h',
    image: `${F}/farm-field-aerial.webp`,
    alt: 'Aerial view of cultivated farmland in the Kenyan highlands',
  },
  {
    id: 'beans-rosecoco',
    name: 'Rosecoco Beans',
    category: 'grains-legumes',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 155,
    unit: 'per kg',
    packSizes: ['10 kg bag', '25 kg bag', '50 kg bag'],
    freshness: '48h',
    image: `${F}/field-rows.jpg`,
    alt: 'Rows of young crops on a working farm',
  },
  {
    id: 'green-grams',
    name: 'Green Grams (Ndengu)',
    category: 'grains-legumes',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 190,
    unit: 'per kg',
    packSizes: ['10 kg bag', '25 kg bag'],
    freshness: '48h',
    image: `${F}/farm-field-aerial.webp`,
    alt: 'Aerial view of cultivated farmland in the Kenyan highlands',
  },
  {
    id: 'groundnuts',
    name: 'Groundnuts (Shelled)',
    category: 'grains-legumes',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 260,
    unit: 'per kg',
    packSizes: ['5 kg bag', '20 kg bag'],
    freshness: '48h',
    image: `${F}/field-rows.jpg`,
    alt: 'Rows of young crops on a working farm',
  },

  // ── Dairy ────────────────────────────────────────────────────────────────
  {
    id: 'milk-fresh',
    name: 'Fresh Cow Milk',
    category: 'dairy',
    originFarm: 'Nakuru Highlands Farm',
    county: 'Nakuru',
    unitPrice: 70,
    unit: 'per litre',
    packSizes: ['5 L jerrican', '20 L churn', '50 L churn'],
    freshness: 'today',
    image: `${F}/packhouse-grading.jpg`,
    alt: 'Workers filling sacks with harvested crops on the farm',
    coldChain: true,
  },
  {
    id: 'yoghurt',
    name: 'Natural Yoghurt',
    category: 'dairy',
    originFarm: 'Nakuru Highlands Farm',
    county: 'Nakuru',
    unitPrice: 320,
    unit: 'per 5 L',
    packSizes: ['500 ml tub', '5 L bucket'],
    freshness: '24h',
    image: `${F}/packhouse-grading.jpg`,
    alt: 'Workers filling sacks with harvested crops on the farm',
    coldChain: true,
  },
  {
    id: 'ghee',
    name: 'Farm Ghee',
    category: 'dairy',
    originFarm: 'Nakuru Highlands Farm',
    county: 'Nakuru',
    unitPrice: 1400,
    unit: 'per litre',
    packSizes: ['1 L jar', '5 L tin'],
    freshness: '48h',
    image: `${F}/harvest-basket.jpg`,
    alt: 'A woven basket of freshly harvested vegetables and fruit',
  },
  {
    id: 'cream',
    name: 'Fresh Cream',
    category: 'dairy',
    originFarm: 'Nakuru Highlands Farm',
    county: 'Nakuru',
    unitPrice: 560,
    unit: 'per litre',
    packSizes: ['1 L carton', '5 L carton'],
    freshness: 'today',
    image: `${F}/packhouse-grading.jpg`,
    alt: 'Workers filling sacks with harvested crops on the farm',
    coldChain: true,
  },

  // ── Poultry and Eggs ─────────────────────────────────────────────────────
  {
    id: 'eggs',
    name: 'Farm Eggs (Tray)',
    category: 'poultry-eggs',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 420,
    unit: 'per 30-egg tray',
    packSizes: ['1 tray', '12 trays', 'Full crate (30 trays)'],
    freshness: 'today',
    image: `${F}/seedling-nursery.jpg`,
    alt: 'Young seedlings growing in soil-filled nursery trays',
    coldChain: true,
  },
  {
    id: 'chicken-whole',
    name: 'Whole Kienyeji Chicken',
    category: 'poultry-eggs',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 620,
    unit: 'per kg dressed',
    packSizes: ['5 kg box', '10 kg box'],
    freshness: 'today',
    image: `${F}/packhouse-grading.jpg`,
    alt: 'Workers filling sacks with harvested crops on the farm',
    coldChain: true,
  },
  {
    id: 'chicken-pieces',
    name: 'Chicken Portions',
    category: 'poultry-eggs',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 540,
    unit: 'per kg',
    packSizes: ['5 kg box', '10 kg box'],
    freshness: 'today',
    image: `${F}/harvest-basket.jpg`,
    alt: 'A woven basket of freshly harvested vegetables and fruit',
    coldChain: true,
  },
  {
    id: 'turkey',
    name: 'Turkey (Whole)',
    category: 'poultry-eggs',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 780,
    unit: 'per kg dressed',
    packSizes: ['6 kg box', '12 kg box'],
    freshness: '24h',
    image: `${F}/packhouse-grading.jpg`,
    alt: 'Workers filling sacks with harvested crops on the farm',
    coldChain: true,
  },

  // ── Tubers ───────────────────────────────────────────────────────────────
  {
    id: 'potatoes',
    name: 'Irish Potatoes (Shangi)',
    category: 'tubers',
    originFarm: 'Nakuru Highlands Farm',
    county: 'Nakuru',
    unitPrice: 55,
    unit: 'per kg',
    packSizes: ['25 kg bag', '50 kg bag', '90 kg bag'],
    freshness: '24h',
    image: `${F}/soil-cultivation.jpg`,
    alt: 'Farmers working the soil with hand tools',
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potato (Orange Flesh)',
    category: 'tubers',
    originFarm: 'Nakuru Highlands Farm',
    county: 'Nakuru',
    unitPrice: 70,
    unit: 'per kg',
    packSizes: ['10 kg bag', '25 kg bag'],
    freshness: '24h',
    image: `${F}/soil-cultivation.jpg`,
    alt: 'Farmers working the soil with hand tools',
  },
  {
    id: 'nduma',
    name: 'Nduma (Arrowroot)',
    category: 'tubers',
    originFarm: 'Nakuru Highlands Farm',
    county: 'Nakuru',
    unitPrice: 120,
    unit: 'per kg',
    packSizes: ['10 kg bag', '20 kg bag'],
    freshness: '48h',
    image: `${F}/field-rows.jpg`,
    alt: 'Rows of young crops on a working farm',
  },
  {
    id: 'cassava',
    name: 'Cassava',
    category: 'tubers',
    originFarm: 'Machakos Valley Farm',
    county: 'Machakos',
    unitPrice: 60,
    unit: 'per kg',
    packSizes: ['20 kg bag', '50 kg bag'],
    freshness: '48h',
    image: `${F}/soil-cultivation.jpg`,
    alt: 'Farmers working the soil with hand tools',
  },
];

export const FRESHNESS_LABEL: Record<Freshness, string> = {
  today: 'Harvested today',
  '24h': 'Harvested 24h ago',
  '48h': 'Harvested 48h ago',
};

/** Weekly harvest volume in tonnes, used by the neumorphic mini chart. */
export const HARVEST_VOLUME = [
  { week: 'W1', tonnes: 18.4 },
  { week: 'W2', tonnes: 22.1 },
  { week: 'W3', tonnes: 19.6 },
  { week: 'W4', tonnes: 26.8 },
  { week: 'W5', tonnes: 31.2 },
  { week: 'W6', tonnes: 28.5 },
  { week: 'W7', tonnes: 34.9 },
  { week: 'W8', tonnes: 30.4 },
];

export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}
