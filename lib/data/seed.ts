import type {
  AddOn, Category, Customer, DeliveryZone, Occasion, Order, Product, PromoCode, Review, SiteContent,
} from "@/lib/types";
import { addDaysISO } from "@/lib/utils";

/**
 * Seed data for the mock backend. Everything the demo shows comes from here on first load,
 * after which the browser-persisted mock DB (lib/data/db.ts) takes over.
 */

// A small pool of royalty-free Unsplash photos. If any link is ever unavailable the UI
// falls back to a styled placeholder (components/site/product-image.tsx), so the demo never breaks.
const U = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;
export const IMG = [
  U("photo-1490750967868-88aa4486c946"), // 0 pink blooms
  U("photo-1487530811176-3780de880c2d"), // 1 rose
  U("photo-1526047932273-341f2a7631f9"), // 2 roses bunch
  U("photo-1494336956603-39a6dd9ac33d"), // 3 bouquet in hand
  U("photo-1508610048659-a06b669e3321"), // 4 peonies
  U("photo-1563241527-3004b7be0ffd"),    // 5 wrapped bouquet
  U("photo-1457089328109-e5d9bd499191"), // 6 tulips
  U("photo-1520763185298-1b434c919102"), // 7 pastel arrangement
  U("photo-1469259943454-aa100abba749"), // 8 orchid
  U("photo-1494972308805-463bc619d34e"), // 9 peony close
  U("photo-1518895949257-7621c3c786d7"), // 10 sunflowers
  U("photo-1471696035578-3d8c78d99684"), // 11 lilies
  U("photo-1462530260150-162092dbf011"), // 12 wildflowers
  U("photo-1533616688419-b7a585564566"), // 13 kraft-wrapped bouquet
  U("photo-1561181286-d3fee7d55364"),    // 14 white roses
  U("photo-1416879595882-3373a0480b5b"), // 15 potted plant
  U("photo-1485955900006-10f4d324d411"), // 16 plant in pot
  U("photo-1454262041357-5d96f50a2f27"), // 17 soft blooms
];

export const seedCategories: Category[] = [
  { id: "c-roses", name: "Roses", slug: "roses", image: IMG[1] },
  { id: "c-lilies", name: "Lilies", slug: "lilies", image: IMG[11] },
  { id: "c-tulips", name: "Tulips", slug: "tulips", image: IMG[6] },
  { id: "c-orchids", name: "Orchids", slug: "orchids", image: IMG[8] },
  { id: "c-mixed", name: "Mixed Bouquets", slug: "mixed-bouquets", image: IMG[3] },
  { id: "c-box", name: "Flower Boxes", slug: "flower-boxes", image: IMG[7] },
  { id: "c-vase", name: "Vase Arrangements", slug: "vase-arrangements", image: IMG[14] },
  { id: "c-plants", name: "Plants", slug: "plants", image: IMG[15] },
];

export const seedOccasions: Occasion[] = [
  { id: "o-birthday", name: "Birthday", slug: "birthday", emoji: "🎂" },
  { id: "o-anniversary", name: "Anniversary", slug: "anniversary", emoji: "💍" },
  { id: "o-love", name: "Love & Romance", slug: "love-romance", emoji: "❤️" },
  { id: "o-congrats", name: "Congratulations", slug: "congratulations", emoji: "🎉" },
  { id: "o-baby", name: "New Baby", slug: "new-baby", emoji: "🍼" },
  { id: "o-getwell", name: "Get Well Soon", slug: "get-well-soon", emoji: "🌿" },
  { id: "o-sympathy", name: "Sympathy & Funeral", slug: "sympathy", emoji: "🕊️" },
  { id: "o-grad", name: "Graduation", slug: "graduation", emoji: "🎓" },
  { id: "o-thanks", name: "Thank You", slug: "thank-you", emoji: "🌷" },
];

