import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Leaf } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BottomNav, type Page } from "./components/BottomNav";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile } from "./hooks/useQueries";
import { AuthPage } from "./pages/AuthPage";
import { GroceryPage } from "./pages/GroceryPage";
import { HomePage } from "./pages/HomePage";
import { MealPlanPage } from "./pages/MealPlanPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ProfilePage } from "./pages/ProfilePage";

function LoadingScreen() {
  return (
    <div className="app-container min-h-dvh flex flex-col items-center justify-center gap-4 spice-pattern">
      <div
        className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-card-lg animate-pulse"
        style={{ background: "oklch(0.72 0.18 65)" }}
      >
        <Leaf className="w-8 h-8" style={{ color: "oklch(0.15 0.02 55)" }} />
      </div>
      <p className="font-tamil text-muted-foreground text-sm">ஏற்றுகிறோம்...</p>
      <div className="space-y-2 w-48">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-2 w-3/4 mx-auto rounded-full" />
      </div>
    </div>
  );
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const isAuthenticated = !!identity;
  const hasProfile = !!profile?.displayName;

  // Show loading while initializing auth
  if (isInitializing) {
    return <LoadingScreen />;
  }

  // Not logged in → show auth
  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <Toaster richColors position="top-center" />
      </>
    );
  }

  // Loading profile check
  if (profileLoading) {
    return <LoadingScreen />;
  }

  // No profile → onboarding
  if (!hasProfile) {
    return (
      <>
        <OnboardingPage />
        <Toaster richColors position="top-center" />
      </>
    );
  }

  // Main app
  const pages: Record<Page, React.ReactNode> = {
    home: <HomePage />,
    mealplan: <MealPlanPage />,
    grocery: <GroceryPage />,
    profile: <ProfilePage />,
  };

  return (
    <>
      <div className="app-container" lang="ta">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {pages[currentPage]}
          </motion.div>
        </AnimatePresence>
        <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>
      <Toaster richColors position="top-center" />
    </>
  );
}
