import type React from "react";
import "@/app/globals.css";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// La importación DEBE SER SIN llaves para que coincida con 'export default'
import AdminLayoutClient from "@/components/admin/admin-layout-client"; 

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const userPayloadString = headersList.get('x-user-payload');

  if (!userPayloadString) {
    redirect('/admin/login');
  }

  const user = JSON.parse(userPayloadString);

  return (
    <AdminLayoutClient user={user}>
      {children}
    </AdminLayoutClient>
  );
}