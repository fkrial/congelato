"use client"

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CategoryTable } from "@/components/admin/categories/category-table";

export function CategoriesClientPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600">Gestiona las categorías de tus productos.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/admin/categories/new"><Plus className="w-4 h-4 mr-2" />Nueva Categoría</Link>
        </Button>
      </div>
      <CategoryTable />
    </div>
  );
}