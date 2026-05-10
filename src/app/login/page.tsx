import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";
import { getCurrentUser } from "@/lib/session";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="auth-page">
      <LoginForm />
      <p className="muted" style={{ marginTop: 16 }}>
        还没有账号？ <Link href="/register">注册</Link>
      </p>
    </main>
  );
}
