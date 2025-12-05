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
const API_URL = import.meta.env.VITE_API_URL

export default function DashboardLayout({ children,}: { children: React.ReactNode;}) {

 const { user, loading , logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      label: "Dashboard",
      icon: Home,
      color: "text-indigo-400 dark:text-indigo-300",
      visible: true,
    },
    {
      to: "/dashboard/inventory",
      label: "Inventory",
      icon: Package,
      color: "text-fuchsia-400 dark:text-fuchsia-300",
      visible: true,
    },
    {
      to: "/dashboard/categories",
      label: "Categories",
      icon: Layers,
      color: "text-lime-400 dark:text-lime-300",
      visible: true,
    },
    {
      to: "/dashboard/alerts",
      label: "Alerts",
      icon: AlertTriangle,
      color: "text-destructive dark:text-destructive",
      visible: true,
    },
    {
      to: "/dashboard/reports",
      label: "Reports",
      icon: FileText,
      color: "text-cyan-600 dark:text-cyan-400",
      visible: true,
    },
    {
      to: "/dashboard/users",
      label: "Users",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      visible: ["admin", "superadmin"].includes(user.role),
    },
    {
      to: "/dashboard/activity",
      label: "Activity Feed",
      icon: ClipboardList,
      color: "text-amber-600 dark:text-amber-400",
      visible: ["admin", "superadmin"].includes(user.role),
    },
    {
      to: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      color: "text-slate-600 dark:text-slate-300",
      visible: true,
    },
    {
      to: "/dashboard/support",
      label: "Support",
      icon: HelpCircle,
      color: "text-blue-600 dark:text-blue-400",
      visible: true,
    },
  ];

  // ✅ Breadcrumb logic
  const generateBreadcrumb = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbItems = [];

    if (segments.length > 1) {
      breadcrumbItems.push({
        label: "Dashboard",
        href: "/dashboard",
        isLast: false,
      });
      if (segments[1]) {
        const label =
          segments[1].charAt(0).toUpperCase() + segments[1].slice(1);
        breadcrumbItems.push({
          label: label.replace("-", " "),
          href: pathname,
          isLast: true,
        });
      }
    } else {
      breadcrumbItems.push({
        label: "Dashboard",
        href: "/dashboard",
        isLast: true,
      });
    }
    return breadcrumbItems;
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
                      src="/logo-black.png"
                      alt="Logo"
                      className="block dark:hidden"
                    />
                    <img
                      src="/logo-black.png"
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
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
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
            <SidebarGroupLabel>Inventory Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes
                  .filter(
                    (r) =>
                      ["/dashboard/inventory", "/dashboard/categories"].includes(
                        r.to
                      ) && r.visible
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

          {/* Monitoring Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
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
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
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
                        src={`${API_URL}${user.profile_image}`}
                        alt={user.first_name}
                      />
<AvatarFallback style={{ backgroundColor: colorMap[user.avatarColor], color: "white" }} className="rounded-lg">
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
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
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