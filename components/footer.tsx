import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-serif font-bold text-xl">Panadería Artesanal</span>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Tres generaciones horneando con amor y tradición. Calidad premium desde 1952.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Nuestros Productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Nuestra Historia
                </Link>
              </li>
              <li>
                <Link href="/mayorista" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Ventas Mayoristas
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Calle del Pan 123
                  <br />
                  28001 Madrid, España
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-gray-400 text-sm">+34 91 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@panaderia.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Horarios</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <div className="text-white font-medium">Lun - Vie</div>
                  <div className="text-gray-400">6:00 - 20:00</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <div className="text-white font-medium">Sábados</div>
                  <div className="text-gray-400">6:00 - 18:00</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <div className="text-white font-medium">Domingos</div>
                  <div className="text-gray-400">7:00 - 14:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 Panadería Artesanal. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
