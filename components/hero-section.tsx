import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Award, Heart } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/placeholder.svg?height=800&width=1200"
          alt="Panadería artesanal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Horneado Fresco
            <br />
            <span className="text-yellow-200">Cada Mañana</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            De nuestra familia a la tuya. Experimenta la calidez de la tradición, donde sea que estés.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-50 text-lg px-8 py-3">
              Comprar Hoy
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3 bg-transparent"
            >
              Explorar Mayorista
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fresco Diario</h3>
              <p className="text-white/80 text-sm">Horneamos desde las 4 AM para garantizar frescura</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Calidad Premium</h3>
              <p className="text-white/80 text-sm">Ingredientes seleccionados y técnicas tradicionales</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Tradición Familiar</h3>
              <p className="text-white/80 text-sm">Tres generaciones de experiencia y amor por el pan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
