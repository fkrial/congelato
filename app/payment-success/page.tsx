// app/payment-success/page.tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-8">
            <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
            <h1 className="mt-6 text-3xl font-serif font-bold text-gray-900">¡Pago Exitoso!</h1>
            <p className="mt-4 text-lg text-gray-600">
                Gracias por tu compra. Hemos recibido tu pedido y lo estamos preparando.
            </p>
            <p className="mt-2 text-gray-500">
                Recibirás una confirmación por email en breve.
            </p>
            <Button asChild className="mt-8 bg-primary text-white hover:bg-primary/90">
                <Link href="/products">Seguir Comprando</Link>
            </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}