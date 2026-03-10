import { useState, useCallback } from 'react';
import { uploadsApi } from '@/api/uploadsApi';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File, onProgress?: (pct: number) => void): Promise<string> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Niedozwolony typ pliku. Dozwolone: JPEG, PNG, WebP, GIF`);
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(`Plik za duży. Maksymalny rozmiar: ${MAX_SIZE_MB}MB`);
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const { uploadUrl, publicUrl } = await uploadsApi.getPresignedUrl(file.type, file.size);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setProgress(pct);
            onProgress?.(pct);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error('Upload do S3 nie powiódł się'));
          }
        };

        xhr.onerror = () => reject(new Error('Błąd sieci podczas uploadu'));
        xhr.send(file);
      });

      return publicUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload nie powiódł się';
      setError(message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadMultiple = useCallback(
    async (files: File[]): Promise<string[]> => {
      return Promise.all(files.map((file) => uploadImage(file)));
    },
    [uploadImage]
  );

  return { uploading, progress, error, uploadImage, uploadMultiple };
}
