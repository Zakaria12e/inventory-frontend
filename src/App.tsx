import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import DashboardLayout from "@/pages/DashboardLayout";
import DashboardPage from "@/pages/Dashboard/Dashboard";
import InventoryPage from "@/pages/Inventory/InventoryPage";
import CategoriesPage from "@/pages/Categories/CategoriesPage";
import ReportsPage from "@/pages/Reports/ReportsPage";
import UsersPage from "@/pages/Users/UsersPage";
import AlertsPage from "@/pages/Alerts/AlertsPage";
import SettingsPage from "@/pages/Settings/SettingsPage";
import SupportPage from "@/pages/Support/SupportPage";
import LoginPage from "@/pages/login/login";
import ActivityFeed from "@/pages/ActivityFeed/ActivityFeed";
import { LanguageProvider } from "@/context/LanguageContext"

import { AuthProvider } from "@/context/AuthContext";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard/*"
              element={
                <DashboardLayout>
                  <Routes>
                    <Route path="" element={<DashboardPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="activity" element={<ActivityFeed />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="alerts" element={<AlertsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="support" element={<SupportPage />} />
                  </Routes>
                </DashboardLayout>
              }
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
