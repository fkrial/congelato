"use client"

import { CreateProductForm } from "@/components/admin/products/create-product-form";

export function EditProductClientPage({ productId }: { productId: string }) {
    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-serif font-bold text-gray-900">Editar Producto</h1>
                <p className="text-gray-600">Modifica los detalles del producto y sus variantes.</p>
            </div>
            <CreateProductForm productId={productId} />
        </div>
    );
}