"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils";
import {
  LayoutDashboard,
  Building2,
  Egg,
  Users,
  TrendingUp,
  Feather,
  ChevronRight,
  ChevronLeft,
  Menu,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Farms",
    href: "/farms",
    icon: Building2,
    color: "from-green-500 to-green-600",
  },
  {
    name: "Batches",
    href: "/batches",
    icon: Egg,
    color: "from-orange-500 to-orange-600",
  },
  {
    name: "Vendors",
    href: "/vendors",
    icon: Users,
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Sales",
    href: "/sales",
    icon: TrendingUp,
    color: "from-emerald-500 to-emerald-600",
  },
];

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  onClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div
      className={`${
        collapsed ? "lg:w-20 w-72" : "w-72"
      } h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 shadow-2xl relative overflow-hidden transition-all duration-300`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent" />

      {/* Logo Section */}
      <div className="relative p-8 border-b border-slate-700/50">
        <Link
          href="/"
          className={`flex items-center ${
            collapsed ? "lg:justify-center space-x-3" : "space-x-3"
          } group`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <Feather className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className={collapsed ? "lg:hidden" : ""}>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Poultry Farm
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Management System
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className={`p-6 space-y-3 ${collapsed ? "px-3" : ""}`}>
        {navigation.map((item) => {
          const isActive = isActiveRoute(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group relative flex items-center rounded-2xl text-sm font-medium transition-all duration-300 overflow-hidden",
                collapsed
                  ? "lg:justify-center lg:p-3 space-x-4 px-4 py-4"
                  : "space-x-4 px-4 py-4",
                isActive
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-600/50"
              )}
              title={collapsed ? item.name : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl" />
              )}

              {/* Icon with gradient background */}
              <div
                className={cn(
                  "relative p-2 rounded-xl transition-all duration-300",
                  isActive
                    ? `bg-gradient-to-r ${item.color} shadow-lg`
                    : "bg-slate-700/50 group-hover:bg-slate-600/50"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    isActive
                      ? "text-white"
                      : "text-slate-300 group-hover:text-white"
                  )}
                />
              </div>

              <div className={collapsed ? "lg:hidden" : ""}>
                <div className="flex ">
                  <span className="relative z-10 flex-1">{item.name}</span>

                  {/* Arrow indicator */}
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-all duration-300",
                      isActive
                        ? "text-white transform translate-x-1"
                        : "text-slate-500 group-hover:text-slate-300 group-hover:transform group-hover:translate-x-1"
                    )}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
