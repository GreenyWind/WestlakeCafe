"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { IDENTITY_OPTIONS, SCHOOL_OPTIONS } from "@/lib/user-profile-options";

export function RegisterForm({ nextPath = "/" }: { nextPath?: string }) {
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
        const schools = form.getAll("schools");

        startTransition(async () => {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.get("name"),
              email: form.get("email"),
              password: form.get("password"),
              identity: form.get("identity"),
              schools,
              researchField: form.get("researchField")
            })
          });

          if (!response.ok) {
            const data = await response.json().catch(() => null);
            setError(data?.message ?? "注册失败，请稍后再试。");
            return;
          }

          router.push(nextPath);
          router.refresh();
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
        <label htmlFor="identity">身份</label>
        <select className="select" id="identity" name="identity" defaultValue="不设置">
          {IDENTITY_OPTIONS.map((identity) => (
            <option key={identity} value={identity}>
              {identity}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>学院</label>
        <div className="choice-grid">
          {SCHOOL_OPTIONS.map((school) => (
            <label className="chip selectable-chip" key={school}>
              <input name="schools" type="checkbox" value={school} />
              {school}
            </label>
          ))}
        </div>
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
