"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Cookies from "js-cookie";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.replace("/login");
  };

  return (
    <div className="w-full bg-white border-b shadow-sm px-4 py-3 flex justify-between items-center z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Trip GIS App</h1>
      </div>

      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList></NavigationMenuList>
      </NavigationMenu>

      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
