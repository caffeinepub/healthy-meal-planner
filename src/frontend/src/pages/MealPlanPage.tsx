import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Clock, Flame } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  DAY_KEYS,
  DAY_NAMES,
  DEFAULT_BREAKFAST,
  DEFAULT_DINNER,
  DEFAULT_LUNCH,
  MEAL_TYPE_EMOJIS,
  MEAL_TYPE_NAMES,
  type Recipe,
  getMealData,
} from "../data/mealData";
import { useWeeklyMealPlan } from "../hooks/useQueries";

type DayKey = (typeof DAY_KEYS)[number];

function MealCard({
  mealName,
  type,
  index,
}: {
  mealName: string;
  type: "breakfast" | "lunch" | "dinner";
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const defaultMeal =
    type === "breakfast"
      ? DEFAULT_BREAKFAST
      : type === "lunch"
        ? DEFAULT_LUNCH
        : DEFAULT_DINNER;
  const recipe: Recipe = getMealData(mealName) || {
    ...defaultMeal,
    nameTamil: mealName,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
      className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs"
      data-ocid="mealplan.meal.card"
    >
      {/* Header */}
      <button
        type="button"
        className="w-full p-4 flex items-center gap-3 text-left"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "oklch(0.72 0.18 65 / 0.1)" }}
        >
          {MEAL_TYPE_EMOJIS[type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-tamil text-xs text-muted-foreground">
            {MEAL_TYPE_NAMES[type]}
          </p>
          <p className="font-tamil font-semibold text-foreground text-sm mt-0.5 truncate">
            {mealName || recipe.nameTamil}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-tamil">
              <Flame
                className="w-3 h-3"
                style={{ color: "oklch(0.72 0.18 65)" }}
              />
              {recipe.calories} கலோரி
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-tamil">
              <Clock className="w-3 h-3" />
              {recipe.ingredients.length} பொருட்கள்
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-muted-foreground">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border">
              {/* Ingredients */}
              <div className="mt-3">
                <p className="font-tamil text-xs font-semibold text-foreground mb-2 leaf-border">
                  தேவையான பொருட்கள்
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.ingredients.map((ing) => (
                    <Badge
                      key={ing}
                      variant="outline"
                      className="font-tamil text-xs rounded-xl"
                    >
                      {ing}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recipe steps */}
              <div className="mt-4">
                <p className="font-tamil text-xs font-semibold text-foreground mb-3 leaf-border">
                  சமைக்கும் முறை
                </p>
                <ol className="space-y-2">
                  {recipe.steps.map((step, i) => (
                    <li key={step} className="flex gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{
                          background: "oklch(0.72 0.18 65)",
                          color: "oklch(0.15 0.02 55)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <p className="font-tamil text-xs text-muted-foreground leading-relaxed">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function MealPlanPage() {
  const [selectedDay, setSelectedDay] = useState<DayKey>("monday");
  const { data: mealPlan, isLoading } = useWeeklyMealPlan();

  const todayMeals = mealPlan?.[selectedDay];

  const totalDayCalories = todayMeals
    ? (getMealData(todayMeals.breakfast)?.calories ||
        DEFAULT_BREAKFAST.calories) +
      (getMealData(todayMeals.lunch)?.calories || DEFAULT_LUNCH.calories) +
      (getMealData(todayMeals.dinner)?.calories || DEFAULT_DINNER.calories)
    : 0;

  return (
    <div className="app-container" lang="ta">
      {/* Header */}
      <div className="header-gradient px-6 pt-14 pb-6">
        <h1 className="font-tamil text-2xl font-bold text-white mb-1">
          உணவு திட்டம்
        </h1>
        <p className="font-tamil text-white/70 text-sm">வாராந்திர உணவு அட்டவணை</p>
      </div>

      {/* Day selector */}
      <div className="bg-card border-b border-border px-2 py-3 overflow-x-auto day-scroll flex gap-1">
        {DAY_KEYS.map((day) => (
          <button
            key={day}
            type="button"
            data-ocid="mealplan.day.tab"
            onClick={() => setSelectedDay(day)}
            className={`day-snap flex-shrink-0 px-3 py-2 rounded-xl font-tamil text-sm font-medium transition-all ${
              selectedDay === day
                ? "text-primary-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={
              selectedDay === day
                ? {
                    background: "oklch(0.72 0.18 65)",
                    color: "oklch(0.15 0.02 55)",
                  }
                : undefined
            }
          >
            {DAY_NAMES[day]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pt-4 pb-24">
        {/* Day summary */}
        {!isLoading && totalDayCalories > 0 && (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-4 p-3 rounded-xl"
            style={{ background: "oklch(0.72 0.18 65 / 0.08)" }}
          >
            <Flame
              className="w-4 h-4"
              style={{ color: "oklch(0.72 0.18 65)" }}
            />
            <p className="font-tamil text-sm text-foreground">
              <span className="font-bold">{totalDayCalories}</span> மொத்த கலோரிகள்
              — {DAY_NAMES[selectedDay]}
            </p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-3" data-ocid="mealplan.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {(["breakfast", "lunch", "dinner"] as const).map((type, i) => (
                <MealCard
                  key={type}
                  mealName={todayMeals?.[type] || ""}
                  type={type}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
