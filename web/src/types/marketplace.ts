/**
 * ==============================================================================
 * MagnopVS - MARKETPLACE DOMAIN TYPES & ARCHITECTURE
 * ==============================================================================
 * Multi-vendor commercial platform models combining retail, digital assets,
 * academies, saga-specific stores, gamification, and wallet economics.
 * ==============================================================================
 */

export type ProductFormat = 'PHYSICAL' | 'DIGITAL' | 'COURSE' | 'SERVICE' | 'SUBSCRIPTION';

export type CommercialCategory =
  | 'tecnologia_dispositivos'
  | 'moda_accesorios'
  | 'arte_artesania'
  | 'hogar_decoracion'
  | 'libros_publicaciones'
  | 'educacion_conocimiento'
  | 'cursos_academias'
  | 'software_herramientas'
  | 'videojuegos_interactivos'
  | 'musica_audiovisual'
  | 'coleccionables'
  | 'productos_creadores'
  | 'servicios_profesionales'
  | 'membresias_suscripciones'
  | 'exclusivos_magnopvs'
  | 'sagas_multiverso';

export type SagaId =
  | 'butsu_no_baka'
  | 'senor_platano'
  | 'apocalipsis'
  | 'eleusis_path'
  | 'golden_apple'
  | 'philosophers_crucible'
  | 'city_of_sea'
  | 'umbrarum'
  | 'white_brotherhood'
  | 'masters_path'
  | 'lords_of_sumer'
  | 'the_falling'
  | 'abyss_fall'
  | (string & {});

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceModifierMp: number;
  priceModifierMicroCoins: number;
  priceModifierFiat: number;
  stock: number;
  attributeValues: Record<string, string>; // e.g. { Color: 'Quantum Cyan', Talla: 'L' }
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
  likes: number;
}

export interface ProductQA {
  id: string;
  productId: string;
  question: string;
  askedBy: string;
  askedAt: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  richDetails?: string[];
  images: string[];
  category: CommercialCategory;
  subcategory: string;
  tags: string[];
  priceMp: number;
  priceMicroCoins: number;
  priceFiatUsd: number;
  previousPriceMp?: number;
  previousPriceFiatUsd?: number;
  discountPercent?: number;
  format: ProductFormat;
  stock: number;
  variants?: ProductVariant[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  isOfficialMagnopvs: boolean;
  sagaId?: SagaId;
  rating: number; // 1.0 to 5.0
  reviewCount: number;
  salesCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewRelease?: boolean;
  createdAt: string;
  status: 'PUBLISHED' | 'DRAFT' | 'UNDER_REVIEW' | 'ARCHIVED';
  
  // Digital / Academy specific
  digitalFileUrl?: string;
  fileSizeBytes?: number;
  fileFormat?: string;
  version?: string;
  licenseType?: 'PERSONAL' | 'COMMERCIAL' | 'OPEN_QUANTVM';
  courseId?: string;
  
  // Shipping & Policies
  shippingDays?: number;
  freeShipping?: boolean;
  returnPolicyDays: number;
}

export interface SellerProfile {
  id: string;
  storeName: string;
  tagline: string;
  bio: string;
  logoUrl: string;
  bannerUrl: string;
  ownerId: string;
  ownerName: string;
  sellerType: 'INDEPENDENT' | 'ARTIST' | 'CREATOR' | 'INSTRUCTOR' | 'DEVELOPER' | 'OFFICIAL_SAGA' | 'BRAND';
  isVerified: boolean;
  rating: number;
  totalSales: number;
  followersCount: number;
  joinedAt: string;
  balanceMp: number;
  balanceMicroCoins: number;
  balanceFiatUsd: number;
  commissionRate: number; // e.g. 0.10 for 10%
  socialLinks?: {
    website?: string;
    discord?: string;
    x?: string;
  };
}

export interface CartItem {
  id: string;
  product: MarketplaceProduct;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedCurrency: 'MP' | 'MICROCOIN' | 'FIAT';
  addedAt: string;
}

export type OrderStatus = 'PENDING_PAYMENT' | 'PROCESSING' | 'COMPLETED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  format: ProductFormat;
  quantity: number;
  selectedVariant?: ProductVariant;
  unitPriceMp: number;
  unitPriceMicroCoins: number;
  unitPriceFiat: number;
  sellerId: string;
  digitalDownloadUrl?: string;
  licenseKey?: string;
}

export interface MarketplaceOrder {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  currencyUsed: 'MP' | 'MICROCOIN' | 'FIAT';
  totalMp: number;
  totalMicroCoins: number;
  totalFiatUsd: number;
  discountAppliedMp: number;
  discountAppliedFiat: number;
  couponCode?: string;
  status: OrderStatus;
  shippingAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  trackingCode?: string;
  createdAt: string;
  completedAt?: string;
  transactionAuditId: string;
}

export interface MarketplaceCoupon {
  code: string;
  discountPercent: number;
  maxDiscountMp?: number;
  minSpendMp?: number;
  category?: CommercialCategory;
  validUntil: string;
  description: string;
}

// Academy Specific
export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl: string;
  isFreePreview: boolean;
  resources?: { name: string; url: string }[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface AcademyCourse {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  level: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO' | 'MAESTRO_QUANTVM';
  totalDurationMinutes: number;
  modules: CourseModule[];
  certificateAvailable: boolean;
  learningOutcomes: string[];
  prerequisites: string[];
}

export interface StudentProgress {
  courseId: string;
  completedLessonIds: string[];
  percentCompleted: number;
  certificateIssued: boolean;
  certificateId?: string;
  enrolledAt: string;
  lastAccessedAt: string;
}

// Saga Store metadata
export interface SagaStoreInfo {
  id: SagaId;
  name: string;
  genre: string;
  themeColor: string;
  secondaryColor: string;
  bannerUrl: string;
  logoUrl: string;
  tagline: string;
  description: string;
  featuredQuote: string;
}

// Commercial Gamification
export interface CommercialMission {
  id: string;
  title: string;
  description: string;
  requirementCount: number;
  currentCount: number;
  rewardMp: number;
  rewardXp: number;
  rewardBadge?: string;
  isCompleted: boolean;
  isClaimed: boolean;
  category: 'PURCHASE' | 'REVIEW' | 'EXPLORE' | 'ACADEMY';
}

export interface BuyerBadge {
  id: string;
  name: string;
  iconName: string;
  description: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'QUANTVM';
  unlockedAt?: string;
}

export type MarketplaceNavTab =
  | 'home'
  | 'discovery'
  | 'categories'
  | 'digital'
  | 'academy'
  | 'sagas'
  | 'codices'
  | 'crafts'
  | 'fashion'
  | 'deals'
  | 'seller_studio'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'downloads'
  | 'my_courses'
  | 'admin';
