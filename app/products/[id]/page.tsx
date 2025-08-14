import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductDetail } from "@/components/products/product-detail";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <ProductDetail productId={params.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}