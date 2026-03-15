import { Home, ShoppingCart, User, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";

export type Page = "home" | "mealplan" | "grocery" | "profile";

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: {
  page: Page;
  label: string;
  icon: React.ElementType;
  ocid: string;
}[] = [
  { page: "home", label: "முகப்பு", icon: Home, ocid: "nav.home.link" },
  {
    page: "mealplan",
    label: "உணவு திட்டம்",
    icon: UtensilsCrossed,
    ocid: "nav.mealplan.link",
  },
  {
    page: "grocery",
    label: "மளிகை",
    icon: ShoppingCart,
    ocid: "nav.grocery.link",
  },
  { page: "profile", label: "சுயவிவரம்", icon: User, ocid: "nav.profile.link" },
];

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 shadow-nav"
      style={{ maxWidth: 430, margin: "0 auto", left: 0, right: 0 }}
      aria-label="முக்கிய வழிசெலுத்தல்"
    >
      <div className="bg-card border-t border-border px-2 pb-safe">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map(({ page, label, icon: Icon, ocid }) => {
            const isActive = currentPage === page;
            return (
              <button
                key={page}
                type="button"
                data-ocid={ocid}
                onClick={() => onNavigate(page)}
                className="relative flex flex-col items-center gap-0.5 py-3 px-3 min-w-[64px] transition-colors"
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive
                      ? "bg-primary/15 text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                  style={
                    isActive ? { color: "oklch(0.72 0.18 65)" } : undefined
                  }
                >
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </div>
                <span
                  className={`text-[10px] font-tamil font-medium leading-none ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  style={
                    isActive ? { color: "oklch(0.72 0.18 65)" } : undefined
                  }
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
