export const IDENTITY_OPTIONS = ["教师", "职工", "研究生", "本科生", "访问人员", "不设置"] as const;

export const SCHOOL_OPTIONS = ["工学院", "理学院", "生命科学院", "医学院", "其它"] as const;

export type IdentityOption = (typeof IDENTITY_OPTIONS)[number];
export type SchoolOption = (typeof SCHOOL_OPTIONS)[number];

export function normalizeIdentity(value: unknown): IdentityOption {
  const identity = typeof value === "string" ? value.trim() : "";
  return IDENTITY_OPTIONS.includes(identity as IdentityOption) ? (identity as IdentityOption) : "不设置";
}

export function normalizeSchools(value: unknown): SchoolOption[] {
  const values = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  const allowed = new Set<string>(SCHOOL_OPTIONS);
  const schools = values
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item): item is SchoolOption => allowed.has(item));

  return Array.from(new Set(schools));
}
