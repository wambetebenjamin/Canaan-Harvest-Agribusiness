/**
 * Editorial content: subscription boxes, scrollytelling beats, farm story
 * cards, testimonials and the blog manifest.
 */

import type { LucideIconName } from '@/lib/icons';

/* ── Weekly subscription boxes ──────────────────────────────────────────── */

export interface ProduceBox {
  id: 'household' | 'family' | 'catering';
  name: string;
  tagline: string;
  pricePerWeek: number;
  serves: string;
  image: string;
  alt: string;
  contents: string[];
  popular?: boolean;
}

export const BOXES: ProduceBox[] = [
  {
    id: 'household',
    name: 'Household Box',
    tagline: 'For one to three people',
    pricePerWeek: 1500,
    serves: '1–3 people',
    image: '/photos/produce/fresh-leaves.jpg',
    alt: 'Fresh curly kale leaves growing in a garden bed',
    contents: [
      'Sukuma wiki — 1 kg',
      'Tomatoes — 1 kg',
      'Onions — 1 kg',
      'Carrots — 1 kg',
      'Dhania — 1 bunch',
      'Seasonal fruit — 1 kg',
    ],
  },
  {
    id: 'family',
    name: 'Family Box',
    tagline: 'For four to seven people',
    pricePerWeek: 2900,
    serves: '4–7 people',
    image: '/photos/produce/vegetable-basket.jpg',
    alt: 'Assorted fresh vegetables in a harvest basket',
    popular: true,
    contents: [
      'Sukuma wiki — 2 kg',
      'Managu — 1 kg',
      'Tomatoes — 2 kg',
      'Carrots — 2 kg',
      'Hoho — 1 kg',
      'Potatoes — 4 kg',
      'Seasonal fruit — 3 kg',
      'Farm eggs — 1 tray',
    ],
  },
  {
    id: 'catering',
    name: 'Catering Box',
    tagline: 'For kitchens, cafés and events',
    pricePerWeek: 9600,
    serves: '30+ covers',
    image: '/photos/farm/harvest-basket.jpg',
    alt: 'A wicker basket of freshly picked vegetables carried through a field',
    contents: [
      'Sukuma wiki — 6 kg',
      'Tomatoes — 8 kg',
      'Onions — 6 kg',
      'Hoho — 3 kg',
      'Carrots — 5 kg',
      'Potatoes — 15 kg',
      'Herbs (dhania, basil, rosemary) — 1.5 kg',
      'Seasonal fruit — 8 kg',
    ],
  },
];

/* ── EFFECT-02 — scrollytelling beats ───────────────────────────────────── */

export interface JourneyBeat {
  id: string;
  step: string;
  title: string;
  body: string;
  meta: string;
  icon: LucideIconName;
  scene: 'seedling' | 'harvest' | 'sorting' | 'delivery';
}

export const JOURNEY_BEATS: JourneyBeat[] = [
  {
    id: 'planted',
    step: 'Beat 1',
    title: 'Seedling planted in the Nakuru highlands',
    body: 'Seed is sown into volcanic loam at 2,100 metres, where cool nights and long light build the sugars that make highland vegetables taste the way they should. Every plot is logged to a named farm partner and a sowing date.',
    meta: 'Nakuru Highlands Farm · 140 acres',
    icon: 'sprout',
    scene: 'seedling',
  },
  {
    id: 'harvested',
    step: 'Beat 2',
    title: 'Harvested at peak freshness',
    body: 'Crops are cut in the cool of the morning and moved into shade within the hour. Nothing waits in the field. Harvest windows are set by crop, not by convenience, so produce leaves the farm at its best rather than its most available.',
    meta: 'Cut between 05:30 and 08:00',
    icon: 'sun',
    scene: 'harvest',
  },
  {
    id: 'graded',
    step: 'Beat 3',
    title: 'Sorted and quality-graded at the packhouse',
    body: 'Every crate is graded by size, colour and firmness, then washed and cooled. Cold-chain lines hold leafy greens at 4 °C. Consignments that miss the grade are diverted rather than blended in — the reason our rejection rate at the buyer end stays under two per cent.',
    meta: 'Graded to destination specification',
    icon: 'check-circle',
    scene: 'sorting',
  },
  {
    id: 'delivered',
    step: 'Beat 4',
    title: 'Delivered to your kitchen or restaurant',
    body: 'Refrigerated vans leave the packhouse before dawn and run fixed Nairobi routes, so a hotel on Waiyaki Way and a family in Kilimani receive the same harvest on the same morning. You get a delivery window and a named driver.',
    meta: 'Nairobi routes · 6 days a week',
    icon: 'truck',
    scene: 'delivery',
  },
];

/* ── Farm story gallery — one effect per card ───────────────────────────── */

export interface FarmStory {
  id: string;
  index: number;
  effect: string;
  title: string;
  body: string;
}

