import { createClient } from '@supabase/supabase-js';

// Get credentials from environment or default fallback
const metaEnv = (import.meta as any).env || {};
const SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || 'https://jlckakyftkzgfgkmmdmc.supabase.co';
const SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsY2tha3lmdGt6Z2Zna21tZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAwMDAwMDAsImV4cCI6MjAwMDA0MDAwMH0.placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Uploads an asset (Avatar, Cover, Background) to Supabase Storage bucket.
 * Fallback to Base64 DataURL if Supabase fails or is unconfigured, ensuring 100% upload success for the user.
 */
export async function uploadProfileMedia(
  file: File,
  folder: 'avatars' | 'covers' | 'backgrounds' = 'avatars'
): Promise<{ url: string; source: 'supabase' | 'local'; message?: string }> {
  // Validate image file (strictly JPG, PNG, GIF)
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

  if (!allowedMimeTypes.includes(file.type.toLowerCase()) && !allowedExtensions.includes(fileExt)) {
    throw new Error('Solo se permiten archivos de imagen en formato JPG, PNG o GIF.');
  }

  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeBytes) {
    throw new Error('La imagen no debe superar los 10 MB de tamaño.');
  }

  const fileName = `${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt || 'png'}`;
  const filePath = `profiles/${folder}/${fileName}`;

  try {
    // Attempt Storage Upload
    const bucketName = 'MagnopVS_Web';
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      if (publicUrlData?.publicUrl) {
        return {
          url: publicUrlData.publicUrl,
          source: 'supabase',
          message: '¡Imagen subida e integrada exitosamente!',
        };
      }
    }
  } catch (err) {
    console.warn('Storage direct upload bypass or unconfigured, converting to Base64:', err);
  }

  // Guaranteed fallback: Base64 FileReader DataURL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve({
          url: reader.result,
          source: 'local',
          message: 'Imagen cargada localmente y guardada en el perfil (Base64).',
        });
      } else {
        reject(new Error('Error al procesar la imagen seleccionada.'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo local.'));
    reader.readAsDataURL(file);
  });
}
