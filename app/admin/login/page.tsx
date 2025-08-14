import { LoginForm } from "@/components/admin/login-form"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-serif font-bold text-gray-900">Panel Administrativo</h2>
          <p className="mt-2 text-sm text-gray-600">Accede a tu cuenta para gestionar la panadería</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
