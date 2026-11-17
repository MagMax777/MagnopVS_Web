import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { TumblrFlickrPost, INITIAL_TUMBLR_FLICKR_POSTS } from '../../../data/socialExpandedData';
import { 
  Camera, 
  Quote, 
  Repeat, 
  Heart, 
  Share2, 
  Sparkles, 
  Plus, 
  Sliders, 
  Maximize2, 
  X, 
  Check, 
  Hash,
  Eye,
  Info
} from 'lucide-react';

export const TumblrFlickrBlogView: React.FC = () => {
  const { player, addXpAndMp, playSoundEffect } = usePlayer();
  const [posts, setPosts] = useState<TumblrFlickrPost[]>(INITIAL_TUMBLR_FLICKR_POSTS);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [inspectedImage, setInspectedImage] = useState<string | null>(null);
  
  // New post form state
  const [postType, setPostType] = useState<'photo' | 'quote'>('photo');
  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [quoteSource, setQuoteSource] = useState('');
  const [cameraModel, setCameraModel] = useState('Nikon Quantvm Z9 Pro');
  const [tagInput, setTagInput] = useState('#cyberpunk, #flickr_pro, #MagnopVS');

  const handleLike = (postId: string) => {
    playSoundEffect('click');
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          const notesCount = isLiked ? p.notesCount + 1 : p.notesCount - 1;
          return { ...p, isLiked, notesCount };
        }
        return p;
      })
    );
  };

  const handleReblog = (postId: string) => {
    playSoundEffect('level');
    addXpAndMp(80, 40);

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, isReblogged: true, notesCount: p.notesCount + 1 };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim() && !imageUrl.trim()) return;

    playSoundEffect('quest');
    addXpAndMp(150, 75);

    const tags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => (t.startsWith('#') ? t : `#${t}`));

    const newPost: TumblrFlickrPost = {
      id: `tf-${Date.now()}`,
      type: postType,
      authorName: player.name || 'Aetheris (Tú)',
      authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      authorHandle: `@${(player.name || 'aetheris').toLowerCase().replace(/\s+/g, '_')}`,
      content: textContent.trim(),
      imageUrl: imageUrl.trim() || undefined,
      quoteSource: quoteSource.trim() || undefined,
      exifData: postType === 'photo' ? {
        camera: cameraModel,
        lens: 'Taquiónico 50mm f/1.2',
        iso: 'ISO 3200 Estelar',
        shutter: '1/4000s Cuántica',
        resolution: '8192 x 5464 // 8K HDR'
      } : undefined,
      tags: tags.length ? tags : ['#MagnopVS', '#aesthetic'],
      notesCount: 1,
      isLiked: false,
      isReblogged: false,
      timestamp: 'Ahora mismo'
    };

    setPosts([newPost, ...posts]);
    setIsCreateOpen(false);
    setTextContent('');
    setImageUrl('');
    setQuoteSource('');
  };

  const filteredPosts = selectedTag
    ? posts.filter(p => p.tags.includes(selectedTag))
    : posts;

  return (
    <div className="space-y-6 font-mono animate-fade-in max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-[#0b0e14] border border-[#1f2430] p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-audiowide text-lg text-white uppercase flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#ff007f]" />
              Blog Estético & Fotografía Cuántica
            </h2>
            <span className="text-[10px] bg-[#ff007f]/20 text-[#ff007f] px-2 py-0.5 rounded border border-[#ff007f]/40 font-bold uppercase">
              Bitácora & EXIF
            </span>
          </div>
          <p className="text-xs text-[#a0a5b5] mt-1">
            Galerías fotográficas de alta exposición con metadatos EXIF reales, citas neón y notas re-sintonizadas en MagnopVS.
          </p>
        </div>

        <button
          onClick={() => { setIsCreateOpen(true); playSoundEffect('click'); }}
          className="px-5 py-2.5 bg-[#00f0ff] hover:bg-[#7fffd4] text-[#05060a] font-bold text-xs uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>PUBLICAR NOTA</span>
        </button>
      </div>

      {/* Filter by Tag if active */}
      {selectedTag && (
        <div className="bg-[#121622] border border-[#00f0ff] px-4 py-2 rounded-xl flex items-center justify-between text-xs text-[#00f0ff]">
          <span className="flex items-center gap-1.5 font-bold">
            <Hash className="w-4 h-4" />
            Filtrando por etiqueta: {selectedTag}
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className="hover:underline text-[#ff3366] cursor-pointer"
          >
            Quitar filtro
          </button>
        </div>
      )}

      {/* Feed of Posts */}
      <div className="space-y-8">
        {filteredPosts.map((post) => (
          <article 
            key={post.id}
            className="bg-[#0b0e14] border border-[#1f2430] hover:border-[#ff007f]/50 rounded-3xl overflow-hidden transition-all shadow-xl space-y-4"
          >
            
            {/* Author Header */}
            <div className="p-5 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-[#ff007f]" />
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    {post.authorName}
                    <span className="text-[10px] text-[#a0a5b5] font-normal">{post.authorHandle}</span>
                  </h4>
                  <span className="text-[10px] text-[#00f0ff]">{post.timestamp}</span>
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded uppercase border bg-[#121622] text-[#a0a5b5] border-[#1f2430]">
                {post.type === 'photo' ? 'Captura Cuántica (EXIF)' : 'Manifiesto Neón'}
              </span>
            </div>

            {/* Post Photo (EXIF Style) */}
            {post.type === 'photo' && post.imageUrl && (
              <div className="relative group overflow-hidden bg-black max-h-[600px] flex items-center justify-center">
                <img 
                  src={post.imageUrl} 
                  alt="Post media" 
                  className="w-full h-auto object-cover max-h-[600px] group-hover:scale-101 transition-transform duration-500"
                />

                <button
                  onClick={() => setInspectedImage(post.imageUrl || null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
                  title="Inspeccionar en Alta Resolución"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quote Type (Manifiesto Style) */}
            {post.type === 'quote' && (
              <div className="p-6 sm:p-8 bg-gradient-to-br from-[#1c082b] to-[#0b0e14] border-y border-[#ff007f]/30 space-y-3">
                <Quote className="w-8 h-8 text-[#ff007f] opacity-80" />
                <p className="text-lg sm:text-xl font-serif italic text-white leading-relaxed">
                  {post.content}
                </p>
                {post.quoteSource && (
                  <p className="text-xs text-[#7fffd4] font-mono">
                    {post.quoteSource}
                  </p>
                )}
              </div>
            )}

            {/* Text description if photo */}
            {post.type === 'photo' && post.content && (
              <div className="px-5 text-xs text-[#e0e5eb] leading-relaxed">
                {post.content}
              </div>
            )}

            {/* Simulated EXIF Metadata Box (Telemetría Cuántica) */}
            {post.exifData && (
              <div className="mx-5 bg-[#121622] border border-[#1f2430] p-3 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-[#a0a5b5]">
                <div>
                  <span className="block text-[8px] uppercase text-[#00f0ff]">Cámara:</span>
                  <span className="font-bold text-white truncate block">{post.exifData.camera}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase text-[#00f0ff]">Lente:</span>
                  <span className="font-bold text-white truncate block">{post.exifData.lens}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase text-[#00f0ff]">Exposición:</span>
                  <span className="font-bold text-white truncate block">{post.exifData.shutter} · {post.exifData.iso}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase text-[#00f0ff]">Resolución:</span>
                  <span className="font-bold text-[#15ffd1] truncate block">{post.exifData.resolution}</span>
                </div>
              </div>
            )}

            {/* Tags Cloud */}
            <div className="px-5 flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTag(tag)}
                  className="text-[10px] text-[#00f0ff] hover:underline cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Bottom Actions Bar & Notes Count */}
            <div className="p-5 pt-3 border-t border-[#1f2430] flex items-center justify-between text-xs">
              
              <div className="flex items-center gap-2 text-[#a0a5b5] font-bold">
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                <span>{post.notesCount.toLocaleString()} notas</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Re-sintonizar Button */}
                <button
                  onClick={() => handleReblog(post.id)}
                  className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                    post.isReblogged
                      ? 'bg-[#15ffd1]/20 text-[#15ffd1] border-[#15ffd1]'
                      : 'bg-[#121622] hover:bg-[#1a2233] text-white border-[#1f2430]'
                  }`}
                  title="Re-sintonizar en tu bitácora (+80 XP)"
                >
                  <Repeat className="w-4 h-4" />
                  <span className="hidden sm:inline">Re-sintonizar</span>
                </button>

                {/* Like Button */}
                <button
                  onClick={() => handleLike(post.id)}
                  className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                    post.isLiked
                      ? 'bg-[#ff3366] text-white border-[#ff3366] shadow-[0_0_15px_rgba(255,51,102,0.4)]'
                      : 'bg-[#121622] hover:bg-[#ff3366]/20 text-[#ff3366] border-[#1f2430]'
                  }`}
                  title="Me Gusta"
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

            </div>

          </article>
        ))}
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in font-mono">
          <div className="bg-[#0b0e14] border-2 border-[#00f0ff] w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-[0_0_50px_rgba(0,240,255,0.4)]">
            
            <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
              <h3 className="font-audiowide text-base text-white uppercase flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#00f0ff]" />
                Publicar en Bitácora Visual & Manifiesto
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-[#a0a5b5] hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPostType('photo')}
                className={`flex-1 py-2 rounded-xl font-bold uppercase text-xs transition-all cursor-pointer ${
                  postType === 'photo' ? 'bg-[#00f0ff] text-[#05060a]' : 'bg-[#121622] text-[#a0a5b5]'
                }`}
              >
                📷 Fotografía EXIF
              </button>
              <button
                type="button"
                onClick={() => setPostType('quote')}
                className={`flex-1 py-2 rounded-xl font-bold uppercase text-xs transition-all cursor-pointer ${
                  postType === 'quote' ? 'bg-[#ff007f] text-white' : 'bg-[#121622] text-[#a0a5b5]'
                }`}
              >
                💬 Cita Neón / Manifiesto
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              {postType === 'photo' ? (
                <>
                  <div>
                    <label className="text-[10px] text-[#a0a5b5] uppercase block mb-1">URL de la Fotografía (Alta Resolución):</label>
                    <input 
                      type="url" 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#121622] border border-[#1f2430] focus:border-[#00f0ff] rounded-xl px-3 py-2 text-white outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#a0a5b5] uppercase block mb-1">Modelo de Cámara / Sensor:</label>
                    <input 
                      type="text" 
                      value={cameraModel}
                      onChange={(e) => setCameraModel(e.target.value)}
                      className="w-full bg-[#121622] border border-[#1f2430] rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#a0a5b5] uppercase block mb-1">Descripción / Pie de Foto:</label>
                    <textarea 
                      rows={2}
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Escribe la historia detrás del disparo cuántico..."
                      className="w-full bg-[#121622] border border-[#1f2430] rounded-xl px-3 py-2 text-white outline-none resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] text-[#a0a5b5] uppercase block mb-1">Texto de la Cita:</label>
                    <textarea 
                      rows={4}
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Escribe la frase memorable o pensamiento existencial..."
                      className="w-full bg-[#121622] border border-[#1f2430] focus:border-[#ff007f] rounded-xl px-3 py-2 text-white outline-none resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#a0a5b5] uppercase block mb-1">Autor o Fuente de la Cita:</label>
                    <input 
                      type="text" 
                      value={quoteSource}
                      onChange={(e) => setQuoteSource(e.target.value)}
                      placeholder="— Fragmento de los Archivos de Eleusis en MagnopVS"
                      className="w-full bg-[#121622] border border-[#1f2430] rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-[10px] text-[#a0a5b5] uppercase block mb-1">Etiquetas (separadas por coma):</label>
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full bg-[#121622] border border-[#1f2430] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1f2430]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#1f2430] text-[#a0a5b5] hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#00f0ff] hover:bg-[#7fffd4] text-[#05060a] font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
                >
                  Publicar Nota (+150 XP)
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Fullscreen Image Inspector */}
      {inspectedImage && (
        <div 
          onClick={() => setInspectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl cursor-zoom-out animate-fade-in"
        >
          <img src={inspectedImage} alt="Fullscreen inspection" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
        </div>
      )}

    </div>
  );
};
