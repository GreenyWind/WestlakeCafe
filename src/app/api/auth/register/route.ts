import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");
  const department = String(body?.department ?? "").trim();
  const researchField = String(body?.researchField ?? "").trim();

  if (!name || !email || password.length < 6) {
    return NextResponse.json({ message: "请填写姓名、邮箱和至少 6 位密码。" }, { status: 400 });
  }

  try {
    const user = await repository.createUser({
      name,
      email,
      password,
      department,
      researchField
    });

    await setSessionCookie(user.id);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      return NextResponse.json({ message: "这个邮箱已经注册。" }, { status: 409 });
    }

    return NextResponse.json({ message: "注册失败。" }, { status: 500 });
  }
}
