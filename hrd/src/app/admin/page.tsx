"use client";

import { useEffect } from "next";
import { useRouter } from "next/navigation";

export default function AdminRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
}