export const seedAddOns: AddOn[] = [
  { id: "a-cake", name: "Mini celebration cake", price: 95, emoji: "🍰" },
  { id: "a-choc", name: "Belgian chocolates box", price: 75, emoji: "🍫" },
  { id: "a-balloons", name: "Balloon trio", price: 45, emoji: "🎈" },
  { id: "a-card", name: "Premium greeting card", price: 20, emoji: "💌" },
  { id: "a-teddy", name: "Teddy bear", price: 65, emoji: "🧸" },
  { id: "a-vase", name: "Glass vase upgrade", price: 55, emoji: "🏺" },
];

export const seedZones: DeliveryZone[] = [
  {
    id: "z-dubai", emirate: "Dubai", fee: 20, freeOver: 300,
    areas: ["Downtown", "Marina", "JLT", "Business Bay", "Jumeirah", "Deira", "Al Barsha", "Mirdif"],
    slots: ["Morning (9am - 12pm)", "Afternoon (12pm - 5pm)", "Evening (5pm - 9pm)", "Express (within 1 hour)"],
  },
  {
    id: "z-ad", emirate: "Abu Dhabi", fee: 35,
    areas: ["Corniche", "Al Reem Island", "Khalifa City", "Yas Island", "Al Ain"],
    slots: ["Morning (9am - 12pm)", "Afternoon (12pm - 5pm)", "Evening (5pm - 9pm)"],
  },
  {
    id: "z-shj", emirate: "Sharjah", fee: 25,
    areas: ["Al Majaz", "Al Nahda", "Muwaileh", "Al Khan"],
    slots: ["Morning (9am - 12pm)", "Afternoon (12pm - 5pm)", "Evening (5pm - 9pm)"],
  },
  {
    id: "z-ajm", emirate: "Ajman", fee: 30,
    areas: ["Al Nuaimiya", "Corniche", "Al Rashidiya"],
    slots: ["Afternoon (12pm - 5pm)", "Evening (5pm - 9pm)"],
  },
  {
    id: "z-rak", emirate: "Ras Al Khaimah", fee: 40,
    areas: ["Al Nakheel", "Mina Al Arab", "Al Hamra"],
    slots: ["Afternoon (12pm - 5pm)", "Evening (5pm - 9pm)"],
  },
];

export const seedPromos: PromoCode[] = [
  { id: "pr-1", code: "WELCOME10", type: "percent", value: 10, minOrder: 0, expiresAt: addDaysISO(180), usageLimit: 500, usedCount: 118, active: true },
  { id: "pr-2", code: "LOVE50", type: "fixed", value: 50, minOrder: 300, expiresAt: addDaysISO(60), usageLimit: 200, usedCount: 41, active: true },
  { id: "pr-3", code: "RAMADAN15", type: "percent", value: 15, minOrder: 200, expiresAt: addDaysISO(-10), usageLimit: 300, usedCount: 300, active: false },
];

// --- Products -------------------------------------------------------------

type P = Partial<Product> & { name: string; basePrice: number; categoryId: string; img: number[] };
let pi = 0;
const mk = (p: P): Product => {
  pi += 1;
  const slug = p.slug ?? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return {
    id: `p${pi}`,
    slug,
    name: p.name,
    description:
      p.description ??
      `${p.name} is arranged by hand in our Dubai studio the same morning it ships. Stems are conditioned overnight, wrapped in signature paper and delivered chilled so they arrive looking exactly as pictured.`,
    careTips:
      p.careTips ??
      "Trim stems at an angle, use cool water and refresh every two days. Keep away from direct sun and AC vents for the longest vase life.",
    basePrice: p.basePrice,
    sizePricing: p.sizePricing ?? {
      Standard: p.basePrice,
      Deluxe: Math.round(p.basePrice * 1.35),
      Premium: Math.round(p.basePrice * 1.75),
    },
    categoryId: p.categoryId,
    occasionIds: p.occasionIds ?? ["o-birthday", "o-thanks"],
    colors: p.colors ?? ["Pink"],
    images: p.img.map((i) => IMG[i % IMG.length]),
    stock: p.stock ?? 18,
    active: p.active ?? true,
    bestSeller: p.bestSeller ?? false,
    createdAt: addDaysISO(-(60 - pi * 1.5)),
  };
};

