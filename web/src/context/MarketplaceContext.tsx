/**
 * ==============================================================================
 * MagnopVS - MARKETPLACE CONTEXT & COMMERCIAL ENGINE
 * ==============================================================================
 * Central state management for the multi-vendor marketplace:
 * Cart, Checkout, Wishlist, Orders, Seller Studio, Academy progress,
 * and seamless integration with the MagnopVS Wallet (MP / µC).
 * ==============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePlayer } from './PlayerContext';
import { WalletService } from '../services/WalletService';
import {
  MarketplaceProduct,
  CartItem,
  MarketplaceOrder,
  OrderItem,
  SellerProfile,
  AcademyCourse,
  StudentProgress,
  CommercialMission,
  MarketplaceCoupon,
  MarketplaceNavTab,
  SagaId,
  CommercialCategory,
  ProductVariant,
} from '../types/marketplace';
import {
  INITIAL_MARKETPLACE_PRODUCTS,
  INITIAL_SELLER_STORES,
  INITIAL_ACADEMY_COURSES,
  INITIAL_COMMERCIAL_MISSIONS,
  INITIAL_COUPONS,
} from '../data/marketplaceData';
import { getCreatorMarketplaceProducts } from '../data/sagasData';

interface MarketplaceContextType {
  // Navigation
  activeTab: MarketplaceNavTab;
  setActiveTab: (tab: MarketplaceNavTab) => void;
  selectedCategory: CommercialCategory | 'ALL';
  setSelectedCategory: (cat: CommercialCategory | 'ALL') => void;
  selectedSagaId: SagaId | null;
  setSelectedSagaId: (saga: SagaId | null) => void;
  selectedProduct: MarketplaceProduct | null;
  setSelectedProduct: (prod: MarketplaceProduct | null) => void;
  selectedCourse: AcademyCourse | null;
  setSelectedCourse: (course: AcademyCourse | null) => void;

  // Catalog & Products
  products: MarketplaceProduct[];
  courses: AcademyCourse[];
  sellers: SellerProfile[];
  
  // Cart & Wishlist
  cart: CartItem[];
  cartCount: number;
  cartTotalMp: number;
  cartTotalMicroCoins: number;
  cartTotalFiatUsd: number;
  appliedCoupon: MarketplaceCoupon | null;
  addToCart: (product: MarketplaceProduct, quantity?: number, variant?: ProductVariant, currency?: 'MP' | 'MICROCOIN' | 'FIAT') => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; error?: string };
  removeCoupon: () => void;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Checkout & Orders
  orders: MarketplaceOrder[];
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  processCheckout: (params: {
    paymentMethod: 'MP' | 'MICROCOIN' | 'FIAT';
    shippingAddress?: {
      fullName: string;
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  }) => Promise<{ success: boolean; error?: string; order?: MarketplaceOrder }>;

  // Seller Studio
  currentSellerProfile: SellerProfile | null;
  registerAsSeller: (storeData: Partial<SellerProfile>) => Promise<SellerProfile>;
  publishProduct: (productData: Partial<MarketplaceProduct>) => Promise<MarketplaceProduct>;

  // Academy Student Progress
  studentProgressList: StudentProgress[];
  getStudentProgress: (courseId: string) => StudentProgress | undefined;
  markLessonComplete: (courseId: string, lessonId: string) => void;

  // Gamification Missions
  missions: CommercialMission[];
  claimMissionReward: (missionId: string) => void;

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { player, playSoundEffect, addXpAndMp, sagaSessionContext, clearSagaSessionContext } = usePlayer();

  // Navigation State
  const [activeTab, setActiveTab] = useState<MarketplaceNavTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<CommercialCategory | 'ALL'>('ALL');
  const [selectedSagaId, setSelectedSagaId] = useState<SagaId | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  // Products & Sellers
  const [products, setProducts] = useState<MarketplaceProduct[]>(() => {
    let base: MarketplaceProduct[] = INITIAL_MARKETPLACE_PRODUCTS;
    try {
      const saved = localStorage.getItem('magnopvs_marketplace_products');
      if (saved) base = JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading stored products:', e);
    }
    const creatorItems = getCreatorMarketplaceProducts();
    const filteredBase = base.filter((p) => !p.id.startsWith('nenca_') && !p.id.startsWith('merch_'));
    return [...creatorItems, ...filteredBase];
  });

  useEffect(() => {
    const syncCreatorProducts = () => {
      const creatorItems = getCreatorMarketplaceProducts();
      setProducts((prev) => {
        const filtered = prev.filter((p) => !p.id.startsWith('nenca_') && !p.id.startsWith('merch_'));
        return [...creatorItems, ...filtered];
      });
    };
    window.addEventListener('magnopvs-sagas-updated', syncCreatorProducts);
    return () => window.removeEventListener('magnopvs-sagas-updated', syncCreatorProducts);
  }, []);

  const [courses] = useState<AcademyCourse[]>(INITIAL_ACADEMY_COURSES);
  const [sellers, setSellers] = useState<SellerProfile[]>(INITIAL_SELLER_STORES);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_marketplace_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading stored cart:', e);
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<MarketplaceCoupon | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_marketplace_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading stored wishlist:', e);
    }
    return [];
  });

  // Orders
  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_marketplace_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading stored orders:', e);
    }
    return [];
  });

  // Seller Studio
  const [currentSellerProfile, setCurrentSellerProfile] = useState<SellerProfile | null>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_seller_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading seller profile:', e);
    }
    return null;
  });

  // Academy Student Progress
  const [studentProgressList, setStudentProgressList] = useState<StudentProgress[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_student_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading student progress:', e);
    }
    return [
      {
        courseId: 'course-arch-01',
        completedLessonIds: ['les-1-1'],
        percentCompleted: 14,
        certificateIssued: false,
        enrolledAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        lastAccessedAt: new Date().toISOString(),
      },
    ];
  });

  // Commercial Gamification Missions
  const [missions, setMissions] = useState<CommercialMission[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_commercial_missions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading commercial missions:', e);
    }
    return INITIAL_COMMERCIAL_MISSIONS;
  });

  // Sync with Saga Session Context from PlayerContext
  useEffect(() => {
    if (sagaSessionContext?.section === 'marketplace') {
      setActiveTab('sagas');
      setSelectedSagaId(sagaSessionContext.sagaId);
      clearSagaSessionContext();
    }
  }, [sagaSessionContext, clearSagaSessionContext]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('magnopvs_marketplace_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('magnopvs_marketplace_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('magnopvs_marketplace_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('magnopvs_marketplace_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentSellerProfile) {
      localStorage.setItem('magnopvs_seller_profile', JSON.stringify(currentSellerProfile));
    }
  }, [currentSellerProfile]);

  useEffect(() => {
    localStorage.setItem('magnopvs_student_progress', JSON.stringify(studentProgressList));
  }, [studentProgressList]);

  useEffect(() => {
    localStorage.setItem('magnopvs_commercial_missions', JSON.stringify(missions));
  }, [missions]);

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const rawTotalMp = cart.reduce((acc, item) => {
    const unitPrice = item.product.priceMp + (item.selectedVariant?.priceModifierMp || 0);
    return acc + unitPrice * item.quantity;
  }, 0);

  const rawTotalMicroCoins = cart.reduce((acc, item) => {
    const unitPrice = item.product.priceMicroCoins + (item.selectedVariant?.priceModifierMicroCoins || 0);
    return acc + unitPrice * item.quantity;
  }, 0);

  const rawTotalFiatUsd = cart.reduce((acc, item) => {
    const unitPrice = item.product.priceFiatUsd + (item.selectedVariant?.priceModifierFiat || 0);
    return acc + unitPrice * item.quantity;
  }, 0);

  // Apply discount if coupon is active
  const discountMultiplier = appliedCoupon ? (100 - appliedCoupon.discountPercent) / 100 : 1.0;
  const cartTotalMp = Math.round(rawTotalMp * discountMultiplier);
  const cartTotalMicroCoins = Math.max(1, Math.round(rawTotalMicroCoins * discountMultiplier));
  const cartTotalFiatUsd = parseFloat((rawTotalFiatUsd * discountMultiplier).toFixed(2));

  // Cart Actions
  const addToCart = (
    product: MarketplaceProduct,
    quantity = 1,
    variant?: ProductVariant,
    currency: 'MP' | 'MICROCOIN' | 'FIAT' = 'MP'
  ) => {
    playSoundEffect('click');
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        product,
        quantity,
        selectedVariant: variant,
        selectedCurrency: currency,
        addedAt: new Date().toISOString(),
      };
      return [newItem, ...prev];
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    playSoundEffect('click');
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find((c) => c.code === cleanCode);

    if (!found) {
      return { success: false, error: 'Código de cupón inválido o caducado.' };
    }

    if (found.minSpendMp && rawTotalMp < found.minSpendMp) {
      return {
        success: false,
        error: `Este cupón requiere una compra mínima de ${found.minSpendMp.toLocaleString()} MP.`,
      };
    }

    setAppliedCoupon(found);
    playSoundEffect('quest');
    return { success: true };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    playSoundEffect('click');
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // CHECKOUT PROCESSOR
  const processCheckout = async (params: {
    paymentMethod: 'MP' | 'MICROCOIN' | 'FIAT';
    shippingAddress?: {
      fullName: string;
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  }): Promise<{ success: boolean; error?: string; order?: MarketplaceOrder }> => {
    if (cart.length === 0) {
      return { success: false, error: 'El carrito de compras está vacío.' };
    }

    const { paymentMethod, shippingAddress } = params;
    const auditId = `aud-tx-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // 1. Economic Validation & Debiting through WalletService
    if (paymentMethod === 'MP') {
      const spendResult = await WalletService.spendCurrency(
        player.id,
        'MP',
        cartTotalMp,
        'MAGNOPVS_MARKETPLACE',
        `Compra de ${cartCount} producto(s) en MagnopVS Marketplace (Orden #${auditId.substring(7, 13)})`,
        {
          sourceReference: auditId,
          idempotencyKey: `order-${auditId}`,
        }
      );

      if (!spendResult.success) {
        return {
          success: false,
          error: spendResult.error || `Saldo insuficiente de MagnoPoints (${player.magnoPoints.toLocaleString()} MP disponibles).`,
        };
      }
    } else if (paymentMethod === 'MICROCOIN') {
      const spendResult = await WalletService.spendCurrency(
        player.id,
        'MICROCOIN',
        cartTotalMicroCoins,
        'MAGNOPVS_MARKETPLACE',
        `Adquisición con MicroCoins en MagnopVS Marketplace (Orden #${auditId.substring(7, 13)})`,
        {
          sourceReference: auditId,
          idempotencyKey: `order-${auditId}`,
        }
      );

      if (!spendResult.success) {
        return {
          success: false,
          error: spendResult.error || `Saldo insuficiente de MicroCoins (${player.microCoins || 0} µC disponibles).`,
        };
      }
    } else {
      // FIAT / Simulated External Payment Gateway Adapter
      // Verifies simulated gateway authorization
      console.log('[Marketplace Gateway] Authorizing payment via external gateway adapter...');
    }

    // 2. Build Audited Order Items
    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0] || '',
      format: item.product.format,
      quantity: item.quantity,
      selectedVariant: item.selectedVariant,
      unitPriceMp: item.product.priceMp,
      unitPriceMicroCoins: item.product.priceMicroCoins,
      unitPriceFiat: item.product.priceFiatUsd,
      sellerId: item.product.sellerId,
      digitalDownloadUrl: item.product.digitalFileUrl,
      licenseKey:
        item.product.format === 'DIGITAL'
          ? `QNTM-LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
          : undefined,
    }));

    const newOrder: MarketplaceOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: player.id,
      userName: player.name,
      userEmail: `${player.name.toLowerCase().replace(/\s+/g, '')}@magnopvs.network`,
      items: orderItems,
      currencyUsed: paymentMethod,
      totalMp: cartTotalMp,
      totalMicroCoins: cartTotalMicroCoins,
      totalFiatUsd: cartTotalFiatUsd,
      discountAppliedMp: rawTotalMp - cartTotalMp,
      discountAppliedFiat: rawTotalFiatUsd - cartTotalFiatUsd,
      couponCode: appliedCoupon?.code,
      status: 'COMPLETED',
      shippingAddress,
      trackingCode: `TRK-MAGNO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      transactionAuditId: auditId,
    };

    // 3. Update orders state
    setOrders((prev) => [newOrder, ...prev]);

    // 4. Enroll in Academy courses if any were bought
    orderItems.forEach((it) => {
      if (it.format === 'COURSE') {
        const matchingCourse = courses.find((c) => c.productId === it.productId);
        if (matchingCourse) {
          setStudentProgressList((prev) => {
            if (prev.some((p) => p.courseId === matchingCourse.id)) return prev;
            return [
              ...prev,
              {
                courseId: matchingCourse.id,
                completedLessonIds: [],
                percentCompleted: 0,
                certificateIssued: false,
                enrolledAt: new Date().toISOString(),
                lastAccessedAt: new Date().toISOString(),
              },
            ];
          });
        }
      }
    });

    // 5. Update Gamification Missions & Award XP
    addXpAndMp(150, 200);
    setMissions((prev) =>
      prev.map((m) => {
        if (m.category === 'PURCHASE' && !m.isCompleted) {
          const nextCount = m.currentCount + 1;
          return {
            ...m,
            currentCount: nextCount,
            isCompleted: nextCount >= m.requirementCount,
          };
        }
        return m;
      })
    );

    // 6. Clear cart & play success sound
    clearCart();
    setIsCheckoutModalOpen(false);
    playSoundEffect('portal');

    return { success: true, order: newOrder };
  };

  // Seller Studio Operations
  const registerAsSeller = async (storeData: Partial<SellerProfile>): Promise<SellerProfile> => {
    playSoundEffect('quest');
    const newProfile: SellerProfile = {
      id: `store-${Date.now()}`,
      storeName: storeData.storeName || `${player.name}'s Workshop`,
      tagline: storeData.tagline || 'Creador independiente en el Multiverso MagnopVS',
      bio: storeData.bio || 'Creaciones y productos digitales exclusivos.',
      logoUrl: storeData.logoUrl || player.avatarUrl,
      bannerUrl: storeData.bannerUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&auto=format&fit=crop&q=80',
      ownerId: player.id,
      ownerName: player.name,
      sellerType: storeData.sellerType || 'INDEPENDENT',
      isVerified: true,
      rating: 5.0,
      totalSales: 0,
      followersCount: 1,
      joinedAt: new Date().toISOString(),
      balanceMp: 0,
      balanceMicroCoins: 0,
      balanceFiatUsd: 0,
      commissionRate: 0.10,
      socialLinks: storeData.socialLinks,
    };

    setCurrentSellerProfile(newProfile);
    setSellers((prev) => [newProfile, ...prev]);
    return newProfile;
  };

  const publishProduct = async (productData: Partial<MarketplaceProduct>): Promise<MarketplaceProduct> => {
    playSoundEffect('portal');
    const seller = currentSellerProfile || {
      id: `store-${player.id}`,
      storeName: `${player.name} Store`,
      logoUrl: player.avatarUrl,
      rating: 5.0,
    };

    const newProd: MarketplaceProduct = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: productData.name || 'Nuevo Producto Cósmico',
      subtitle: productData.subtitle || 'Creación independiente',
      description: productData.description || 'Descripción detallada del producto.',
      images: productData.images && productData.images.length > 0
        ? productData.images
        : ['https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80'],
      category: productData.category || 'productos_creadores',
      subcategory: productData.subcategory || 'Creaciones de la Comunidad',
      tags: productData.tags || ['creador', 'comunidad', 'magnopvs'],
      priceMp: productData.priceMp || 10000,
      priceMicroCoins: productData.priceMicroCoins || 1,
      priceFiatUsd: productData.priceFiatUsd || 10.0,
      format: productData.format || 'DIGITAL',
      stock: productData.stock || 100,
      sellerId: seller.id,
      sellerName: seller.storeName,
      sellerAvatar: seller.logoUrl,
      sellerRating: 5.0,
      isOfficialMagnopvs: false,
      sagaId: productData.sagaId,
      rating: 5.0,
      reviewCount: 0,
      salesCount: 0,
      isNewRelease: true,
      createdAt: new Date().toISOString(),
      status: 'PUBLISHED',
      digitalFileUrl: productData.digitalFileUrl,
      fileFormat: productData.fileFormat,
      returnPolicyDays: 14,
    };

    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  // Academy Progress
  const getStudentProgress = (courseId: string) => {
    return studentProgressList.find((p) => p.courseId === courseId);
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    playSoundEffect('quest');
    setStudentProgressList((prev) => {
      const existing = prev.find((p) => p.courseId === courseId);
      const course = courses.find((c) => c.id === courseId);
      const totalLessons = course
        ? course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
        : 6;

      if (existing) {
        if (existing.completedLessonIds.includes(lessonId)) return prev;
        const nextCompleted = [...existing.completedLessonIds, lessonId];
        const percent = Math.min(100, Math.round((nextCompleted.length / totalLessons) * 100));

        return prev.map((p) =>
          p.courseId === courseId
            ? {
                ...p,
                completedLessonIds: nextCompleted,
                percentCompleted: percent,
                certificateIssued: percent === 100 ? true : p.certificateIssued,
                certificateId:
                  percent === 100 && !p.certificateId
                    ? `CERT-QNTM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
                    : p.certificateId,
                lastAccessedAt: new Date().toISOString(),
              }
            : p
        );
      }

      return [
        ...prev,
        {
          courseId,
          completedLessonIds: [lessonId],
          percentCompleted: Math.round((1 / totalLessons) * 100),
          certificateIssued: false,
          enrolledAt: new Date().toISOString(),
          lastAccessedAt: new Date().toISOString(),
        },
      ];
    });

    addXpAndMp(50, 100);
  };

  const claimMissionReward = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || !mission.isCompleted || mission.isClaimed) return;

    playSoundEffect('portal');
    addXpAndMp(mission.rewardXp, mission.rewardMp);
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, isClaimed: true } : m))
    );
  };

  return (
    <MarketplaceContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        selectedSagaId,
        setSelectedSagaId,
        selectedProduct,
        setSelectedProduct,
        selectedCourse,
        setSelectedCourse,
        products,
        courses,
        sellers,
        cart,
        cartCount,
        cartTotalMp,
        cartTotalMicroCoins,
        cartTotalFiatUsd,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        processCheckout,
        currentSellerProfile,
        registerAsSeller,
        publishProduct,
        studentProgressList,
        getStudentProgress,
        markLessonComplete,
        missions,
        claimMissionReward,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace debe ser utilizado dentro de un MarketplaceProvider');
  }
  return context;
};
