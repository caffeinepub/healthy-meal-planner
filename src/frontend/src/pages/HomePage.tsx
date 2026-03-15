import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Loader2, RefreshCw, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  DEFAULT_BREAKFAST,
  DEFAULT_DINNER,
  DEFAULT_LUNCH,
  HEALTH_GOAL_LABELS,
  MEAL_TYPE_EMOJIS,
  MEAL_TYPE_NAMES,
  getMealData,
} from "../data/mealData";
import {
  useRegenerateMealPlan,
  useUserProfile,
  useWeeklyMealPlan,
} from "../hooks/useQueries";

export function HomePage() {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: mealPlan, isLoading: planLoading } = useWeeklyMealPlan();
  const regenerate = useRegenerateMealPlan();

  const goalInfo = profile?.healthGoal
    ? HEALTH_GOAL_LABELS[profile.healthGoal as string]
    : null;

  const todayPlan = mealPlan?.monday;

  const getTodayMeal = (type: "breakfast" | "lunch" | "dinner") => {
    const mealName = todayPlan?.[type];
    if (!mealName)
      return type === "breakfast"
        ? DEFAULT_BREAKFAST
        : type === "lunch"
          ? DEFAULT_LUNCH
          : DEFAULT_DINNER;
    return (
      getMealData(mealName) ||
      (type === "breakfast"
        ? DEFAULT_BREAKFAST
        : type === "lunch"
          ? DEFAULT_LUNCH
          : DEFAULT_DINNER)
    );
  };

  const totalWeeklyCalories = mealPlan
    ? Object.values(mealPlan).reduce((total, day) => {
        const b =
          getMealData(day.breakfast)?.calories || DEFAULT_BREAKFAST.calories;
        const l = getMealData(day.lunch)?.calories || DEFAULT_LUNCH.calories;
        const d = getMealData(day.dinner)?.calories || DEFAULT_DINNER.calories;
        return total + b + l + d;
      }, 0)
    : 0;

  const handleRegenerate = async () => {
    try {
      await regenerate.mutateAsync();
      toast.success("புதிய உணவு திட்டம் தயாராகிவிட்டது!");
    } catch {
      toast.error("மீண்டும் முயற்சிக்கவும்");
    }
  };

  return (
    <div className="app-container" lang="ta">
      {/* Header */}
      <div className="header-gradient px-6 pt-14 pb-8 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-tamil text-white/80 text-sm mb-1">வணக்கம்,</p>
          {profileLoading ? (
            <Skeleton className="h-8 w-40 bg-white/20 rounded-lg mb-2" />
          ) : (
            <h1 className="font-tamil text-3xl font-bold text-white mb-2">
              {profile?.displayName || "நண்பரே"} 👋
            </h1>
          )}
          {goalInfo && (
            <span className="inline-flex items-center gap-1.5 font-tamil text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white">
              {goalInfo.emoji} {goalInfo.label}
            </span>
          )}
        </motion.div>
      </div>

      <div className="px-4 pt-4 pb-24 space-y-4">
        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.72 0.18 65 / 0.15)" }}
              >
                <Flame
                  className="w-4 h-4"
                  style={{ color: "oklch(0.72 0.18 65)" }}
                />
              </div>
              <span className="font-tamil text-xs text-muted-foreground">
                வார கலோரி
              </span>
            </div>
            {planLoading ? (
              <Skeleton className="h-7 w-24 rounded" />
            ) : (
              <p className="font-display text-2xl font-bold text-foreground">
                {totalWeeklyCalories.toLocaleString("ta-IN")}
              </p>
            )}
            <p className="font-tamil text-xs text-muted-foreground mt-0.5">
              கலோரி / வாரம்
            </p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.45 0.12 150 / 0.15)" }}
              >
                <UtensilsCrossed
                  className="w-4 h-4"
                  style={{ color: "oklch(0.45 0.12 150)" }}
                />
              </div>
              <span className="font-tamil text-xs text-muted-foreground">
                உணவு வகைகள்
              </span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">
              21
            </p>
            <p className="font-tamil text-xs text-muted-foreground mt-0.5">
              உணவுகள் / வாரம்
            </p>
          </div>
        </motion.div>

        {/* Regenerate button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Button
            data-ocid="home.regenerate.button"
            onClick={handleRegenerate}
            disabled={regenerate.isPending}
            variant="outline"
            className="w-full h-12 font-tamil font-medium rounded-2xl border-2 flex items-center gap-2"
            style={{
              borderColor: "oklch(0.72 0.18 65)",
              color: "oklch(0.55 0.14 65)",
            }}
          >
            {regenerate.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            உணவு திட்டத்தை மீண்டும் உருவாக்கு
          </Button>
        </motion.div>

        {/* Today's meals */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h2 className="font-tamil text-lg font-bold text-foreground mb-3 leaf-border">
            இன்றைய உணவுகள்
          </h2>
          <div className="space-y-2">
            {(["breakfast", "lunch", "dinner"] as const).map((type) => {
              const meal = getTodayMeal(type);
              return (
                <div
                  key={type}
                  className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3 shadow-xs"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: "oklch(0.72 0.18 65 / 0.1)" }}
                  >
                    {MEAL_TYPE_EMOJIS[type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-tamil text-xs text-muted-foreground">
                      {MEAL_TYPE_NAMES[type]}
                    </p>
                    <p className="font-tamil font-semibold text-foreground text-sm truncate">
                      {planLoading ? (
                        <span className="text-muted-foreground animate-pulse">
                          ஏற்றுகிறோம்...
                        </span>
                      ) : (
                        todayPlan?.[type] || meal.nameTamil
                      )}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="font-tamil text-xs flex-shrink-0 rounded-xl"
                  >
                    {meal.calories} கி
                  </Badge>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Tip card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="rounded-2xl p-4 border border-border"
          style={{ background: "oklch(0.45 0.12 150 / 0.08)" }}
        >
          <p
            className="font-tamil text-sm font-semibold mb-1"
            style={{ color: "oklch(0.35 0.10 150)" }}
          >
            💡 ஆரோக்கிய குறிப்பு
          </p>
          <p className="font-tamil text-sm text-muted-foreground">
            தினமும் குறைந்தது 8 கிளாஸ் தண்ணீர் குடிக்கவும். இது செரிமானத்தை மேம்படுத்தும்.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