export const seedProducts: Product[] = [
  mk({ name: "Rouge Amour", basePrice: 349, categoryId: "c-roses", img: [1, 2], colors: ["Red"], occasionIds: ["o-love", "o-anniversary"], bestSeller: true, description: "Two dozen premium red roses hand-tied with eucalyptus and wrapped in our signature wine paper. The classic, done properly." }),
  mk({ name: "Desert Blush", basePrice: 289, categoryId: "c-roses", img: [0, 17], colors: ["Pink"], occasionIds: ["o-love", "o-birthday"], bestSeller: true }),
  mk({ name: "Pearl of Jumeirah", basePrice: 319, categoryId: "c-roses", img: [14, 1], colors: ["White"], occasionIds: ["o-sympathy", "o-anniversary"] }),
  mk({ name: "Golden Hour Roses", basePrice: 269, categoryId: "c-roses", img: [2, 5], colors: ["Yellow"], occasionIds: ["o-thanks", "o-congrats"] }),
  mk({ name: "Marina Sunset", basePrice: 239, categoryId: "c-roses", img: [5, 0], colors: ["Orange", "Pink"], occasionIds: ["o-birthday", "o-congrats"] }),
  mk({ name: "Lily Noor", basePrice: 259, categoryId: "c-lilies", img: [11, 14], colors: ["White"], occasionIds: ["o-sympathy", "o-getwell"], bestSeller: true }),
  mk({ name: "Casablanca Dream", basePrice: 329, categoryId: "c-lilies", img: [11, 17], colors: ["White", "Pink"], occasionIds: ["o-anniversary", "o-congrats"] }),
  mk({ name: "Stargazer Sky", basePrice: 279, categoryId: "c-lilies", img: [17, 11], colors: ["Pink"], occasionIds: ["o-birthday", "o-getwell"] }),
  mk({ name: "Tulipe d'Amsterdam", basePrice: 219, categoryId: "c-tulips", img: [6, 0], colors: ["Mixed"], occasionIds: ["o-birthday", "o-thanks"], bestSeller: true }),
  mk({ name: "Blush Tulip Twenty", basePrice: 249, categoryId: "c-tulips", img: [0, 6], colors: ["Pink"], occasionIds: ["o-love", "o-baby"] }),
  mk({ name: "Sunrise Tulips", basePrice: 199, categoryId: "c-tulips", img: [6, 12], colors: ["Yellow", "Orange"], occasionIds: ["o-getwell", "o-congrats"] }),
  mk({ name: "Royal Purple Orchid", basePrice: 389, categoryId: "c-orchids", img: [8, 15], colors: ["Purple"], occasionIds: ["o-congrats", "o-thanks"], bestSeller: true, description: "A double-stem Phalaenopsis in a ceramic pot. Lasts for months and reads instantly premium in any majlis, office or lobby." }),
  mk({ name: "White Orchid Duo", basePrice: 429, categoryId: "c-orchids", img: [8, 14], colors: ["White"], occasionIds: ["o-sympathy", "o-congrats"] }),
  mk({ name: "Mini Orchid Gift", basePrice: 179, categoryId: "c-orchids", img: [8, 16], colors: ["Pink"], occasionIds: ["o-thanks", "o-getwell"] }),
  mk({ name: "Jardin de Dubai", basePrice: 299, categoryId: "c-mixed", img: [3, 12], colors: ["Mixed"], occasionIds: ["o-birthday", "o-congrats"], bestSeller: true }),
  mk({ name: "Pastel Poème", basePrice: 269, categoryId: "c-mixed", img: [7, 3], colors: ["Pastel"], occasionIds: ["o-baby", "o-thanks"] }),
  mk({ name: "Wild Meadow", basePrice: 229, categoryId: "c-mixed", img: [12, 13], colors: ["Mixed"], occasionIds: ["o-birthday", "o-getwell"] }),
  mk({ name: "Peony Season", basePrice: 449, categoryId: "c-mixed", img: [4, 9], colors: ["Pink"], occasionIds: ["o-love", "o-anniversary"], bestSeller: true, description: "Full-headed imported peonies, available while the season lasts. The bouquet people photograph before they unwrap." }),
  mk({ name: "Sunflower Smile", basePrice: 189, categoryId: "c-mixed", img: [10, 12], colors: ["Yellow"], occasionIds: ["o-getwell", "o-congrats"] }),
  mk({ name: "Kraft & Garden", basePrice: 209, categoryId: "c-mixed", img: [13, 5], colors: ["Mixed"], occasionIds: ["o-thanks", "o-birthday"] }),
  mk({ name: "Velvet Box Rouge", basePrice: 399, categoryId: "c-box", img: [7, 1], colors: ["Red"], occasionIds: ["o-love", "o-anniversary"], bestSeller: true, description: "Fifty rose heads set flush in a round velvet hat box. Zero maintenance, maximum drama, ideal for hotel and office deliveries." }),
  mk({ name: "Blush Hat Box", basePrice: 359, categoryId: "c-box", img: [7, 0], colors: ["Pink"], occasionIds: ["o-birthday", "o-baby"] }),
  mk({ name: "Ivory Letter Box", basePrice: 329, categoryId: "c-box", img: [14, 7], colors: ["White"], occasionIds: ["o-congrats", "o-sympathy"] }),
  mk({ name: "Petite Bloom Box", basePrice: 149, categoryId: "c-box", img: [17, 7], colors: ["Pastel"], occasionIds: ["o-thanks", "o-getwell"] }),
  mk({ name: "Crystal Garden Vase", basePrice: 379, categoryId: "c-vase", img: [14, 3], colors: ["White", "Green"], occasionIds: ["o-congrats", "o-sympathy"] }),
  mk({ name: "Amber Evening", basePrice: 339, categoryId: "c-vase", img: [5, 17], colors: ["Orange"], occasionIds: ["o-anniversary", "o-thanks"] }),
  mk({ name: "Rose & Eucalyptus Vase", basePrice: 309, categoryId: "c-vase", img: [1, 14], colors: ["Pink", "Green"], occasionIds: ["o-love", "o-birthday"] }),
  mk({ name: "Grand Majlis Arrangement", basePrice: 899, categoryId: "c-vase", img: [3, 4], colors: ["Mixed"], occasionIds: ["o-congrats", "o-anniversary"], description: "A statement centrepiece built on a footed vase for majlis gatherings, launches and hotel lobbies. Our florists deliver and style it in place.", stock: 5 }),
  mk({ name: "Monstera Deliciosa", basePrice: 189, categoryId: "c-plants", img: [15, 16], colors: ["Green"], occasionIds: ["o-congrats", "o-thanks"] }),
  mk({ name: "Peace Lily Pot", basePrice: 159, categoryId: "c-plants", img: [16, 15], colors: ["Green", "White"], occasionIds: ["o-getwell", "o-sympathy"] }),
  mk({ name: "Desert Rose Bonsai", basePrice: 249, categoryId: "c-plants", img: [15, 8], colors: ["Pink", "Green"], occasionIds: ["o-congrats", "o-birthday"], stock: 7 }),
  mk({ name: "Office Trio Planters", basePrice: 299, categoryId: "c-plants", img: [16, 15], colors: ["Green"], occasionIds: ["o-congrats", "o-thanks"] }),
  mk({ name: "Baby's First Bloom", basePrice: 279, categoryId: "c-mixed", img: [0, 7], colors: ["Pastel"], occasionIds: ["o-baby"], description: "Soft pastel blooms with a keepsake card for welcoming the newest family member. Add the teddy bear for the full nursery moment." }),
  mk({ name: "Graduation Grande", basePrice: 259, categoryId: "c-mixed", img: [10, 3], colors: ["Yellow", "Mixed"], occasionIds: ["o-grad", "o-congrats"] }),
  mk({ name: "Eid Gathering Basket", basePrice: 499, categoryId: "c-vase", img: [4, 13], colors: ["Mixed"], occasionIds: ["o-thanks", "o-congrats"], stock: 9 }),
];

