import React from 'react';
import {
  Box,
  Music,
  Video,
  Gamepad2,
  BookOpen,
  ShoppingBag,
  Plus,
  Trash2,
  Upload,
  Globe,
  Store,
  Printer,
  Image as ImageIcon,
} from 'lucide-react';
import {
  SagaEnvironment,
  SagaMediaAsset,
  SagaPublication,
  SagaMerchItem,
} from '../../data/sagasData';

interface SagaCreatorMediaTabProps {
  coverImage: string;
  environments: SagaEnvironment[];
  setEnvironments: React.Dispatch<React.SetStateAction<SagaEnvironment[]>>;
  mediaAssets: SagaMediaAsset[];
  setMediaAssets: React.Dispatch<React.SetStateAction<SagaMediaAsset[]>>;
  publications: SagaPublication[];
  setPublications: React.Dispatch<React.SetStateAction<SagaPublication[]>>;
  merchItems: SagaMerchItem[];
  setMerchItems: React.Dispatch<React.SetStateAction<SagaMerchItem[]>>;
  onCompressImage: (file: File) => Promise<string>;
}

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
};

export const SagaCreatorMediaTab: React.FC<SagaCreatorMediaTabProps> = ({
  coverImage,
  environments,
  setEnvironments,
  mediaAssets,
  setMediaAssets,
  publications,
  setPublications,
  merchItems,
  setMerchItems,
  onCompressImage,
}) => {
  const handleAddEnvironment = () => {
    setEnvironments((prev) => [
      ...prev,
      {
        id: `env_${Date.now()}`,
        name: 'Nuevo Escenario / Espacio 3D',
        type: 'space3d',
        url: '',
        description: '',
      },
    ]);
  };

  const handleAddMediaAsset = (kind: SagaMediaAsset['kind']) => {
    setMediaAssets((prev) => [
      ...prev,
      {
        id: `media_${Date.now()}`,
        title:
          kind === 'music'
            ? 'Tema Musical de la Saga'
            : kind === 'video'
              ? 'Tráiler / Cinemática'
              : 'Elemento Interactivo',
        kind,
        url: '',
        description: '',
      },
    ]);
  };

  const handleAddPublication = (format: 'magzine' | 'book') => {
    setPublications((prev) => [
      ...prev,
      {
        id: `pub_${Date.now()}`,
        title: format === 'magzine' ? 'MagZine Oficial #01' : 'Libro Crónicas de la Saga',
        format,
        publisher: 'Nenca Lab Ediciones',
        isbnCode: `NL-${Math.floor(100000 + Math.random() * 900000)}`,
        coverImage,
        synopsis: '',
        contentPreview: '',
        priceMp: format === 'magzine' ? 220 : 480,
        priceUsd: format === 'magzine' ? 12 : 24,
        printOnDemand: true,
        sellInChannel: true,
        sellInGlobalMarketplace: true,
      },
    ]);
  };

  const handleAddMerch = () => {
    setMerchItems((prev) => [
      ...prev,
      {
        id: `merch_${Date.now()}`,
        name: 'Edición Coleccionista / Merch de Saga',
        category: 'Ropa & Coleccionables',
        image: coverImage,
        description: '',
        priceMp: 350,
        priceUsd: 19,
        sellInChannel: true,
        sellInGlobalMarketplace: true,
      },
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. ESCENARIOS: IMAGEN, VIDEO Y ESPACIOS 3D */}
      <div className="bg-[#121726] border border-[#252d40] rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-audiowide text-[#00f0ff] flex items-center gap-2">
              <Box className="w-4 h-4" />
              <span>Escenarios: Imagen, Video y Espacios 3D ({environments.length})</span>
            </h3>
            <p className="text-[11px] font-mono text-[#889299] mt-0.5">
              Sube imágenes de locaciones, videos ambientales o modelos/espacios 3D (.glb, .gltf, WebGL).
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddEnvironment}
            className="px-3 py-1.5 rounded-lg bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Escenario / 3D</span>
          </button>
        </div>

        {environments.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#090c14] border border-dashed border-[#252d40] text-center text-xs font-mono text-[#889299]">
            Aún no hay escenarios cargados. Añade un espacio 3D, video o imagen de escenario.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {environments.map((env, idx) => (
              <div key={env.id} className="bg-[#090c14] border border-[#252d40] rounded-xl p-4 space-y-2.5 relative">
                <button
                  type="button"
                  onClick={() => setEnvironments((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-3 right-3 text-[#889299] hover:text-[#ff4dfa] cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-2 pr-6">
                  <input
                    type="text"
                    value={env.name}
                    onChange={(e) =>
                      setEnvironments((prev) => prev.map((it, i) => (i === idx ? { ...it, name: e.target.value } : it)))
                    }
                    placeholder="Nombre del escenario"
                    className="bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-white"
                  />
                  <select
                    value={env.type}
                    onChange={(e) =>
                      setEnvironments((prev) =>
                        prev.map((it, i) =>
                          i === idx ? { ...it, type: e.target.value as SagaEnvironment['type'] } : it
                        )
                      )
                    }
                    className="bg-[#121726] border border-[#252d40] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#00f0ff]"
                  >
                    <option value="space3d">Espacio 3D (.glb / WebGL)</option>
                    <option value="image">Imagen de Escenario</option>
                    <option value="video">Video de Escenario</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={env.url.startsWith('data:') ? 'Archivo local cargado' : env.url}
                    onChange={(e) =>
                      setEnvironments((prev) => prev.map((it, i) => (i === idx ? { ...it, url: e.target.value } : it)))
                    }
                    placeholder="URL de espacio 3D, video o imagen..."
                    className="flex-1 bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#bdc8cf]"
                  />
                  <label className="px-2.5 py-1.5 rounded-lg bg-[#161b28] border border-[#00f0ff]/40 text-[#00f0ff] text-[11px] font-mono cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir</span>
                    <input
                      type="file"
                      accept={
                        env.type === 'image'
                          ? 'image/*'
                          : env.type === 'video'
                            ? 'video/*'
                            : '.glb,.gltf,image/*'
                      }
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const dataUrl =
                          env.type === 'image' ? await onCompressImage(file) : await readFileAsDataUrl(file);
                        setEnvironments((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, url: dataUrl } : it))
                        );
                      }}
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={env.description}
                  onChange={(e) =>
                    setEnvironments((prev) =>
                      prev.map((it, i) => (i === idx ? { ...it, description: e.target.value } : it))
                    )
                  }
                  placeholder="Descripción atmosférica del escenario..."
                  className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#bdc8cf]"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. MÚSICA, VIDEO Y ELEMENTOS INTERACTIVOS */}
      <div className="bg-[#121726] border border-[#252d40] rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-audiowide text-[#ffabf3] flex items-center gap-2">
              <Music className="w-4 h-4" />
              <span>Música, Video y Elementos Interactivos ({mediaAssets.length})</span>
            </h3>
            <p className="text-[11px] font-mono text-[#889299] mt-0.5">
              Banda sonora oficial, cinemáticas y minijuegos o widgets interactivos de tu saga.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleAddMediaAsset('music')}
              className="px-2.5 py-1.5 rounded-lg bg-[#ff4dfa]/15 border border-[#ff4dfa]/40 text-[#ffabf3] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Music className="w-3.5 h-3.5" />
              <span>+ Música</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddMediaAsset('video')}
              className="px-2.5 py-1.5 rounded-lg bg-[#00a3ff]/15 border border-[#00a3ff]/40 text-[#a2e0ff] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>+ Video</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddMediaAsset('interactive')}
              className="px-2.5 py-1.5 rounded-lg bg-[#15ffd1]/15 border border-[#15ffd1]/40 text-[#15ffd1] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>+ Interactivo</span>
            </button>
          </div>
        </div>

        {mediaAssets.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#090c14] border border-dashed border-[#252d40] text-center text-xs font-mono text-[#889299]">
            Añade pistas musicales, videos o elementos interactivos propios de tu universo.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaAssets.map((asset, idx) => (
              <div key={asset.id} className="bg-[#090c14] border border-[#252d40] rounded-xl p-4 space-y-2.5 relative">
                <button
                  type="button"
                  onClick={() => setMediaAssets((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-3 right-3 text-[#889299] hover:text-[#ff4dfa] cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 pr-6">
                  <span className="px-2 py-0.5 rounded bg-[#161b28] border border-[#252d40] text-[10px] font-mono uppercase text-[#15ffd1]">
                    {asset.kind === 'music' ? 'Música' : asset.kind === 'video' ? 'Video' : 'Interactivo'}
                  </span>
                  <input
                    type="text"
                    value={asset.title}
                    onChange={(e) =>
                      setMediaAssets((prev) => prev.map((it, i) => (i === idx ? { ...it, title: e.target.value } : it)))
                    }
                    placeholder="Título del recurso"
                    className="flex-1 bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={asset.url.startsWith('data:') ? 'Archivo multimedia cargado' : asset.url}
                    onChange={(e) =>
                      setMediaAssets((prev) => prev.map((it, i) => (i === idx ? { ...it, url: e.target.value } : it)))
                    }
                    placeholder="URL de audio, video o experiencia interactiva..."
                    className="flex-1 bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#bdc8cf]"
                  />
                  <label className="px-2.5 py-1.5 rounded-lg bg-[#161b28] border border-[#ff4dfa]/40 text-[#ffabf3] text-[11px] font-mono cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir</span>
                    <input
                      type="file"
                      accept={asset.kind === 'music' ? 'audio/*' : asset.kind === 'video' ? 'video/*' : '.html,.json,.js'}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const dataUrl = await readFileAsDataUrl(file);
                        setMediaAssets((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, url: dataUrl } : it))
                        );
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={asset.description}
                  onChange={(e) =>
                    setMediaAssets((prev) =>
                      prev.map((it, i) => (i === idx ? { ...it, description: e.target.value } : it))
                    )
                  }
                  placeholder="Descripción o instrucciones de interacción..."
                  className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#bdc8cf]"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. NENCA LAB EDICIONES: MAGZINES & LIBROS DE SAGA */}
      <div className="bg-gradient-to-br from-[#121726] to-[#1a1026] border border-amber-400/40 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-audiowide text-amber-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Nenca Lab Ediciones · MagZines y Libros de Saga ({publications.length})</span>
            </h3>
            <p className="text-[11px] font-mono text-[#cfd7e6] mt-0.5">
              Crea o sube tus MagZines y Libros impresos y publicados por <strong className="text-amber-300">Nenca Lab Ediciones</strong> para vender en tu canal/perfil y en el Marketplace Global.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleAddPublication('magzine')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ MagZine</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddPublication('book')}
              className="px-3 py-1.5 rounded-lg bg-[#15ffd1]/15 border border-[#15ffd1]/50 text-[#15ffd1] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Libro</span>
            </button>
          </div>
        </div>

        {publications.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#090c14] border border-dashed border-amber-400/30 text-center text-xs font-mono text-[#a0a5b5]">
            Crea tu primer MagZine o Libro con el sello editorial Nenca Lab Ediciones.
          </div>
        ) : (
          <div className="space-y-4">
            {publications.map((pub, idx) => (
              <div key={pub.id} className="bg-[#090c14] border border-amber-400/30 rounded-xl p-4 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => setPublications((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-3 right-3 text-[#889299] hover:text-[#ff4dfa] cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex flex-wrap items-center gap-2 pr-6">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold uppercase">
                    {pub.format === 'magzine' ? 'MagZine' : 'Libro'} · Nenca Lab Ediciones
                  </span>
                  <span className="text-[10px] font-mono text-[#889299]">ISBN/Ref: {pub.isbnCode}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <div className="md:col-span-3 space-y-2">
                    <img
                      src={pub.coverImage || coverImage}
                      alt={pub.title}
                      className="w-full h-28 object-cover rounded-lg border border-[#252d40]"
                    />
                    <label className="w-full py-1.5 rounded-lg bg-[#161b28] border border-amber-400/40 text-amber-200 text-[11px] font-mono cursor-pointer flex items-center justify-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Portada</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const dataUrl = await onCompressImage(file);
                          setPublications((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, coverImage: dataUrl } : it))
                          );
                        }}
                      />
                    </label>
                  </div>

                  <div className="md:col-span-9 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={pub.title}
                        onChange={(e) =>
                          setPublications((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, title: e.target.value } : it))
                          )
                        }
                        placeholder="Título del MagZine o Libro"
                        className="sm:col-span-1 bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-white"
                      />
                      <div className="flex items-center gap-1.5 bg-[#121726] border border-[#252d40] rounded-lg px-2.5 py-1.5">
                        <span className="text-[10px] font-mono text-[#15ffd1]">MP</span>
                        <input
                          type="number"
                          min={0}
                          value={pub.priceMp}
                          onChange={(e) =>
                            setPublications((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, priceMp: Number(e.target.value) || 0 } : it))
                            )
                          }
                          className="w-full bg-transparent text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#121726] border border-[#252d40] rounded-lg px-2.5 py-1.5">
                        <span className="text-[10px] font-mono text-amber-300">USD $</span>
                        <input
                          type="number"
                          min={0}
                          value={pub.priceUsd}
                          onChange={(e) =>
                            setPublications((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, priceUsd: Number(e.target.value) || 0 } : it))
                            )
                          }
                          className="w-full bg-transparent text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={pub.synopsis}
                      onChange={(e) =>
                        setPublications((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, synopsis: e.target.value } : it))
                        )
                      }
                      placeholder="Sinopsis editorial de la publicación..."
                      className="w-full bg-[#121726] border border-[#252d40] rounded-lg p-2 text-xs font-mono text-[#bdc8cf]"
                    />

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                      <label className="flex items-center gap-1.5 text-amber-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pub.printOnDemand}
                          onChange={(e) =>
                            setPublications((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, printOnDemand: e.target.checked } : it))
                            )
                          }
                          className="accent-amber-400"
                        />
                        <Printer className="w-3.5 h-3.5" />
                        <span>Impresión Nenca Lab Ediciones</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-[#a2e0ff] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pub.sellInChannel}
                          onChange={(e) =>
                            setPublications((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, sellInChannel: e.target.checked } : it))
                            )
                          }
                          className="accent-[#00a3ff]"
                        />
                        <Store className="w-3.5 h-3.5" />
                        <span>Vender en mi Canal / Perfil</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-[#15ffd1] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pub.sellInGlobalMarketplace}
                          onChange={(e) =>
                            setPublications((prev) =>
                              prev.map((it, i) =>
                                i === idx ? { ...it, sellInGlobalMarketplace: e.target.checked } : it
                              )
                            )
                          }
                          className="accent-[#15ffd1]"
                        />
                        <Globe className="w-3.5 h-3.5" />
                        <span>Publicar en Marketplace Global</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. MERCHANDISING DE LA SAGA */}
      <div className="bg-[#121726] border border-[#15ffd1]/30 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-audiowide text-[#15ffd1] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Merchandising de la Saga ({merchItems.length})</span>
            </h3>
            <p className="text-[11px] font-mono text-[#889299] mt-0.5">
              Vende camisetas, pósters, figuras o coleccionables en tu perfil y en el Marketplace Global.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddMerch}
            className="px-3 py-1.5 rounded-lg bg-[#15ffd1]/15 border border-[#15ffd1]/40 text-[#15ffd1] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Merch</span>
          </button>
        </div>

        {merchItems.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#090c14] border border-dashed border-[#252d40] text-center text-xs font-mono text-[#889299]">
            Agrega productos de merchandising oficiales para tu saga.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {merchItems.map((m, idx) => (
              <div key={m.id} className="bg-[#090c14] border border-[#252d40] rounded-xl p-4 space-y-2.5 relative">
                <button
                  type="button"
                  onClick={() => setMerchItems((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-3 right-3 text-[#889299] hover:text-[#ff4dfa] cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 pr-6">
                  <img
                    src={m.image || coverImage}
                    alt={m.name}
                    className="w-14 h-14 object-cover rounded-lg border border-[#252d40] shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) =>
                        setMerchItems((prev) => prev.map((it, i) => (i === idx ? { ...it, name: e.target.value } : it)))
                      }
                      placeholder="Nombre del producto"
                      className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-2.5 py-1 text-xs font-mono text-white"
                    />
                    <div className="flex items-center gap-2">
                      <label className="px-2 py-1 rounded bg-[#161b28] border border-[#15ffd1]/40 text-[#15ffd1] text-[10px] font-mono cursor-pointer flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>Imagen</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const dataUrl = await onCompressImage(file);
                            setMerchItems((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, image: dataUrl } : it))
                            );
                          }}
                        />
                      </label>
                      <input
                        type="number"
                        value={m.priceMp}
                        onChange={(e) =>
                          setMerchItems((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, priceMp: Number(e.target.value) || 0 } : it))
                          )
                        }
                        className="w-20 bg-[#121726] border border-[#252d40] rounded px-2 py-1 text-[11px] font-mono text-[#15ffd1]"
                        title="Precio MP"
                      />
                      <input
                        type="number"
                        value={m.priceUsd}
                        onChange={(e) =>
                          setMerchItems((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, priceUsd: Number(e.target.value) || 0 } : it))
                          )
                        }
                        className="w-16 bg-[#121726] border border-[#252d40] rounded px-2 py-1 text-[11px] font-mono text-amber-300"
                        title="Precio USD"
                      />
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  value={m.description}
                  onChange={(e) =>
                    setMerchItems((prev) =>
                      prev.map((it, i) => (i === idx ? { ...it, description: e.target.value } : it))
                    )
                  }
                  placeholder="Descripción del merch..."
                  className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#bdc8cf]"
                />
                <div className="flex flex-wrap gap-3 text-[11px] font-mono">
                  <label className="flex items-center gap-1.5 text-[#a2e0ff] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={m.sellInChannel}
                      onChange={(e) =>
                        setMerchItems((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, sellInChannel: e.target.checked } : it))
                        )
                      }
                      className="accent-[#00a3ff]"
                    />
                    <span>Canal / Perfil</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[#15ffd1] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={m.sellInGlobalMarketplace}
                      onChange={(e) =>
                        setMerchItems((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, sellInGlobalMarketplace: e.target.checked } : it))
                        )
                      }
                      className="accent-[#15ffd1]"
                    />
                    <span>Marketplace Global</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
