import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, LogOut, Shield, Target } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { HEALTH_GOAL_LABELS } from "../data/mealData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSetUserProfile, useUserProfile } from "../hooks/useQueries";

export function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const { identity, clear } = useInternetIdentity();
  const setProfile = useSetUserProfile();
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");

  const goalInfo = profile?.healthGoal
    ? HEALTH_GOAL_LABELS[profile.healthGoal as string]
    : null;
  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-4)}`
    : "";

  const handleChangeGoal = async () => {
    if (!selectedGoal || !profile) return;
    try {
      await setProfile.mutateAsync({
        displayName: profile.displayName,
        healthGoal: selectedGoal,
      });
      setShowGoalDialog(false);
      toast.success("இலக்கு மாற்றப்பட்டது!");
    } catch {
      toast.error("மாற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
    }
  };

  const handleLogout = () => {
    clear();
    toast.success("வெளியேறினீர்கள்");
  };

  return (
    <div className="app-container" lang="ta">
      {/* Header */}
      <div className="header-gradient px-6 pt-14 pb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-white/30">
            <AvatarFallback
              className="font-tamil text-xl font-bold"
              style={{
                background: "oklch(0.15 0.02 55)",
                color: "oklch(0.72 0.18 65)",
              }}
            >
              {profile?.displayName?.slice(0, 2) || "அ"}
            </AvatarFallback>
          </Avatar>
          <div>
            {isLoading ? (
              <div className="h-7 w-32 bg-white/20 rounded-lg animate-pulse" />
            ) : (
              <h1 className="font-tamil text-2xl font-bold text-white">
                {profile?.displayName || "பயனர்"}
              </h1>
            )}
            {goalInfo && (
              <span className="inline-flex items-center gap-1 font-tamil text-xs text-white/80 mt-1">
                {goalInfo.emoji} {goalInfo.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-24 space-y-4">
        {/* Goal card */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Target
                className="w-4 h-4"
                style={{ color: "oklch(0.72 0.18 65)" }}
              />
              <p className="font-tamil text-sm font-semibold text-foreground">
                உடல் நல இலக்கு
              </p>
            </div>
          </div>
          <div className="p-4">
            {goalInfo ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{goalInfo.emoji}</span>
                  <div>
                    <p className="font-tamil font-semibold text-foreground">
                      {goalInfo.label}
                    </p>
                    <p className="font-tamil text-xs text-muted-foreground">
                      {goalInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-tamil text-muted-foreground text-sm">
                இலக்கு அமைக்கப்படவில்லை
              </p>
            )}
            <Button
              data-ocid="profile.changegoal.button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedGoal((profile?.healthGoal as string) || "");
                setShowGoalDialog(true);
              }}
              className="mt-4 w-full font-tamil rounded-xl border-2"
              style={{
                borderColor: "oklch(0.72 0.18 65)",
                color: "oklch(0.55 0.14 65)",
              }}
            >
              இலக்கை மாற்று
            </Button>
          </div>
        </motion.section>

        {/* Account info */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield
                className="w-4 h-4"
                style={{ color: "oklch(0.45 0.12 150)" }}
              />
              <p className="font-tamil text-sm font-semibold text-foreground">
                கணக்கு விவரங்கள்
              </p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-tamil text-xs text-muted-foreground">
                அடையாள எண்
              </p>
              <Badge variant="secondary" className="font-mono text-xs">
                {shortPrincipal || "---"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-tamil text-xs text-muted-foreground">
                நேட்வொர்க்
              </p>
              <Badge variant="outline" className="text-xs">
                Internet Computer
              </Badge>
            </div>
          </div>
        </motion.section>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full h-12 font-tamil rounded-2xl gap-2"
          >
            <LogOut className="w-4 h-4" />
            வெளியேறு
          </Button>
        </motion.div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center font-tamil pt-2">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      {/* Change Goal Dialog */}
      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
        <DialogContent
          className="max-w-sm mx-auto rounded-3xl"
          data-ocid="profile.goal.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-tamil text-lg">இலக்கை மாற்று</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {Object.entries(HEALTH_GOAL_LABELS).map(
              ([key, { label, emoji, description }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedGoal(key)}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all ${
                    selectedGoal === key
                      ? "border-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                  style={
                    selectedGoal === key
                      ? {
                          borderColor: "oklch(0.72 0.18 65)",
                          background: "oklch(0.72 0.18 65 / 0.08)",
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{emoji}</span>
                    <div>
                      <p className="font-tamil font-semibold text-sm text-foreground">
                        {label}
                      </p>
                      <p className="font-tamil text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                </button>
              ),
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowGoalDialog(false)}
              className="flex-1 font-tamil rounded-xl"
              data-ocid="profile.goal.cancel_button"
            >
              ரத்து
            </Button>
            <Button
              onClick={handleChangeGoal}
              disabled={!selectedGoal || setProfile.isPending}
              className="flex-1 font-tamil rounded-xl"
              style={{
                background: "oklch(0.72 0.18 65)",
                color: "oklch(0.15 0.02 55)",
              }}
              data-ocid="profile.goal.confirm_button"
            >
              {setProfile.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "சேமி"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