export const seedReviews: Review[] = [
  { id: "r1", author: "Mariam A.", rating: 5, text: "Ordered at 11am for a 2pm anniversary surprise in Marina. Arrived at 1:20, looked better than the photos.", date: addDaysISO(-4) },
  { id: "r2", author: "James W.", rating: 5, text: "The Velvet Box Rouge made me look very good at a client's office. Will absolutely reorder.", date: addDaysISO(-9) },
  { id: "r3", author: "Fatima K.", rating: 5, text: "Peonies were fresh and full. The gift message card was beautifully written in Arabic as requested.", date: addDaysISO(-13) },
  { id: "r4", author: "Daniel R.", rating: 4, text: "Slightly late in Sharjah traffic but the driver kept me updated on WhatsApp. Flowers were perfect.", date: addDaysISO(-17) },
  { id: "r5", author: "Aisha M.", rating: 5, text: "My mother cried. The Casablanca lilies smelled incredible for over a week.", date: addDaysISO(-21) },
  { id: "r6", author: "Elena P.", rating: 5, text: "Express delivery actually means express here. 47 minutes door to door in Downtown.", date: addDaysISO(-26) },
  { id: "r7", author: "Omar H.", rating: 4, text: "Great orchid quality. Would love more vase options at checkout, but the upgrade add-on worked.", date: addDaysISO(-33) },
  { id: "r8", author: "Priya S.", rating: 5, text: "Used them three times for office milestones. Consistent, elegant, and invoicing was easy.", date: addDaysISO(-40) },
];

