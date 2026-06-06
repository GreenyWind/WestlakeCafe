"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ nextPath = "/" }: { nextPath?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="form-panel stack"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);
        const form = new FormData(event.currentTarget);

        try {
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
            setSubmitting(false);
            return;
          }

          router.push(nextPath);
          router.refresh();
        } catch {
          setError("登录失败，请稍后再试。");
          setSubmitting(false);
        }
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
      <button className="button" disabled={submitting} type="submit">
        {submitting ? "登录中" : "登录"}
      </button>
    </form>
  );
}
