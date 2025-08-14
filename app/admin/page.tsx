import { redirect } from "next/navigation"

export default function AdminPage() {
  // In a real app, check authentication here
  redirect("/admin/login")
}