export const FARM_STORIES: FarmStory[] = [
  {
    id: 'field',
    index: 1,
    effect: 'EFFECT-07',
    title: 'Where it starts',
    body: 'Line-art of our Nakuru field, growth lines drawing and re-drawing as the card enters view.',
  },
  {
    id: 'wordmark',
    index: 2,
    effect: 'EFFECT-08',
    title: 'Our mark',
    body: 'The Canaan Harvest wordmark self-draws, stroke path measured at runtime and drawn once on entry.',
  },
  {
    id: 'morph',
    index: 3,
    effect: 'EFFECT-09',
    title: 'Seed to leaf',
    body: 'A shape-shifting cycle through seed, sprout and leaf, reversible when you move away.',
  },
  {
    id: 'farmer',
    index: 4,
    effect: 'EFFECT-13',
    title: 'Meet our growers',
    body: 'A farm partner character waves as you hover or focus the card.',
  },
  {
    id: 'crate',
    index: 5,
    effect: 'EFFECT-14',
    title: 'Packed with care',
    body: 'A layered crate that tilts with your pointer — pure CSS, no WebGL, and flat under reduced-motion.',
  },
  {
    id: 'collage',
    index: 6,
    effect: 'EFFECT-16',
    title: 'Soil and story',
    body: 'Farm photography cut against vector soil textures with a fine grain overlay.',
  },
  {
    id: 'blob',
    index: 7,
    effect: 'EFFECT-17',
    title: 'Goodness, gathered',
    body: 'A gooey liquid blob transition on hover, using a bounded SVG filter — the same filter that spills across our 404 page.',
  },
  {
    id: 'isometric',
    index: 8,
    effect: 'EFFECT-19',
    title: 'The whole farm',
    body: 'An isometric farm scene assembling as you scroll: farmhouse, fields and irrigation channels on true 120° axes.',
  },
  {
    id: 'doodle',
    index: 9,
    effect: 'EFFECT-21',
    title: 'Sun, rain, growth',
    body: 'A hand-drawn doodle of the three things every harvest needs.',
  },
  {
    id: 'stopmotion',
    index: 10,
    effect: 'EFFECT-31',
    title: 'Growing, frame by frame',
    body: 'Stop-motion frames of a seed becoming a plant, running at 10 frames per second and resting when off-screen.',
  },
];

/* ── Testimonials — East African chefs and procurement managers ─────────── */

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  business: string;
  ordered: string;
  image: string;
  alt: string;
  stars: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'wanjiru',
    quote:
      'The grading consistency is what changed things for us. We stopped over-ordering to cover for waste, because the crate that arrives is the crate we specified. Our food cost dropped inside two months.',
    name: 'Chef Alice Wanjiru',
    business: 'Procurement Lead, Kilimani Kitchen',
    ordered: 'Sukuma wiki, tomatoes, hoho — weekly',
    image: '/photos/people/testimonial-1.jpg',
    alt: 'Chef Alice Wanjiru',
    stars: 5,
  },
  {
    id: 'otieno',
    quote:
      'Leafy greens used to be our weakest line. Now they land cold and hold for three days in our walk-in. That reliability is worth more to me than a shilling off the kilo.',
    name: 'Samuel Otieno',
    business: 'Executive Chef, Westlands Grill House',
    ordered: 'Managu, dhania, basil — twice weekly',
    image: '/photos/people/testimonial-2.jpg',
    alt: 'Chef Samuel Otieno',
    stars: 5,
  },
  {
    id: 'nyambura',
    quote:
      'We buy for four hundred covers across two hotels. Canaan Harvest is the only supplier who has never once left us short before a banquet, including the December rush.',
    name: 'Grace Nyambura',
    business: 'Group Procurement, Rift Valley Hotels',
    ordered: 'Mixed vegetables, potatoes, fruit — weekly',
    image: '/photos/people/testimonial-3.jpg',
    alt: 'Grace Nyambura',
    stars: 5,
  },
  {
    id: 'kilonzo',
    quote:
      'I joined the network with four acres and no buyer. Two seasons on I have a signed off-take agreement, an input plan, and a harvest that leaves my farm graded rather than guessed at.',
    name: 'Peter Kilonzo',
    business: 'Farm Partner, Machakos Valley',
    ordered: 'Green grams, cassava — season contract',
    image: '/photos/people/testimonial-4.jpg',
    alt: 'Peter Kilonzo',
    stars: 5,
  },
  {
    id: 'amina',
    quote:
      'For export you need traceability or you do not ship. Every tray we send carries the farm and the harvest date. Our EU buyers audited us last season and passed on the first visit.',
    name: 'Amina Hassan',
    business: 'Export Manager, Coast Fresh Traders',
    ordered: 'Avocado, passion fruit — export',
    image: '/photos/people/testimonial-1.jpg',
    alt: 'Amina Hassan',
    stars: 5,
  },
  {
    id: 'mwikali',
    quote:
      'The weekly household box is well priced and the children actually eat the greens now, because they arrive fresh instead of tired. The delivery window is honest to the half hour.',
    name: 'Faith Mwikali',
    business: 'Household subscriber, Langata',
    ordered: 'Family Box — weekly',
    image: '/photos/people/testimonial-3.jpg',
    alt: 'Faith Mwikali',
    stars: 5,
  },
];

