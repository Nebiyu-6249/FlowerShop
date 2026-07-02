/**
 * All domain models for the demo live here, as required by the brief.
 * These are the exact shapes a future Prisma schema should mirror.
 */

export type Size = "Standard" | "Deluxe" | "Premium";
export type OrderStatus = "Placed" | "Preparing" | "Out for Delivery" | "Delivered";
export type Slot = "Morning (9am - 12pm)" | "Afternoon (12pm - 5pm)" | "Evening (5pm - 9pm)" | "Express (within 1 hour)";
export type PaymentMethod = "Card" | "Apple Pay" | "Google Pay" | "Tabby" | "Tamara";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Occasion {
  id: string;
  name: string;
  slug: string;
  emoji: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number; // AED
  emoji: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  text: string;
  date: string; // ISO
  productId?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  careTips: string;
  basePrice: number; // AED, Standard size
  sizePricing: Record<Size, number>; // absolute price per size
  categoryId: string;
  occasionIds: string[];
  colors: string[]; // for filtering
  images: string[];
  stock: number;
  active: boolean;
  bestSeller?: boolean;
  createdAt: string; // ISO, used by "newest" sort
}

export interface CartItem {
  id: string; // line id
  productId: string;
  size: Size;
  qty: number;
  addOnIds: string[];
  giftMessage?: string;
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  emirate: string;
  area: string;
  building: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  password: string; // mock only - replace with hashed credentials + real auth later
  phone: string;
  addresses: Address[];
  loyaltyPoints: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  size: Size;
  qty: number;
  unitPrice: number;
  addOns: { name: string; price: number }[];
  giftMessage?: string;
}

export interface Order {
  id: string; // order number e.g. FL-2026-0412
  customerEmail: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  promoCode?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  emirate: string;
  area: string;
  building: string;
  addressNotes?: string;
  deliveryDate: string; // ISO date
  slot: Slot;
  placedAt: string; // ISO datetime
  pointsEarned: number;
}

export interface PromoCode {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  expiresAt: string; // ISO date
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface DeliveryZone {
  id: string;
  emirate: string;
  areas: string[];
  fee: number; // AED
  freeOver?: number; // free delivery threshold
  slots: Slot[];
}

export interface SiteContent {
  heroTitle: string;
  heroAccent: string; // the italic accent word in the hero
  heroSubtitle: string;
  heroImage: string;
  announcement: string;
  featuredProductIds: string[];
}
