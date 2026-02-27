import { useState, type FormEvent } from 'react';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import type { Product } from '@/types/product';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
}

const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [quantity, setQuantity] = useState(product?.quantity_available?.toString() ?? '');
  const [categoryId, setCategoryId] = useState(product?.category_id?.toString() ?? '');
  const [error, setError] = useState('');

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const isPending = createProduct.isPending || updateProduct.isPending;

  const categoryOptions = (categories ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
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

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      image_url: imageUrl.trim() || undefined,
      price: parseFloat(price),
      quantity_available: parseInt(quantity) || 0,
      category_id: parseInt(categoryId),
    };

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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Input
        id="product-name"
        label="Nazwa produktu"
        placeholder="np. Słuchawki bezprzewodowe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Textarea
        id="product-description"
        label="Opis"
        placeholder="Opisz swój produkt..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <Input
        id="product-image"
        label="URL zdjęcia"
        type="url"
        placeholder="https://example.com/photo.jpg"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      {imageUrl && (
        <div className="h-32 w-32 overflow-hidden rounded-lg border border-brand-200 bg-cream-50">
          <img
            src={imageUrl}
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
          label="Cena (PLN)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <Input
          id="product-quantity"
          label="Ilość dostępna"
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>

      <Select
        id="product-category"
        label="Kategoria"
        placeholder="Wybierz kategorię..."
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
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
