/**
 * Site-wide configuration for Canaan Harvest Agribusiness.
 */

export const SITE = {
  name: 'Canaan Harvest Agribusiness',
  shortName: 'Canaan Harvest',
  tagline: 'Fresh From Kenyan Farms to Your Kitchen.',
  description:
    'Certified fresh produce from Kenyan farms. Farm-to-table supply for supermarkets, hotels, restaurants and export buyers, plus household delivery across Nairobi.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://canaanharvest.co.ke',
  locale: 'en_KE',
  industry: 'Fresh produce · Agribusiness · Contract farming',
  address: {
    street: 'Biopa Business Park, Mombasa Road',
    locality: 'Nairobi',
    region: 'Nairobi County',
    postalCode: '00500',
    country: 'KE',
  },
  // Farms
  farms: [
    { name: 'Nakuru Highlands Farm', county: 'Nakuru', acres: 140, focus: 'Vegetables, tubers' },
    { name: 'Meru Ridge Farm', county: 'Meru', acres: 96, focus: 'Fruits, herbs' },
    { name: 'Machakos Valley Farm', county: 'Machakos', acres: 118, focus: 'Grains, legumes, poultry' },
  ],
  phone: '+254 112 272 061',
  phoneHref: 'tel:+254112272061',
  email: 'orders@canaanharvest.co.ke',
  emailHref: 'mailto:orders@canaanharvest.co.ke',
  whatsappNumber: '254112272061',
  whatsappUrl:
    'https://wa.me/254112272061?text=Hello!%20I%20would%20like%20to%20enquire%20about%20produce%20from%20Canaan%20Harvest.',
  whatsappTooltip: 'Place a produce order or become a farm partner',
  whatsappDisplay: '0112 272 061',
  social: {
    facebook: 'https://facebook.com/canaanharvestke',
    instagram: 'https://instagram.com/canaanharvestke',
    linkedin: 'https://linkedin.com/company/canaanharvestke',
    x: 'https://x.com/canaanharvestke',
  },
  openingHours: 'Mo-Sa 06:00-19:00',
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/produce', label: 'Produce', icon: 'leaf' },
  { href: '/farm-stories', label: 'Farm Stories', icon: 'tractor' },
  { href: '/order', label: 'Order', icon: 'package' },
  { href: '/partnership', label: 'Partnership', icon: 'users' },
  { href: '/contact', label: 'Contact', icon: 'phone' },
] as const;

export const FOOTER_LEGAL = [
  { href: '/legal/privacy-policy', label: 'Privacy Policy' },
  { href: '/legal/terms', label: 'Terms' },
  { href: '/legal/cookie-policy', label: 'Cookie Policy' },
  { href: '/blog', label: 'Blog & Farm News' },
] as const;

export const DELIVERY_ZONES = [
  'Nairobi CBD', 'Westlands', 'Parklands', 'Kilimani', 'Kileleshwa', 'Lavington',
  'Karen', 'Langata', 'South B', 'South C', 'Embakasi', 'Ruaka', 'Runda',
  'Muthaiga', 'Industrial Area', 'Gigiri', 'Riverside', 'Upper Hill',
  'Ngong Road', 'Thika Road', 'Kasarani', 'Donholm', 'Buruburu', 'Utawala',
] as const;
