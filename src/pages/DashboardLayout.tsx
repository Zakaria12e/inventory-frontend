import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Package,
  Layers,
  ClipboardList,
  Users,
  AlertTriangle,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Home,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import AlertBell from "@/pages/Alerts/AlertBell";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const colorMap: Record<string, string> = {
    "bg-red-500": "#ef4444",
    "bg-green-500": "#22c55e",
    "bg-blue-500": "#3b82f6",
    "bg-yellow-500": "#eab308",
    "bg-purple-500": "#8b5cf6",
    "bg-pink-500": "#ec4899",
    "bg-orange-500": "#f97316",
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  // ✅ Sidebar routes
  const routes = [
    {
      to: "/dashboard",
      label: t("sidebar.dashboard"),
      icon: Home,
      color: "text-indigo-400 dark:text-indigo-300",
      visible: true,
    },
    {
      to: "/dashboard/inventory",
      label: t("sidebar.inventory"),
      icon: Package,
      color: "text-fuchsia-400 dark:text-fuchsia-300",
      visible: true,
    },
    {
      to: "/dashboard/containers",
      label: t("sidebar.containers"),
      icon: "image",
      image:
        "https://res.cloudinary.com/dectxiuco/image/upload/v1765975240/recipient-removebg-preview_hofbfv.png",
      visible: true,
    },

    {
      to: "/dashboard/categories",
      label: t("sidebar.categories"),
      icon: Layers,
      color: "text-lime-400 dark:text-lime-300",
      visible: true,
    },
    {
      to: "/dashboard/alerts",
      label: t("sidebar.alerts"),
      icon: AlertTriangle,
      color: "text-destructive dark:text-destructive",
      visible: true,
    },
    {
      to: "/dashboard/reports",
      label: t("sidebar.reports"),
      icon: FileText,
      color: "text-cyan-600 dark:text-cyan-400",
      visible: true,
    },
    {
      to: "/dashboard/users",
      label: t("sidebar.users"),
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      visible: ["admin", "superadmin"].includes(user.role),
    },
    {
      to: "/dashboard/activity",
      label: t("sidebar.activity"),
      icon: ClipboardList,
      color: "text-amber-600 dark:text-amber-400",
      visible: ["admin", "superadmin"].includes(user.role),
    },
    {
      to: "/dashboard/settings",
      label: t("sidebar.settings"),
      icon: Settings,
      color: "text-slate-600 dark:text-slate-300",
      visible: true,
    },
    {
      to: "/dashboard/support",
      label: t("sidebar.support"),
      icon: HelpCircle,
      color: "text-blue-600 dark:text-blue-400",
      visible: true,
    },
  ];

  // ✅ Breadcrumb logic
  const generateBreadcrumb = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const items: { label: string; href: string; isLast: boolean }[] = [];

    if (segments.length > 1) {
      items.push({
        label: t("sidebar.dashboard"),
        href: "/dashboard",
        isLast: false,
      });
      if (segments[1]) {
        items.push({
          label: t(`sidebar.${segments[1]}`) || segments[1],
          href: pathname,
          isLast: true,
        });
      }
    } else {
      items.push({
        label: t("sidebar.dashboard"),
        href: "/dashboard",
        isLast: true,
      });
    }

    return items;
  };

  const breadcrumbItems = generateBreadcrumb(location.pathname);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        {/* Header */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                    <img
                      src="https://eurohinca.com/wp-content/uploads/2024/01/favicon.png"
                      alt="Logo"
                      className="block dark:hidden"
                    />
                    <img
                      src="https://res.cloudinary.com/dectxiuco/image/upload/v1765063045/euro-darkv-removebg-preview_qq2c0i.png"
                      alt="Logo Dark"
                      className="hidden dark:block"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">EUROHINCA</span>
                    <span className="truncate text-xs">Inventory System</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Sidebar Menu */}
        <SidebarContent>
          {/* Overview Section */}
          <SidebarGroup>
            <SidebarGroupLabel>{t("sidebar.overview")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes
                  .filter((r) => r.to === "/dashboard" && r.visible)
                  .map((route) => {
                    const Icon = route.icon;
                    const isActive = location.pathname === route.to;
                    return (
                      <SidebarMenuItem key={route.to}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={route.to}>
                            <Icon className={cn("size-4", route.color)} />
                            <span>{route.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Inventory Management Section */}
          <SidebarGroup>
            <SidebarGroupLabel>{t("sidebar.inventory-man")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes
                  .filter(
                    (r) =>
                      [
                        "/dashboard/inventory",
                        "/dashboard/containers",
                        "/dashboard/categories",
                      ].includes(r.to) && r.visible
                  )
                  .map((route) => {
                    const isActive = location.pathname === route.to;
                    return (
                      <SidebarMenuItem key={route.to}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={route.to}>
                            {route.icon === "image" ? (
                              <img
                                src={route.image}
                                alt={route.label}
                                className="h-4 w-4 object-contain opacity-80 dark:opacity-90"
                              />
                            ) : (
                              <route.icon
                                className={cn("size-4", route.color)}
                              />
                            )}

                            <span>{route.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Monitoring Section */}
          <SidebarGroup>
            <SidebarGroupLabel>{t("sidebar.monitoring")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes
                  .filter(
                    (r) =>
                      [
                        "/dashboard/alerts",
                        "/dashboard/reports",
                        "/dashboard/activity",
                      ].includes(r.to) && r.visible
                  )
                  .map((route) => {
                    const Icon = route.icon;
                    const isActive = location.pathname === route.to;
                    return (
                      <SidebarMenuItem key={route.to}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={route.to}>
                            <Icon className={cn("size-4", route.color)} />
                            <span>{route.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Administration Section */}
          <SidebarGroup>
            <SidebarGroupLabel>{t("sidebar.administration")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes
                  .filter(
                    (r) =>
                      [
                        "/dashboard/users",
                        "/dashboard/settings",
                        "/dashboard/support",
                      ].includes(r.to) && r.visible
                  )
                  .map((route) => {
                    const Icon = route.icon;
                    const isActive = location.pathname === route.to;
                    return (
                      <SidebarMenuItem key={route.to}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={route.to}>
                            <Icon className={cn("size-4", route.color)} />
                            <span>{route.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer / User Info */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={`${user.profile_image}`}
                        alt={user.first_name}
                      />
                      <AvatarFallback
                        style={{
                          backgroundColor: colorMap[user.avatarColor],
                          color: "white",
                        }}
                        className="rounded-lg"
                      >
                        {user?.first_name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.first_name} {user.last_name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      {t("sidebar.profile-settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("sidebar.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Topbar + Content */}
      <SidebarInset>
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.href}>
                    <BreadcrumbItem className="hidden md:block">
                      {item.isLast ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <AlertBell />
            <ModeToggle />
          </div>
        </motion.header>

        <main className="flex flex-1 flex-col p-0 pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
