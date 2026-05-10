import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/forms/register-form";
import { getCurrentUser } from "@/lib/session";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="auth-page">
      <RegisterForm />
      <p className="muted" style={{ marginTop: 16 }}>
        已经有账号？ <Link href="/login">登录</Link>
      </p>
    </main>
  );
}
