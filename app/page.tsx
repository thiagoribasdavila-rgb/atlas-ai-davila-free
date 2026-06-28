"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;

    redirected.current = true;
    router.replace("/dashboard");
  }, [router]);

  return (
    <div style={{ padding: 40 }}>
      <p>Redirecionando...</p>
    </div>
  );
}