/* ── Blog manifest (MDX lives in /content/blog) ─────────────────────────── */

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readingTime: string;
  image: string;
  alt: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'seasonal-produce-guide-kenya',
    title: 'What is actually in season in Kenya right now',
    category: 'Seasonal guide',
    excerpt:
      'Buying with the season is cheaper, tastier and better for the soil. Here is what the Kenyan calendar is giving you month by month.',
    date: '2026-09-18',
    readingTime: '7 min read',
    image: '/photos/blog/blog-1.jpg',
    alt: 'A vendor selling fresh produce at an outdoor market stall',
  },
  {
    slug: 'cold-chain-that-works',
    title: 'The cold chain that actually works on a Kenyan farm',
    category: 'Farming practice',
    excerpt:
      'Three-quarters of the quality loss in leafy greens happens in the two hours after harvest. This is how we close that window.',
    date: '2026-09-04',
    readingTime: '6 min read',
    image: '/photos/blog/blog-2.jpg',
    alt: 'A market vendor carrying fresh vegetables in a bucket',
  },
  {
    slug: 'managu-recipes',
    title: 'Cooking indigenous greens: managu, terere and saga',
    category: 'Nutrition and recipes',
    excerpt:
      'Indigenous greens are nutritionally dense and deeply Kenyan. Four recipes that treat them with the respect they deserve.',
    date: '2026-08-22',
    readingTime: '9 min read',
    image: '/photos/blog/blog-3.jpg',
    alt: 'A woman cooking over a large pot outdoors',
  },
  {
    slug: 'contract-farming-explained',
    title: 'What an off-take agreement actually commits you to',
    category: 'Farming practice',
    excerpt:
      'Contract farming gets sold as a safety net. Read the terms carefully and it is one — read them badly and it is a trap. A plain-language walk-through.',
    date: '2026-08-08',
    readingTime: '8 min read',
    image: '/photos/blog/blog-4.jpg',
    alt: 'A farmer inspecting young crops in a field',
  },
  {
    slug: 'water-smart-irrigation',
    title: 'Water-smart irrigation for smallholder vegetable farms',
    category: 'Sustainability',
    excerpt:
      'Drip does not have to mean expensive. A practical breakdown of what we installed on the Machakos plots and what it returned.',
    date: '2026-07-25',
    readingTime: '7 min read',
    image: '/photos/blog/blog-5.jpg',
    alt: 'An overhead irrigation system watering a crop field',
  },
  {
    slug: 'feeding-a-nairobi-restaurant',
    title: 'What it takes to supply a Nairobi restaurant every morning',
    category: 'Supply chain',
    excerpt:
      'Forty covers, one lunch service, six hundred kilometres of road. A walk through the route a single crate takes to reach a plate.',
    date: '2026-07-11',
    readingTime: '6 min read',
    image: '/photos/blog/blog-6.jpg',
    alt: 'A chef preparing fresh ingredients in a kitchen',
  },
];

/* ── Partnership requirements and certification ─────────────────────────── */

export const PARTNERSHIP_REQUIREMENTS = [
  {
    icon: 'map-pin' as LucideIconName,
    title: 'Land and tenure',
    body: 'A minimum of one acre under cultivation, with evidence of tenure or a recognised user agreement.',
  },
  {
    icon: 'droplets' as LucideIconName,
    title: 'Assured water',
    body: 'A year-round water source — borehole, river abstraction, dam or piped supply. Rain-fed plots are considered for the long-rains window only.',
  },
  {
    icon: 'sprout' as LucideIconName,
    title: 'Crop fit',
    body: 'You must be able to grow at least two crops from our demand list, so a failed single line does not end your season.',
  },
  {
    icon: 'users' as LucideIconName,
    title: 'Traceability record',
    body: 'A willingness to keep planted, sprayed and harvested records. We supply the book and train you on it.',
  },
];

export const CERTIFICATION_STEPS = [
  { step: '01', title: 'Farm assessment', body: 'A field officer visits, maps your plots and records your water source and access road.' },
  { step: '02', title: 'Input and agronomy plan', body: 'A crop plan is agreed against confirmed demand — no crop is planted before a buyer line exists.' },
  { step: '03', title: 'Good agricultural practice sign-off', body: 'We train on safe spraying, harvest hygiene and post-harvest handling, then audit against it.' },
  { step: '04', title: 'Off-take agreement', body: 'A signed agreement fixes volume, grade standard, price mechanism and payment terms.' },
  { step: '05', title: 'Ongoing grading and audit', body: 'Quarterly grading reviews and an annual re-audit keep the certification live.' },
];
