import { cookies } from "next/headers";
import type { PublicUser } from "@/lib/types";
import { repository } from "@/lib/repository";

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "ctl_session";

export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!userId) {
    return null;
  }

  return repository.getPublicUser(userId);
}

export async function requireCurrentUser(): Promise<PublicUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("AUTH_REQUIRED");
  }

  return user;
}

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
