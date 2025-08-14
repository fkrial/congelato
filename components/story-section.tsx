import { Users, Award, Clock, Heart } from "lucide-react"

export function StorySection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Story Content */}
          <div>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-gray-900 mb-6">
              Tres Generaciones de
              <span className="text-primary"> Tradición</span>
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Desde 1952, nuestra familia se ha levantado con el sol y el aroma del pan fresco. Lo que comenzó como un
              pequeño horno de barrio se ha convertido en una tradición que trasciende generaciones.
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Cada receta ha sido perfeccionada a lo largo de los años, manteniendo los métodos tradicionales mientras
              incorporamos las mejores técnicas modernas. Nuestro compromiso con la calidad y la frescura permanece
              inquebrantable.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="font-bold text-2xl text-gray-900">70+</div>
                <div className="text-sm text-gray-600">Años de experiencia</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="font-bold text-2xl text-gray-900">3</div>
                <div className="text-sm text-gray-600">Generaciones</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="font-bold text-2xl text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Productos únicos</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div className="font-bold text-2xl text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Familias satisfechas</div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/placeholder.svg?height=250&width=200"
                  alt="Panadería original 1952"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt="Técnicas artesanales"
                  className="w-full h-36 object-cover rounded-lg shadow-md"
                />
              </div>

              <div className="space-y-4 mt-8">
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt="Familia de panaderos"
                  className="w-full h-36 object-cover rounded-lg shadow-md"
                />
                <img
                  src="/placeholder.svg?height=250&width=200"
                  alt="Panadería moderna"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full -z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
