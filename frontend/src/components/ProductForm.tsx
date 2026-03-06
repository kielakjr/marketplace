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
    const imageUrl = (formData.get('imageUrl') as string).trim();
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
      image_url: imageUrl || undefined,
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

  const [imageUrlPreview, setImageUrlPreview] = useState(product?.image_url ?? '');

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

      <Input
        id="product-image"
        name="imageUrl"
        label="URL zdjęcia"
        type="url"
        placeholder="https://example.com/photo.jpg"
        defaultValue={product?.image_url ?? ''}
        onChange={(e) => setImageUrlPreview(e.target.value)}
      />

      {imageUrlPreview && (
        <div className="h-32 w-32 overflow-hidden rounded-lg border border-brand-200 bg-cream-50">
          <img
            src={imageUrlPreview}
            alt="Podgląd"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

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
