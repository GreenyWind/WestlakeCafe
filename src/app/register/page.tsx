import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/forms/register-form";
import { sanitizeNextPath } from "@/lib/navigation";
import { getCurrentUser } from "@/lib/session";

type RegisterSearchParams = Promise<{ next?: string }>;

export default async function RegisterPage({
  searchParams
}: {
  searchParams: RegisterSearchParams;
}) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const user = await getCurrentUser();

  if (user) {
    redirect(nextPath);
  }

  return (
    <main className="auth-page">
      <RegisterForm nextPath={nextPath} />
      <p className="muted" style={{ marginTop: 16 }}>
        已经有账号？ <Link href={`/login?next=${encodeURIComponent(nextPath)}`}>登录</Link>
      </p>
    </main>
  );
}
