import { WholesalePaymentsContent } from "@/components/admin/orders/wholesale-payments-content";

export default function WholesalePaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pagos Mayoristas</h1>
        <p className="text-gray-600">Gestiona pagos diferidos y términos de crédito</p>
      </div>
      <WholesalePaymentsContent />
    </div>
  );
}