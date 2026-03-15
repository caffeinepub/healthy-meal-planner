import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TamilInput } from "../components/TamilKeyboard";
import { HEALTH_GOAL_LABELS } from "../data/mealData";
import { useSetUserProfile } from "../hooks/useQueries";

type Step = "name" | "goal";

export function OnboardingPage() {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const mutation = useSetUserProfile();

  const handleNameSubmit = () => {
    if (name.trim().length < 2) {
      toast.error("குறைந்தது 2 எழுத்துகளில் பெயர் உள்ளிடவும்");
      return;
    }
    setStep("goal");
  };

  const handleGoalSubmit = async () => {
    if (!goal) {
      toast.error("இலக்கை தேர்ந்தெடுக்கவும்");
      return;
    }
    try {
      await mutation.mutateAsync({
        displayName: name.trim(),
        healthGoal: goal,
      });
      toast.success("உங்கள் திட்டம் தயாரிக்கப்படுகிறது!");
    } catch {
      toast.error("சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
    }
  };

  return (
    <div className="app-container min-h-dvh flex flex-col" lang="ta">
      {/* Header */}
      <div className="header-gradient px-6 pt-14 pb-10">
        <div className="flex items-center gap-2 mb-4">
          {["name", "goal"].map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step === s || (step === "goal" && i === 0)
                  ? "bg-white"
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>
        <p className="font-tamil text-white/70 text-sm mb-1">
          {step === "name" ? "படி 1 / 2" : "படி 2 / 2"}
        </p>
        <h1 className="font-tamil text-2xl font-bold text-white">
          {step === "name" ? "உங்கள் பெயர் என்ன?" : "உங்கள் இலக்கு என்ன?"}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8">
        <AnimatePresence mode="wait">
          {step === "name" ? (
            <motion.div
              key="name-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-tamil text-muted-foreground mb-6 text-base">
                தமிழ் விசைப்பலகையில் உங்கள் பெயரை தட்டவும்
              </p>
              <TamilInput
                data-ocid="onboarding.name.input"
                value={name}
                onChange={setName}
                onSubmit={handleNameSubmit}
                placeholder="உங்கள் பெயர்..."
                label="பெயர்"
                className="mb-6"
              />
              <Button
                onClick={handleNameSubmit}
                className="w-full h-14 font-tamil text-base font-semibold rounded-2xl"
                style={{
                  background: "oklch(0.72 0.18 65)",
                  color: "oklch(0.15 0.02 55)",
                }}
                disabled={name.trim().length < 2}
              >
                அடுத்து <ChevronRight className="ml-1 w-5 h-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="goal-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-tamil text-muted-foreground mb-6 text-base">
                <span className="font-semibold text-foreground">{name}</span>,
                உங்கள் உடல் நல இலக்கை தேர்ந்தெடுக்கவும்:
              </p>
              <div
                className="space-y-3 mb-6"
                data-ocid="onboarding.goal.select"
              >
                {Object.entries(HEALTH_GOAL_LABELS).map(
                  ([key, { label, emoji, description }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setGoal(key)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                        goal === key
                          ? "border-primary bg-primary/10 shadow-card"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                      style={
                        goal === key
                          ? { borderColor: "oklch(0.72 0.18 65)" }
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{emoji}</span>
                        <div>
                          <p className="font-tamil font-semibold text-foreground text-base">
                            {label}
                          </p>
                          <p className="font-tamil text-xs text-muted-foreground mt-0.5">
                            {description}
                          </p>
                        </div>
                        {goal === key && (
                          <div
                            className="ml-auto w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: "oklch(0.72 0.18 65)" }}
                          >
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ),
                )}
              </div>
              <Button
                data-ocid="onboarding.submit.button"
                onClick={handleGoalSubmit}
                disabled={!goal || mutation.isPending}
                className="w-full h-14 font-tamil text-base font-semibold rounded-2xl"
                style={{
                  background: "oklch(0.72 0.18 65)",
                  color: "oklch(0.15 0.02 55)",
                }}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                    திட்டமிடுகிறோம்...
                  </>
                ) : (
                  <>திட்டத்தை தொடங்கு 🚀</>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
