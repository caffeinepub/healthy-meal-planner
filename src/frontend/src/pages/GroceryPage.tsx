import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckSquare, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { GroceryItem } from "../backend.d";
import { useGroceryList } from "../hooks/useQueries";

const FALLBACK_GROCERIES: GroceryItem[] = [
  { name: "அரிசி", totalQuantity: "5 கிலோ" },
  { name: "உளுந்து", totalQuantity: "500 கிராம்" },
  { name: "துவரம் பருப்பு", totalQuantity: "1 கிலோ" },
  { name: "வெங்காயம்", totalQuantity: "12" },
  { name: "தக்காளி", totalQuantity: "8" },
  { name: "பச்சை மிளகாய்", totalQuantity: "100 கிராம்" },
  { name: "கறிவேப்பிலை", totalQuantity: "2 கட்டு" },
  { name: "கொத்தமல்லி", totalQuantity: "1 கட்டு" },
  { name: "மஞ்சள் தூள்", totalQuantity: "50 கிராம்" },
  { name: "மிளகாய் தூள்", totalQuantity: "100 கிராம்" },
  { name: "சாம்பார் பொடி", totalQuantity: "200 கிராம்" },
  { name: "தேங்காய் எண்ணெய்", totalQuantity: "500 மி.லி" },
  { name: "தயிர்", totalQuantity: "1 லிட்டர்" },
  { name: "நெய்", totalQuantity: "200 கிராம்" },
  { name: "புளி", totalQuantity: "100 கிராம்" },
  { name: "கடுகு", totalQuantity: "50 கிராம்" },
  { name: "சீரகம்", totalQuantity: "50 கிராம்" },
  { name: "கோதுமை மாவு", totalQuantity: "2 கிலோ" },
];

export function GroceryPage() {
  const { data: groceries, isLoading } = useGroceryList();
  const items =
    groceries && groceries.length > 0 ? groceries : FALLBACK_GROCERIES;

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleItem = (name: string) => {
    setChecked((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const selectAll = () => {
    const allChecked = items.every((item) => checked[item.name]);
    if (allChecked) {
      setChecked({});
    } else {
      const allTrue: Record<string, boolean> = {};
      for (const item of items) {
        allTrue[item.name] = true;
      }
      setChecked(allTrue);
    }
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0;

  return (
    <div className="app-container" lang="ta">
      <div className="header-gradient px-6 pt-14 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-tamil text-2xl font-bold text-white mb-1">
              மளிகை பட்டியல்
            </h1>
            <p className="font-tamil text-white/70 text-sm">
              {checkedCount} / {items.length} வாங்கப்பட்டவை
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <ShoppingCart className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-white"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="px-4 py-3 bg-card border-b border-border flex items-center justify-between">
        <p className="font-tamil text-sm text-muted-foreground">
          {items.length} பொருட்கள்
        </p>
        <Button
          data-ocid="grocery.selectall.button"
          variant="ghost"
          size="sm"
          onClick={selectAll}
          className="font-tamil text-sm gap-2"
          style={{ color: "oklch(0.72 0.18 65)" }}
        >
          <CheckSquare className="w-4 h-4" />
          {items.every((item) => checked[item.name])
            ? "எதுவும் வேண்டாம்"
            : "அனைத்தையும் தேர்ந்தெடு"}
        </Button>
      </div>

      <div className="px-4 pt-3 pb-24">
        {isLoading ? (
          <div className="space-y-2" data-ocid="grocery.loading_state">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className={`bg-card rounded-2xl px-4 py-3.5 border flex items-center gap-3 transition-opacity ${
                  checked[item.name] ? "opacity-50" : ""
                } border-border shadow-xs`}
                data-ocid="grocery.item.row"
              >
                <Checkbox
                  id={`grocery-item-${item.name}`}
                  checked={!!checked[item.name]}
                  onCheckedChange={() => toggleItem(item.name)}
                  className="flex-shrink-0"
                  style={
                    checked[item.name]
                      ? {
                          background: "oklch(0.45 0.12 150)",
                          borderColor: "oklch(0.45 0.12 150)",
                        }
                      : undefined
                  }
                />
                <label
                  htmlFor={`grocery-item-${item.name}`}
                  className={`font-tamil text-sm flex-1 cursor-pointer ${
                    checked[item.name]
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {item.name}
                </label>
                <span className="font-tamil text-xs text-muted-foreground flex-shrink-0">
                  {item.totalQuantity}
                </span>
              </motion.div>
            ))}
          </div>
        )}
        {!isLoading && items.length === 0 && (
          <div className="text-center py-16" data-ocid="grocery.empty_state">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-tamil text-muted-foreground">
              மளிகை பட்டியல் இல்லை
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
