/**
 * Lucide icon registry — 0.468.0 only.
 *
 * Brief mapping:
 *   leaf         → produce          sun        → freshness
 *   droplets     → irrigation       package    → orders
 *   truck        → delivery         users      → farmers
 *   calendar     → schedule         star       → quality rating
 *   map-pin      → farms            check-circle → certifications
 *
 * Prohibited and deliberately absent: decorative stars used as dividers,
 * diamonds, and sparkle/sparkles glyphs.
 */

import {
  Leaf, Sun, Droplets, Package, Truck, Users, Calendar, Star, MapPin,
  CheckCircle2, Home, Phone, Apple, Sprout, Wheat, Egg, Carrot, Menu, X,
  ChevronLeft, ChevronRight, ChevronDown, Send, AlertCircle, Loader2, Lock,
  ArrowRight, ArrowUp, Trash2, Plus, ExternalLink, Mail, MessageCircle,
  Check, Tractor, Instagram, Facebook, Linkedin, Twitter, Play, Thermometer,
  TrendingUp, Info, FileText, ShieldCheck, Clock, Upload, Camera, Compass,
  Snowflake, type LucideIcon,
} from 'lucide-react';

export const ICONS = {
  leaf: Leaf,
  sun: Sun,
  droplets: Droplets,
  package: Package,
  truck: Truck,
  users: Users,
  calendar: Calendar,
  star: Star,
  'map-pin': MapPin,
  'check-circle': CheckCircle2,
  home: Home,
  phone: Phone,
  apple: Apple,
  sprout: Sprout,
  wheat: Wheat,
  egg: Egg,
  carrot: Carrot,
  menu: Menu,
  x: X,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  send: Send,
  'alert-circle': AlertCircle,
  loader: Loader2,
  lock: Lock,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  trash: Trash2,
  plus: Plus,
  external: ExternalLink,
  mail: Mail,
  message: MessageCircle,
  check: Check,
  tractor: Tractor,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  play: Play,
  thermometer: Thermometer,
  'trending-up': TrendingUp,
  info: Info,
  'file-text': FileText,
  shield: ShieldCheck,
  clock: Clock,
  upload: Upload,
  camera: Camera,
  compass: Compass,
  snowflake: Snowflake,
} as const satisfies Record<string, LucideIcon>;

export type LucideIconName = keyof typeof ICONS;

interface IconProps {
  name: LucideIconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  'aria-hidden'?: boolean;
}

/**
 * Renders a Lucide icon. Icons are decorative by default (aria-hidden) —
 * the surrounding control carries the accessible name.
 */
export function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.9,
  ...rest
}: IconProps) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  );
}