export const seedCustomers: Customer[] = [
  {
    id: "cu1", name: "Amira Hassan", email: "amira@example.com", password: "demo123", phone: "+971 50 111 2233",
    loyaltyPoints: 214, createdAt: addDaysISO(-140),
    addresses: [
      { id: "ad1", label: "Home", recipientName: "Amira Hassan", phone: "+971 50 111 2233", emirate: "Dubai", area: "Jumeirah", building: "Villa 14, Street 8b", notes: "Gate on the left" },
      { id: "ad2", label: "Office", recipientName: "Amira Hassan", phone: "+971 50 111 2233", emirate: "Dubai", area: "Business Bay", building: "Bay Square, Building 7, Floor 3" },
    ],
  },
  {
    id: "cu2", name: "Khalid Rahman", email: "khalid@example.com", password: "demo123", phone: "+971 55 444 8899",
    loyaltyPoints: 96, createdAt: addDaysISO(-90),
    addresses: [{ id: "ad3", label: "Home", recipientName: "Khalid Rahman", phone: "+971 55 444 8899", emirate: "Sharjah", area: "Al Majaz", building: "Majaz Tower 2, Apt 1104" }],
  },
  {
    id: "cu3", name: "Sofia Marchetti", email: "sofia@example.com", password: "demo123", phone: "+971 52 777 3311",
    loyaltyPoints: 58, createdAt: addDaysISO(-45),
    addresses: [{ id: "ad4", label: "Home", recipientName: "Sofia Marchetti", phone: "+971 52 777 3311", emirate: "Abu Dhabi", area: "Al Reem Island", building: "Sun Tower, Apt 2208" }],
  },
];

const oi = (productId: string, name: string, size: "Standard" | "Deluxe" | "Premium", qty: number, unitPrice: number, addOns: { name: string; price: number }[] = [], giftMessage?: string) =>
  ({ productId, productName: name, size, qty, unitPrice, addOns, giftMessage });

