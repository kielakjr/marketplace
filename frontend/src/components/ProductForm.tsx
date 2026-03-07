import { useState, useTransition } from 'react';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import type { Product } from '@/types/product';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useAppSelector } from '@/store/hooks';

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
}

const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const isEditing = !!product;

  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const categoryOptions = (categories ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

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

    const payload = {
      name,
      description: description || undefined,
      image_urls: imageUrls.map((u) => u.trim()).filter(Boolean),
      price: parseFloat(price),
      quantity_available: parseInt(quantity) || 0,
      category_id: parseInt(categoryId),
      user_id: user!.id,
    };

    startTransition(async () => {
      try {
        if (isEditing && product) {
          await updateProduct.mutateAsync({ id: product.id, data: payload });
        } else {
          await createProduct.mutateAsync(payload);
        }
        onSuccess();
      } catch {
        setError(isEditing ? 'Nie udało się zaktualizować produktu' : 'Nie udało się dodać produktu');
      }
    });
  };

  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.image_urls?.length ? product.image_urls : ['']
  );

  const addImageUrl = () => setImageUrls((prev) => [...prev, '']);
  const removeImageUrl = (i: number) => setImageUrls((prev) => prev.filter((_, idx) => idx !== i));
  const updateImageUrl = (i: number, val: string) =>
    setImageUrls((prev) => prev.map((url, idx) => (idx === i ? val : url)));

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
        <label className="block text-sm font-medium text-brand-700">Zdjęcia (URL)</label>
        {imageUrls.map((url, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => updateImageUrl(i, e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-brand-800 placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageUrl(i)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {url && (
              <div className="h-20 w-20 overflow-hidden rounded-lg border border-brand-200 bg-cream-50">
                <img
                  src={url}
                  alt="Podgląd"
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        ))}
        {imageUrls.length < 8 && (
          <button
            type="button"
            onClick={addImageUrl}
            className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-800"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj zdjęcie
          </button>
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
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Zapisz zmiany' : 'Dodaj produkt'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
