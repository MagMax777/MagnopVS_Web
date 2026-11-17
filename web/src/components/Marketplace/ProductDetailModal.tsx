import React, { useState } from 'react';
import { MarketplaceProduct, ProductVariant } from '../../types/marketplace';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  X,
  Star,
  Coins,
  Sparkles,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Download,
  GraduationCap,
  Share2,
  Check,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Tag
} from 'lucide-react';

interface ProductDetailModalProps {
  product: MarketplaceProduct | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { 
    addToCart, 
    isInWishlist, 
    toggleWishlist, 
    setIsCheckoutModalOpen, 
    setSelectedSagaId, 
    setActiveTab 
  } = useMarketplace();
  const { playSoundEffect } = usePlayer();

  if (!product) return null;

  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTabSection, setActiveTabSection] = useState<'details' | 'reviews' | 'qa'>('details');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const inWishlist = isInWishlist(product.id);

  // Price calculation with selected variant
  const unitPriceMp = product.priceMp + (selectedVariant?.priceModifierMp || 0);
  const unitPriceMicroCoins = product.priceMicroCoins + (selectedVariant?.priceModifierMicroCoins || 0);
  const unitPriceFiat = product.priceFiatUsd + (selectedVariant?.priceModifierFiat || 0);

  const handleAddToCart = () => {
    playSoundEffect('click');
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    playSoundEffect('portal');
    addToCart(product, quantity, selectedVariant);
    onClose();
    setIsCheckoutModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-fade-in font-orbitron overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#05060a]/98 border-2 border-[#00f0ff]/50 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.3)] flex flex-col my-auto">
        
        {/* Top Glow Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00f0ff] via-[#8a2be2] to-[#ff007f]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1f2430] bg-[#0a0d14]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#a0a5b5] uppercase">
              {product.category.replace(/_/g, ' ')} /
            </span>
            <span className="text-xs font-mono text-[#00f0ff] font-bold">
              {product.subcategory}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a0a5b5] hover:text-[#00f0ff] border border-white/10 transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
              title="Copiar enlace del producto"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? '¡Copiado!' : 'Compartir'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-[#ff007f] border border-white/10 transition-colors cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 scrollbar-thin scrollbar-thumb-[#00f0ff]/30">
          
          {/* Main 2-Col Grid: Gallery Left, Purchase Form Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Gallery (Left 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="relative w-full aspect-square rounded-2xl bg-[#0a0b10] border border-[#1f2430] overflow-hidden shadow-inner group">
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {product.isOfficialMagnopvs && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#00f0ff] text-black text-xs font-mono font-bold shadow-lg flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    OFICIAL MAGNOPVS
                  </div>
                )}
              </div>

              {/* Thumbnails row */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                        activeImageIdx === idx ? 'border-[#00f0ff] scale-105' : 'border-[#1f2430] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Actions (Right 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              
              <div className="space-y-3">
                {/* Saga Tag if available */}
                {product.sagaId && (
                  <button
                    onClick={() => {
                      setSelectedSagaId(product.sagaId!);
                      setActiveTab('sagas');
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#ff007f] text-xs font-mono font-bold uppercase hover:bg-[#ff007f]/30 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3 h-3" />
                    <span>Saga: {product.sagaId.replace(/_/g, ' ')}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-audiowide text-white leading-tight">
                  {product.name}
                </h1>
                
                <p className="text-xs sm:text-sm text-[#a0a5b5] leading-relaxed">
                  {product.subtitle || product.description}
                </p>

                {/* Star rating & stats */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
                  <div className="flex items-center gap-1.5 text-[#ffd700]">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
                    <span className="text-[#a0a5b5]">({product.reviewCount} reseñas)</span>
                  </div>
                  <span className="text-[#1f2430]">|</span>
                  <span className="text-[#7fffd4] font-bold">{product.salesCount} adquiridos</span>
                  <span className="text-[#1f2430]">|</span>
                  <span className="text-[#a0a5b5]">
                    Stock: <strong className="text-white">{product.stock > 0 ? `${product.stock} unidades` : 'Bajo pedido'}</strong>
                  </span>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-[#1f2430] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-[#a0a5b5] font-mono tracking-widest uppercase block mb-1">
                    Precio Oficial Multiversal:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-2xl sm:text-3xl font-black font-audiowide text-[#00f0ff]">
                      <Coins className="w-6 h-6 shrink-0" />
                      <span>{unitPriceMp.toLocaleString()} MP</span>
                    </div>
                    {product.previousPriceMp && (
                      <span className="text-sm line-through text-[#a0a5b5] font-mono">
                        {product.previousPriceMp.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#a0a5b5] mt-1">
                    <span className="text-[#ff007f] font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {unitPriceMicroCoins} MicroCoins (µC)
                    </span>
                    <span>•</span>
                    <span className="text-white font-bold">${unitPriceFiat.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Wishlist quick toggle */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-mono self-start sm:self-auto ${
                    inWishlist
                      ? 'bg-[#ff007f]/20 text-[#ff007f] border-[#ff007f]'
                      : 'bg-[#05060a] text-[#a0a5b5] hover:text-[#ff007f] border-[#1f2430]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  <span>{inWishlist ? 'En Lista de Deseos' : 'Favorito'}</span>
                </button>
              </div>

              {/* Quantity Picker & Action Buttons */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-[#a0a5b5]">Cantidad:</span>
                  <div className="flex items-center bg-[#0a0d14] border border-[#1f2430] rounded-xl overflow-hidden font-mono">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 hover:bg-white/10 text-white cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-white min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                      className="px-3 py-1.5 hover:bg-white/10 text-white cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-[#00f0ff] border border-white/20 hover:border-[#00f0ff] font-audiowide font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Añadir al Carrito</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 text-black font-audiowide font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Comprar Ahora</span>
                  </button>
                </div>
              </div>

              {/* Seller Trust Bar */}
              <div className="p-3.5 rounded-xl bg-[#0a0d14]/70 border border-[#1f2430] flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <img
                    src={product.sellerAvatar}
                    alt={product.sellerName}
                    className="w-8 h-8 rounded-full object-cover border border-[#00f0ff]/40"
                  />
                  <div>
                    <strong className="text-white block">{product.sellerName}</strong>
                    <span className="text-[10px] text-[#7fffd4]">
                      ★ {product.sellerRating.toFixed(1)} • Vendedor Verificado
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('seller_studio');
                    onClose();
                  }}
                  className="text-[11px] text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Perfil Tienda</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

          {/* Bottom Tabs: Details / Reviews / QA */}
          <div className="border-t border-[#1f2430] pt-6 space-y-4">
            
            <div className="flex gap-2 border-b border-[#1f2430] pb-2 text-xs font-mono">
              <button
                onClick={() => setActiveTabSection('details')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTabSection === 'details'
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-bold border border-[#00f0ff]/40'
                    : 'text-[#a0a5b5] hover:text-white'
                }`}
              >
                Especificaciones & Entrega
              </button>
              <button
                onClick={() => setActiveTabSection('reviews')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTabSection === 'reviews'
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-bold border border-[#00f0ff]/40'
                    : 'text-[#a0a5b5] hover:text-white'
                }`}
              >
                Reseñas de Exploradores ({product.reviewCount})
              </button>
              <button
                onClick={() => setActiveTabSection('qa')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTabSection === 'qa'
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-bold border border-[#00f0ff]/40'
                    : 'text-[#a0a5b5] hover:text-white'
                }`}
              >
                Preguntas & Respuestas
              </button>
            </div>

            {/* Tab: Details */}
            {activeTabSection === 'details' && (
              <div className="space-y-4 text-xs font-mono text-[#a0a5b5] leading-relaxed">
                <p>{product.description}</p>
                {product.richDetails && product.richDetails.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <strong className="text-white uppercase tracking-wider block font-audiowide text-xs">
                      Características Principales:
                    </strong>
                    <ul className="space-y-1.5 list-disc list-inside">
                      {product.richDetails.map((detail, idx) => (
                        <li key={idx} className="text-[#f8f9fa]">{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1f2430] flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#7fffd4]" />
                    <div>
                      <strong className="text-white block">Envío Estimado</strong>
                      <span className="text-[10px]">{product.shippingDays ? `${product.shippingDays} días hábiles` : 'Inmediato (Digital)'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1f2430] flex items-center gap-2.5">
                    <RotateCcw className="w-4 h-4 text-[#00f0ff]" />
                    <div>
                      <strong className="text-white block">Devolución Segura</strong>
                      <span className="text-[10px]">{product.returnPolicyDays} días de garantía</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1f2430] flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#ff007f]" />
                    <div>
                      <strong className="text-white block">Garantía MagnopVS</strong>
                      <span className="text-[10px]">Autenticidad auditada</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTabSection === 'reviews' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1f2430] flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-black font-audiowide text-white">{product.rating.toFixed(1)}</div>
                    <div className="flex text-[#ffd700] justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#a0a5b5]">Basado en {product.reviewCount} opiniones</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#0a0d14]/70 border border-[#1f2430] space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white font-bold">Kaelen_Aether</span>
                      <span className="text-[#a0a5b5]">Hace 3 días</span>
                    </div>
                    <div className="flex text-[#ffd700]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-[#a0a5b5] text-[11px]">
                      "Excelente calidad, llegó perfectamente embalado con el sello cuántico de autenticidad. Los acabados holográficos superaron mis expectativas."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: QA */}
            {activeTabSection === 'qa' && (
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#0a0d14] border border-[#1f2430] space-y-1.5">
                  <strong className="text-white block">P: ¿Es compatible con la versión móvil de MagnopVS?</strong>
                  <p className="text-[#7fffd4]">
                    R: Sí, todos los productos digitales y activos de la Academia se sincronizan de inmediato en tu perfil web y móvil.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
