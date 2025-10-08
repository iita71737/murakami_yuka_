"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Complete() {
  const qp = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const t = qp.get("token");
    if (t) {
      localStorage.setItem("strapi_jwt", t);
      router.replace("/blog");
    } else {
      router.replace("/login?error=missing_token");
    }
  }, [qp, router]);
  return <p className="p-6 text-sm">登入完成中…</p>;
}
