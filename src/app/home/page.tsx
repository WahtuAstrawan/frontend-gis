"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const HomeContent = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get("token")) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1">
        <HomeContent />
      </div>
    </div>
  );
}
