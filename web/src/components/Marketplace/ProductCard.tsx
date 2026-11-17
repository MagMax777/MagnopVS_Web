import React from 'react';
import { MarketplaceProduct } from '../../types/marketplace';
import { useMarketplace } from '../../context/MarketplaceContext';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Coins, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  GraduationCap, 
  Box, 
  Check 
} from 'lucide-react';

interface ProductCardProps {
  product: MarketplaceProduct;
  onOpenDetail?: (product: MarketplaceProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { addToCart, isInWishlist, toggleWishlist, setSelectedProduct } = useMarketplace();
  const inWishlist = isInWishlist(product.id);

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(product);
    } else {
      setSelectedProduct(product);
    }
  };

  const getFormatBadge = () => {
    switch (product.format) {
      case 'DIGITAL':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 flex items-center gap-1">
            <Download className="w-2.5 h-2.5" />
            DIGITAL
          </span>
        );
      case 'COURSE':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#8a2be2]/20 text-[#8a2be2] border border-[#8a2be2]/40 flex items-center gap-1">
            <GraduationCap className="w-2.5 h-2.5" />
            ACADEMIA
          </span>
        );
      case 'SUBSCRIPTION':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#ffaa00]/20 text-[#ffaa00] border border-[#ffaa00]/40 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            PASE VIP
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-white/80 border border-white/20 flex items-center gap-1">
            <Box className="w-2.5 h-2.5" />
            FÍSICO
          </span>
        );
    }
  };

  return (
    <div className="group relative bg-[#0a0d14]/90 border border-[#1f2430] hover:border-[#00f0ff]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] flex flex-col font-orbitron">
      
      {/* Top Image Container */}
      <div 
        onClick={handleCardClick}
        className="relative w-full aspect-square bg-[#05060a] overflow-hidden cursor-pointer select-none"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.isOfficialMagnopvs && (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00f0ff] text-black shadow-[0_0_8px_rgba(0,240,255,0.6)] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              OFICIAL
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#ff007f] text-white shadow-[0_0_8px_rgba(255,0,127,0.5)]">
              -{product.discountPercent}%
            </span>
          )}
          {getFormatBadge()}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer z-10 ${
            inWishlist
              ? 'bg-[#ff007f] text-white shadow-[0_0_12px_rgba(255,0,127,0.6)]'
              : 'bg-black/50 text-[#a0a5b5] hover:text-[#ff007f] hover:bg-black/80'
          }`}
          title={inWishlist ? 'Quitar de favoritos' : 'Guardar en lista de deseos'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add to Cart Floating Button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="w-full py-2 bg-[#00f0ff] hover:bg-[#7fffd4] text-black font-audiowide font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Añadir al Carrito</span>
          </button>
        </div>
      </div>

      {/* Product Body Information */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
        
        {/* Category & Rating Header */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#a0a5b5]">
          <span className="truncate max-w-[130px] uppercase text-[#7fffd4]">
            {product.subcategory || product.category.replace(/_/g, ' ')}
          </span>
          <div className="flex items-center gap-1 text-[#ffd700]">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
            <span className="text-[#a0a5b5]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div onClick={handleCardClick} className="cursor-pointer">
          <h3 className="text-xs sm:text-sm font-audiowide font-bold text-white group-hover:text-[#00f0ff] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] text-[#a0a5b5] line-clamp-2 mt-1 leading-relaxed">
            {product.subtitle || product.description}
          </p>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#a0a5b5] pt-2 border-t border-[#1f2430]/70">
          <img 
            src={product.sellerAvatar} 
            alt={product.sellerName}
            className="w-4 h-4 rounded-full object-cover border border-[#00f0ff]/40"
          />
          <span className="truncate">{product.sellerName}</span>
        </div>

        {/* Pricing Rows: MagnoPoints, MicroCoins & USD */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#1f2430]">
          <div>
            <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#00f0ff]">
              <Coins className="w-3.5 h-3.5 shrink-0" />
              <span>{product.priceMp.toLocaleString()} MP</span>
              {product.previousPriceMp && (
                <span className="text-[10px] line-through text-[#a0a5b5] font-normal">
                  {product.previousPriceMp.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#a0a5b5]">
              <span className="text-[#ff007f] font-bold flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                {product.priceMicroCoins} µC
              </span>
              <span>•</span>
              <span>${product.priceFiatUsd.toFixed(2)} USD</span>
            </div>
          </div>

          <button
            onClick={handleCardClick}
            className="p-2 rounded-xl bg-white/5 hover:bg-[#00f0ff]/20 text-[#a0a5b5] hover:text-[#00f0ff] border border-white/10 transition-colors cursor-pointer"
            title="Ver detalles del producto"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
