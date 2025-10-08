'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

export default function GoogleRedirect() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    (async () => {
      // 1) 官方會把 Google 的 id_token / access_token 帶在當前 URL
      const qs = search.toString();
      if (!qs) {
        router.replace('/login?error=missing_query');
        return;
      }

      try {
        // 2) 把整串 query 原封不動丟給 Strapi，換回 Strapi JWT
        const url = `${STRAPI}/api/auth/google/callback?${qs}`;
        const res = await fetch(url, { method: 'GET', credentials: 'include' });
        if (!res.ok) throw new Error(`Strapi callback failed: ${res.status}`);
        const data = await res.json();

        if (data?.jwt && data.jwt.split('.').length === 3) {
          // 3) 開發期：暫存到 localStorage（上線建議改 HttpOnly Cookie）
          localStorage.setItem('strapi_jwt', data.jwt);
          router.replace('/Blog');
          return;
        }
        throw new Error('No Strapi JWT in response');
      } catch (e) {
        console.error(e);
        router.replace('/login?error=oauth_failed');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p className="p-6">Finalizing sign-in…</p>;
}
