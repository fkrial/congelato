import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Truck, Users, Calculator } from "lucide-react"

export function WholesaleTeaser() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            ¿Tienes un Negocio?
            <span className="text-primary"> Trabajemos Juntos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ofrecemos soluciones mayoristas personalizadas para restaurantes, cafeterías, hoteles y otros negocios.
            Calidad premium con precios competitivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Precios Mayoristas</h3>
            <p className="text-gray-600 text-sm">Descuentos especiales por volumen y pedidos recurrentes</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Entrega Programada</h3>
            <p className="text-gray-600 text-sm">Entregas puntuales según tu horario de negocio</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Soporte Dedicado</h3>
            <p className="text-gray-600 text-sm">Asesor personal para gestionar tus pedidos</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Facturación Flexible</h3>
            <p className="text-gray-600 text-sm">Términos de pago adaptados a tu flujo de caja</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-serif font-bold text-2xl text-gray-900 mb-4">Solicita tu Cotización Personalizada</h3>
              <p className="text-gray-600 mb-6">
                Cuéntanos sobre tu negocio y te enviaremos una propuesta adaptada a tus necesidades específicas. Sin
                compromiso.
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-700">Análisis gratuito de necesidades</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-700">Propuesta en menos de 24 horas</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-700">Muestras gratuitas disponibles</span>
                </li>
              </ul>

              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Solicitar Cotización
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="relative">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Producción mayorista"
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />

              {/* Stats overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-bold text-lg text-primary">500+</div>
                    <div className="text-xs text-gray-600">Panes/día</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-primary">50+</div>
                    <div className="text-xs text-gray-600">Negocios</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-primary">24h</div>
                    <div className="text-xs text-gray-600">Respuesta</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
