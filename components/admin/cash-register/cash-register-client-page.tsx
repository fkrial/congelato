"use client"

import { CashRegisterPanel } from "@/components/admin/cash-register/cash-register-panel";
import { DollarSign } from "lucide-react";

export function CashRegisterClientPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <DollarSign className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Control de Caja</h1>
          <p className="text-gray-600">Gestiona la apertura, cierre y movimientos de caja del día.</p>
        </div>
      </div>
      <CashRegisterPanel />
    </div>
  );
}