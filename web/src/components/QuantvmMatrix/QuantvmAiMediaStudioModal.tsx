import React, { useState } from 'react';
import { X, Music, Image as ImageIcon, Video, Upload, Loader2, Sparkles, Download, AlertTriangle } from 'lucide-react';

interface QuantvmAiMediaStudioModalProps {
  onClose: () => void;
}

type StudioMode = 'music' | 'image' | 'video';

const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = dataUrl.indexOf(',');
      const data = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : '';
      resolve({ data, mimeType: file.type || 'image/png', dataUrl });
    };
    reader.readAsDataURL(file);
  });
};

export const QuantvmAiMediaStudioModal: React.FC<QuantvmAiMediaStudioModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<StudioMode>('music');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Music (Lyria)
  const [musicPrompt, setMusicPrompt] = useState('Epica banda sonora cyberpunk sinfónica a 120 BPM para MagnopVS');
  const [musicModel, setMusicModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [musicResult, setMusicResult] = useState<{ audioDataUrl: string; lyrics: string } | null>(null);

  // Image (Nano Banana 2.1)
  const [imagePrompt, setImagePrompt] = useState('Templo cuántico flotante sobre un océano de neón, estilo arte conceptual cinematográfico');
  const [imageAspect, setImageAspect] = useState<'1:1' | '16:9' | '9:16' | '3:4'>('16:9');
  const [editSourceImage, setEditSourceImage] = useState<{ data: string; mimeType: string; dataUrl: string } | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Video (Omni Flash via Interactions API)
  const [videoPhoto, setVideoPhoto] = useState<{ data: string; mimeType: string; dataUrl: string } | null>(null);
  const [videoPrompt, setVideoPrompt] = useState('Movimiento cinematográfico suave de cámara con partículas luminosas flotando en el aire');
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const handleGenerateMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const resp = await fetch('/api/studio/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt, model: musicModel }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Error al generar música.');
      setMusicResult({ audioDataUrl: data.audioDataUrl, lyrics: data.lyrics || '' });
    } catch (err: any) {
      setErrorMsg(err?.message || 'No se pudo generar la pista musical.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const resp = await fetch('/api/studio/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio: imageAspect,
          imageBase64: editSourceImage?.data,
          imageMimeType: editSourceImage?.mimeType,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Error al generar imagen.');
      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      setErrorMsg(err?.message || 'No se pudo generar o editar la imagen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPhoto) {
      setErrorMsg('Sube primero una foto para animarla.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const resp = await fetch('/api/studio/animate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio: videoAspect,
          imageBase64: videoPhoto.data,
          imageMimeType: videoPhoto.mimeType,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Error al animar video.');
      setGeneratedVideoUrl(data.videoDataUrl);
    } catch (err: any) {
      setErrorMsg(err?.message || 'No se pudo generar el video.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0e121b] border-2 border-[#00f0ff]/40 rounded-3xl p-6 space-y-5 shadow-[0_0_50px_rgba(0,240,255,0.2)]">
        <div className="flex items-center justify-between border-b border-[#252d40] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#15ffd1] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estudio Multimodal IA // MagnopVS</span>
            </span>
            <h2 className="text-xl font-audiowide text-white mt-1">
              Música (Lyria) · Imágenes (Nano Banana 2.1) · Video (Omni Flash)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#161b28] border border-[#252d40] text-[#a0a5b5] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 font-mono text-xs">
          <button
            onClick={() => { setMode('music'); setErrorMsg(null); }}
            className={`px-4 py-2 rounded-xl border font-bold flex items-center gap-2 cursor-pointer ${
              mode === 'music' ? 'bg-[#ff4dfa]/20 border-[#ff4dfa] text-[#ffabf3]' : 'bg-[#121726] border-[#252d40] text-[#a0a5b5]'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Generar Música (Lyria)</span>
          </button>
          <button
            onClick={() => { setMode('image'); setErrorMsg(null); }}
            className={`px-4 py-2 rounded-xl border font-bold flex items-center gap-2 cursor-pointer ${
              mode === 'image' ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]' : 'bg-[#121726] border-[#252d40] text-[#a0a5b5]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Crear / Editar Imagen (Nano Banana 2.1)</span>
          </button>
          <button
            onClick={() => { setMode('video'); setErrorMsg(null); }}
            className={`px-4 py-2 rounded-xl border font-bold flex items-center gap-2 cursor-pointer ${
              mode === 'video' ? 'bg-[#15ffd1]/20 border-[#15ffd1] text-[#15ffd1]' : 'bg-[#121726] border-[#252d40] text-[#a0a5b5]'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Animar Foto a Video (Omni Flash)</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-xs font-mono text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {mode === 'music' && (
          <form onSubmit={handleGenerateMusic} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMusicModel('lyria-3-clip-preview')}
                className={`p-3 rounded-xl border text-left font-mono text-xs cursor-pointer ${
                  musicModel === 'lyria-3-clip-preview' ? 'bg-[#ff4dfa]/15 border-[#ff4dfa] text-white' : 'bg-[#121726] border-[#252d40] text-[#a0a5b5]'
                }`}
              >
                <div className="font-bold text-[#ffabf3]">Lyria Clip (lyria-3-clip-preview)</div>
                <div className="text-[11px] opacity-80">Clips rápidos de hasta 30 segundos</div>
              </button>
              <button
                type="button"
                onClick={() => setMusicModel('lyria-3-pro-preview')}
                className={`p-3 rounded-xl border text-left font-mono text-xs cursor-pointer ${
                  musicModel === 'lyria-3-pro-preview' ? 'bg-[#ff4dfa]/15 border-[#ff4dfa] text-white' : 'bg-[#121726] border-[#252d40] text-[#a0a5b5]'
                }`}
              >
                <div className="font-bold text-[#15ffd1]">Lyria Pro (lyria-3-pro-preview)</div>
                <div className="text-[11px] opacity-80">Pistas musicales completas</div>
              </button>
            </div>
            <textarea
              rows={3}
              value={musicPrompt}
              onChange={(e) => setMusicPrompt(e.target.value)}
              placeholder="Describe estilo, tempo, instrumentos y atmósfera..."
              className="w-full bg-[#121726] border border-[#252d40] rounded-xl p-3 text-xs font-mono text-white"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4dfa] to-[#00f0ff] text-[#05080f] font-mono text-xs font-black flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
              <span>{isLoading ? 'Componiendo con Lyria...' : 'Generar Música'}</span>
            </button>

            {musicResult && (
              <div className="p-4 rounded-xl bg-[#090c14] border border-[#ff4dfa]/40 space-y-3">
                <audio src={musicResult.audioDataUrl} controls className="w-full" />
                {musicResult.lyrics && (
                  <pre className="text-xs font-mono text-[#cfd7e6] whitespace-pre-wrap">{musicResult.lyrics}</pre>
                )}
              </div>
            )}
          </form>
        )}

        {mode === 'image' && (
          <form onSubmit={handleGenerateImage} className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="px-3 py-2 rounded-xl bg-[#121726] border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>{editSourceImage ? 'Cambiar imagen base (Edición)' : 'Subir imagen para editar (Opcional)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) setEditSourceImage(await fileToBase64(f));
                  }}
                />
              </label>
              {editSourceImage && (
                <button
                  type="button"
                  onClick={() => setEditSourceImage(null)}
                  className="text-xs font-mono text-[#ffabf3] cursor-pointer"
                >
                  Quitar imagen base
                </button>
              )}
              <select
                value={imageAspect}
                onChange={(e) => setImageAspect(e.target.value as typeof imageAspect)}
                className="bg-[#121726] border border-[#252d40] rounded-xl px-3 py-2 text-xs font-mono text-white"
              >
                <option value="1:1">1:1 (Cuadrada)</option>
                <option value="16:9">16:9 (Panorámica)</option>
                <option value="9:16">9:16 (Vertical)</option>
                <option value="3:4">3:4 (Portada)</option>
              </select>
            </div>
            <textarea
              rows={3}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="Describe la imagen a crear o las modificaciones sobre la imagen subida..."
              className="w-full bg-[#121726] border border-[#252d40] rounded-xl p-3 text-xs font-mono text-white"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#15ffd1] text-[#05080f] font-mono text-xs font-black flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              <span>{isLoading ? 'Renderizando con Nano Banana 2.1...' : 'Crear / Editar Imagen'}</span>
            </button>

            {generatedImageUrl && (
              <div className="p-4 rounded-xl bg-[#090c14] border border-[#00f0ff]/40 space-y-3">
                <img src={generatedImageUrl} alt="Resultado Nano Banana 2.1" className="max-h-80 rounded-xl mx-auto" />
                <a
                  href={generatedImageUrl}
                  download="magnopvs-nano-banana.png"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-mono"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Imagen</span>
                </a>
              </div>
            )}
          </form>
        )}

        {mode === 'video' && (
          <form onSubmit={handleAnimateVideo} className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="px-4 py-2 rounded-xl bg-[#121726] border border-[#15ffd1]/50 text-[#15ffd1] text-xs font-mono font-bold cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>{videoPhoto ? 'Cambiar Foto Base' : 'Subir Foto para Animar'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) setVideoPhoto(await fileToBase64(f));
                  }}
                />
              </label>
              <div className="flex gap-2">
                {(['16:9', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setVideoAspect(ratio)}
                    className={`px-3 py-2 rounded-xl border text-xs font-mono cursor-pointer ${
                      videoAspect === ratio ? 'bg-[#15ffd1]/20 border-[#15ffd1] text-[#15ffd1] font-bold' : 'bg-[#121726] border-[#252d40] text-[#a0a5b5]'
                    }`}
                  >
                    {ratio === '16:9' ? '16:9 Horizontal' : '9:16 Vertical'}
                  </button>
                ))}
              </div>
            </div>

            {videoPhoto && (
              <img src={videoPhoto.dataUrl} alt="Foto base" className="h-32 rounded-xl border border-[#252d40] object-cover" />
            )}

            <textarea
              rows={3}
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="Describe el movimiento de cámara, luz y acción..."
              className="w-full bg-[#121726] border border-[#252d40] rounded-xl p-3 text-xs font-mono text-white"
            />
            <button
              type="submit"
              disabled={isLoading || !videoPhoto}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#15ffd1] to-[#00a3ff] text-[#05080f] font-mono text-xs font-black flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
              <span>{isLoading ? 'Animando con Omni Flash...' : 'Animar Foto a Video'}</span>
            </button>

            {generatedVideoUrl && (
              <div className="p-4 rounded-xl bg-[#090c14] border border-[#15ffd1]/40 space-y-3">
                <video src={generatedVideoUrl} controls autoPlay loop className="max-h-80 rounded-xl mx-auto" />
                <a
                  href={generatedVideoUrl}
                  download="magnopvs-omni-video.mp4"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15ffd1]/20 text-[#15ffd1] text-xs font-mono"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Video</span>
                </a>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
