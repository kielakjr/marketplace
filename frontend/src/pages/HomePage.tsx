import { Link } from 'react-router';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

const HomePage = () => {
  const { data: products, isLoading, isError } = useProducts({ limit: 8 });

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-500 px-8 py-20 text-center text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-400" />
          <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-brand-400" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            Witaj w Marketplace
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-200">
            Odkryj tysiące produktów od sprzedawców z całej Polski.
            Kupuj i sprzedawaj w jednym miejscu.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/products">
              <Button size="lg" className="bg-white text-brand-800 hover:bg-cream-50">
                Przeglądaj produkty
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="ghost" size="lg" className="border border-white/30 text-white hover:bg-white/10">
                Zacznij sprzedawać
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-800">Najnowsze produkty</h2>
          <Link to="/products" className="text-sm font-medium text-brand-500 transition-colors hover:text-brand-800">
            Zobacz wszystkie →
          </Link>
        </div>

        {isLoading && <Spinner size="lg" />}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            Nie udało się załadować produktów.
          </div>
        )}
        {products && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
