"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  FileText,
  LogOut,
  Building,
  Users,
  Settings,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Globe,
  MapPin,
  Truck,
  Ship,
  Anchor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import supabaseAuthService from "@/lib/services/supabaseAuthService";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/jobs", label: "My Jobs", icon: Briefcase }, // US1, US2, US4 (Yük Sahibi)
  { href: "/quotes", label: "Quotes Received", icon: FileText }, // US2 (Yük Sahibi)
  { href: "/invited-jobs", label: "Invited Jobs", icon: Briefcase }, // US5 (Taşıma Firması)
  { href: "/my-quotes", label: "My Quotes", icon: FileText }, // US6 (Taşıma Firması)
  { href: "/companies", label: "Companies", icon: Building }, // Placeholder for company management
  { href: "/users", label: "Users", icon: Users }, // Placeholder for user management
];

const definitionItems = [
  { href: "/incoterms", label: "Incoterms", icon: Globe },
  { href: "/loading-places", label: "Loading Places", icon: MapPin },
  { href: "/loading-styles", label: "Loading Styles", icon: Truck },
  { href: "/shipping-methods", label: "Shipping Methods", icon: Ship },
  { href: "/ports", label: "Ports", icon: Anchor },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDefinitionsOpen, setIsDefinitionsOpen] = useState(false);

  // Definitions alt menüsündeki herhangi bir sayfa aktifse menü açık kalsın
  const isDefinitionsActive = definitionItems.some(
    (item) => pathname === item.href
  );
  const shouldDefinitionsBeOpen = isDefinitionsOpen || isDefinitionsActive;

  const handleLogout = async () => {
    try {
      // Supabase auth ile çıkış yap
      await supabaseAuthService.logout();

      // Login sayfasına yönlendir
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Hata olsa bile login sayfasına yönlendir
      router.push("/login");
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg">
      <div className="mb-8 flex items-center justify-center">
        <Image
          src="/images/Cargill.png"
          alt="Logo"
          width={120}
          height={40}
          className="object-contain"
        />
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 p-2 rounded-md transition-colors duration-150",
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}

          {/* Definitions Alt Menü */}
          <li>
            <button
              onClick={() => setIsDefinitionsOpen(!isDefinitionsOpen)}
              className={cn(
                "w-full flex items-center space-x-3 p-2 rounded-md transition-colors duration-150",
                isDefinitionsActive
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <FolderOpen className="h-5 w-5" />
              <span className="flex-grow text-left">Definitions</span>
              {shouldDefinitionsBeOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {shouldDefinitionsBeOpen && (
              <ul className="ml-4 mt-2 space-y-1">
                {definitionItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 p-2 rounded-md transition-colors duration-150 text-sm",
                          isActive
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-semibold"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          {/* Settings */}
          <li>
            <Link
              href="/settings"
              className={cn(
                "flex items-center space-x-3 p-2 rounded-md transition-colors duration-150",
                pathname === "/settings"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start space-x-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Çıkış Yap</span>
        </Button>
      </div>
    </aside>
  );
}
