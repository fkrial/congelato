"use client"

import { CreateProductForm } from "@/components/admin/products/create-product-form";

export function NewProductClientPage() {
    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-serif font-bold text-gray-900">Nuevo Producto</h1>
                <p className="text-gray-600">Añade un nuevo producto al catálogo, define sus precios y variantes.</p>
            </div>
            <CreateProductForm />
        </div>
    );
}