const mkOrder = (
  id: string, days: number, cust: Customer, items: ReturnType<typeof oi>[],
  status: Order["status"], emirate: string, area: string, fee: number, slot: Order["slot"],
  pay: Order["paymentMethod"], promo?: { code: string; discount: number },
): Order => {
  const subtotal = items.reduce((s, it) => s + it.qty * (it.unitPrice + it.addOns.reduce((a, x) => a + x.price, 0)), 0);
  const discount = promo?.discount ?? 0;
  const total = subtotal + fee - discount;
  return {
    id, customerEmail: cust.email, customerName: cust.name, phone: cust.phone,
    items, subtotal, deliveryFee: fee, discount, total, promoCode: promo?.code,
    paymentMethod: pay, status, emirate, area,
    building: cust.addresses[0]?.building ?? "—", addressNotes: cust.addresses[0]?.notes,
    deliveryDate: addDaysISO(-days + 1), slot, placedAt: new Date(Date.now() - days * 864e5).toISOString(),
    pointsEarned: Math.floor(total / 10),
  };
};

export const seedOrders: Order[] = [
  mkOrder("FL-2026-1041", 0, seedCustomers[0], [oi("p21", "Velvet Box Rouge", "Deluxe", 1, 539, [{ name: "Premium greeting card", price: 20 }], "Happy anniversary, habibti ❤️")], "Placed", "Dubai", "Business Bay", 0, "Express (within 1 hour)", "Apple Pay"),
  mkOrder("FL-2026-1038", 0, seedCustomers[2], [oi("p9", "Tulipe d'Amsterdam", "Standard", 2, 219)], "Preparing", "Abu Dhabi", "Al Reem Island", 35, "Evening (5pm - 9pm)", "Card"),
  mkOrder("FL-2026-1036", 1, seedCustomers[1], [oi("p6", "Lily Noor", "Deluxe", 1, 350, [{ name: "Glass vase upgrade", price: 55 }])], "Out for Delivery", "Sharjah", "Al Majaz", 25, "Afternoon (12pm - 5pm)", "Tabby"),
  mkOrder("FL-2026-1031", 2, seedCustomers[0], [oi("p18", "Peony Season", "Premium", 1, 786, [], "Just because.")], "Delivered", "Dubai", "Jumeirah", 0, "Morning (9am - 12pm)", "Card", { code: "LOVE50", discount: 50 }),
  mkOrder("FL-2026-1027", 4, seedCustomers[1], [oi("p12", "Royal Purple Orchid", "Standard", 1, 389)], "Delivered", "Sharjah", "Al Nahda", 25, "Evening (5pm - 9pm)", "Google Pay"),
  mkOrder("FL-2026-1022", 6, seedCustomers[2], [oi("p15", "Jardin de Dubai", "Standard", 1, 299, [{ name: "Belgian chocolates box", price: 75 }])], "Delivered", "Abu Dhabi", "Corniche", 35, "Afternoon (12pm - 5pm)", "Card", { code: "WELCOME10", discount: 37 }),
  mkOrder("FL-2026-1018", 8, seedCustomers[0], [oi("p2", "Desert Blush", "Standard", 1, 289), oi("p24", "Petite Bloom Box", "Standard", 1, 149)], "Delivered", "Dubai", "Marina", 0, "Evening (5pm - 9pm)", "Tamara"),
  mkOrder("FL-2026-1012", 11, seedCustomers[1], [oi("p33", "Graduation Grande", "Deluxe", 1, 350, [{ name: "Balloon trio", price: 45 }], "So proud of you, Dr. Rahman!")], "Delivered", "Ajman", "Corniche", 30, "Evening (5pm - 9pm)", "Card"),
  mkOrder("FL-2026-1007", 14, seedCustomers[2], [oi("p29", "Monstera Deliciosa", "Standard", 2, 189)], "Delivered", "Abu Dhabi", "Khalifa City", 35, "Morning (9am - 12pm)", "Apple Pay"),
];

export const seedContent: SiteContent = {
  heroTitle: "Flowers that arrive",
  heroAccent: "blooming",
  heroSubtitle: "Hand-tied in our Dubai studio every morning. Same-day across the city, one-hour express when it really can't wait.",
  heroImage: IMG[3],
  announcement: "Same-day delivery across Dubai · Order by 6pm",
  featuredProductIds: ["p1", "p18", "p21", "p12", "p9", "p15", "p6", "p22"],
};
