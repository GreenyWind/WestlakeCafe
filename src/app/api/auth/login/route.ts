import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "");
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ message: "请输入邮箱和密码。" }, { status: 400 });
  }

  const user = await repository.validateLogin(email, password);

  if (!user) {
    return NextResponse.json({ message: "邮箱或密码不正确。" }, { status: 401 });
  }

  await setSessionCookie(user.id);
  return NextResponse.json(user);
}
