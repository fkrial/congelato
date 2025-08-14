// app/cart/page.tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartContents } from "@/components/cart/cart-contents";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-gray-900">Tu Carrito de Compras</h1>
            <p className="text-lg text-gray-600 mt-2">Revisa tus productos y finaliza tu pedido.</p>
          </div>
          <CartContents />
        </div>
      </main>
      <Footer />
    </div>
  );
}