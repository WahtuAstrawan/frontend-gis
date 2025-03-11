"use client";

import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const HomeContent = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1">
        <HomeContent />
      </div>
    </div>
  );
}
