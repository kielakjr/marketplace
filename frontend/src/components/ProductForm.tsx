import { useState, useTransition, useRef } from 'react';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useImageUpload } from '@/hooks/useUpload';
import type { Product } from '@/types/product';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface ImageEntry {
  type: 'url' | 'file';
  url: string;
  file?: File;
  preview?: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
}

const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const isEditing = !!product;

  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { uploadImage } = useImageUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions = (categories ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const [images, setImages] = useState<ImageEntry[]>(() => {
    if (product?.image_urls?.length) {
      return product.image_urls.map((url) => ({ type: 'url' as const, url }));
    }
    return [];
  });

  const [uploadingImages, setUploadingImages] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = 8 - images.length;
    const newFiles = Array.from(files).slice(0, remaining);

    const newEntries: ImageEntry[] = newFiles.map((file) => ({
      type: 'file' as const,
      url: '',
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newEntries]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const entry = prev[index];
      if (entry.preview) {
        URL.revokeObjectURL(entry.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleAction = (formData: FormData) => {
    const name = (formData.get('name') as string).trim();
    const description = (formData.get('description') as string).trim();
    const price = formData.get('price') as string;
    const quantity = formData.get('quantity') as string;
    const categoryId = formData.get('categoryId') as string;

    if (!name) {
      setError('Nazwa produktu jest wymagana');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Cena musi być większa od 0');
      return;
    }
    if (!categoryId) {
      setError('Wybierz kategorię');
      return;
    }

    setError('');

    startTransition(async () => {
      try {
        setUploadingImages(true);

        const uploadedUrls: string[] = [];

        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          if (img.type === 'url') {
            uploadedUrls.push(img.url);
          } else if (img.file) {
            const publicUrl = await uploadImage(img.file);
            uploadedUrls.push(publicUrl);
            setImages((prev) =>
              prev.map((entry, j) =>
                j === i ? { ...entry, type: 'url' as const, url: publicUrl } : entry
              )
            );
          }
        }

        setUploadingImages(false);

        const payload = {
          name,
          description: description || undefined,
          image_urls: uploadedUrls.filter(Boolean),
          price: parseFloat(price),
          quantity_available: parseInt(quantity) || 0,
          category_id: parseInt(categoryId),
        };

        if (isEditing && product) {
          await updateProduct.mutateAsync({ id: product.id, data: payload });
        } else {
          await createProduct.mutateAsync(payload);
        }
        onSuccess();
      } catch {
        setUploadingImages(false);
        setError(isEditing ? 'Nie udało się zaktualizować produktu' : 'Nie udało się dodać produktu');
      }
    });
  };

  return (
    <form action={handleAction} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Input
        id="product-name"
        name="name"
        label="Nazwa produktu"
        placeholder="np. Słuchawki bezprzewodowe"
        defaultValue={product?.name ?? ''}
        required
      />

      <Textarea
        id="product-description"
        name="description"
        label="Opis"
        placeholder="Opisz swój produkt..."
        defaultValue={product?.description ?? ''}
        rows={3}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-brand-700">Zdjęcia</label>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-brand-200 bg-cream-50">
                <img
                  src={img.type === 'url' ? img.url : img.preview}
                  alt="Podgląd"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < 8 && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj zdjęcie
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="product-price"
          name="price"
          label="Cena (PLN)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          defaultValue={product?.price?.toString() ?? ''}
          required
        />

        <Input
          id="product-quantity"
          name="quantity"
          label="Ilość dostępna"
          type="number"
          min="0"
          step="1"
          placeholder="0"
          defaultValue={product?.quantity_available?.toString() ?? ''}
          required
        />
      </div>

      <Select
        id="product-category"
        name="categoryId"
        label="Kategoria"
        placeholder="Wybierz kategorię..."
        defaultValue={product?.category_id?.toString() ?? ''}
        options={categoryOptions}
        disabled={categoriesLoading}
        required
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" isLoading={isPending || uploadingImages}>
          {uploadingImages ? 'Przesyłanie zdjęć...' : isEditing ? 'Zapisz zmiany' : 'Dodaj produkt'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
