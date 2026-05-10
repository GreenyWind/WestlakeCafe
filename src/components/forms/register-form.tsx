"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RegisterForm() {
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
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.get("name"),
              email: form.get("email"),
              password: form.get("password"),
              department: form.get("department"),
              researchField: form.get("researchField")
            })
          });

          if (!response.ok) {
            const data = await response.json().catch(() => null);
            setError(data?.message ?? "注册失败，请稍后再试。");
            return;
          }

          router.refresh();
          router.push("/");
        });
      }}
    >
      <div>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>注册</h1>
        <p className="muted">第一版使用简化账号系统，正式校内部署可接统一身份认证。</p>
      </div>
      {error ? <div className="error">{error}</div> : null}
      <div className="field">
        <label htmlFor="name">姓名</label>
        <input className="input" id="name" name="name" required />
      </div>
      <div className="field">
        <label htmlFor="email">校内邮箱</label>
        <input className="input" id="email" name="email" type="email" required />
      </div>
      <div className="field">
        <label htmlFor="password">密码</label>
        <input className="input" id="password" name="password" minLength={6} type="password" required />
      </div>
      <div className="field">
        <label htmlFor="department">院系</label>
        <input className="input" id="department" name="department" />
      </div>
      <div className="field">
        <label htmlFor="researchField">研究方向</label>
        <input className="input" id="researchField" name="researchField" />
      </div>
      <button className="button" disabled={pending} type="submit">
        {pending ? "注册中" : "注册并登录"}
      </button>
    </form>
  );
}
