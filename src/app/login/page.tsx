import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";
import { sanitizeNextPath } from "@/lib/navigation";
import { getCurrentUser } from "@/lib/session";

type LoginSearchParams = Promise<{ next?: string }>;

export default async function LoginPage({
  searchParams
}: {
  searchParams: LoginSearchParams;
}) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const user = await getCurrentUser();

  if (user) {
    redirect(nextPath);
  }

  return (
    <main className="auth-page">
      <LoginForm nextPath={nextPath} />
      <p className="muted" style={{ marginTop: 16 }}>
        还没有账号？ <Link href={`/register?next=${encodeURIComponent(nextPath)}`}>注册</Link>
      </p>
    </main>
  );
}
