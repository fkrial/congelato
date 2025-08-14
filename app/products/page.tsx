// app/products/page.tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-gray-900">Nuestro Catálogo</h1>
            <p className="text-lg text-gray-600 mt-2">Explora todas nuestras creaciones artesanales.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <ProductFilters />
            </aside>
            <section className="lg:col-span-3">
              <ProductGrid />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}