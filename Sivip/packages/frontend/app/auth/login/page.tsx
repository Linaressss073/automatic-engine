import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "AGPV-CR - Iniciar Sesión",
  description: "AGPV-CR - Iniciar sesión",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-blue-950">Iniciar Sesión</h1>
      <p className="text-3xl font-bold">
        Esta atento de tus <span className="text-red-500">paquetes y visitantes</span>
      </p>

      <LoginForm />

    </>
  );
}
