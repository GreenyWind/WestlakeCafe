"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="form-panel stack"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const form = new FormData(event.currentTarget);

        startTransition(async () => {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: form.get("email"),
              password: form.get("password")
            })
          });

          if (!response.ok) {
            setError("邮箱或密码不正确。示例账号：demo@university.edu / demo1234");
            return;
          }

          router.refresh();
          router.push("/");
        });
      }}
    >
      <div>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>登录</h1>
        <p className="muted">进入校内 topic 讨论区。示例账号可直接试用。</p>
      </div>
      {error ? <div className="error">{error}</div> : null}
      <div className="field">
        <label htmlFor="email">邮箱</label>
        <input
          className="input"
          id="email"
          name="email"
          type="email"
          defaultValue="demo@university.edu"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">密码</label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          defaultValue="demo1234"
          required
        />
      </div>
      <button className="button" disabled={pending} type="submit">
        {pending ? "登录中" : "登录"}
      </button>
    </form>
  );
}
