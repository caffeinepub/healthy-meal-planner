import { Button } from "@/components/ui/button";
import { Leaf, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function AuthPage() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();

  return (
    <div className="app-container min-h-dvh flex flex-col" lang="ta">
      {/* Hero section */}
      <div className="relative overflow-hidden" style={{ height: "45vh" }}>
        <img
          src="/assets/generated/tamil-food-hero.dim_430x300.jpg"
          alt="தமிழ் உணவுகள்"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center shadow-card">
            <Leaf
              className="w-5 h-5"
              style={{ color: "oklch(0.15 0.02 55)" }}
            />
          </div>
          <span className="font-tamil font-bold text-white text-shadow text-lg drop-shadow-md">
            ஆரோக்கிய உணவு
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-6 pb-10 spice-pattern">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-bold text-foreground leading-tight mb-2">
            ஆரோக்கிய
          </h1>
          <h2
            className="font-tamil text-4xl font-bold mb-3 leading-tight"
            style={{ color: "oklch(0.72 0.18 65)" }}
          >
            உணவு திட்டமிடல்
          </h2>
          <p className="font-tamil text-muted-foreground text-base leading-relaxed mb-8">
            உங்கள் உடல் நல இலக்கை அடைய தனிப்பயனாக்கப்பட்ட வாராந்திர உணவு திட்டங்களை பெறுங்கள்.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["🥗 எடை குறைப்பு", "💪 தசை வளர்ச்சி", "🌿 சமச்சீர் உணவு"].map((f) => (
              <span
                key={f}
                className="font-tamil text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground"
              >
                {f}
              </span>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="space-y-3">
            <Button
              data-ocid="auth.login.button"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              className="w-full h-14 text-base font-tamil font-semibold rounded-2xl shadow-card-lg"
              style={{
                background: "oklch(0.72 0.18 65)",
                color: "oklch(0.15 0.02 55)",
              }}
            >
              {isLoggingIn || isInitializing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="font-tamil">நுழைகிறோம்...</span>
                </>
              ) : (
                <span className="font-tamil">உள்நுழைக / பதிவு செய்க</span>
              )}
            </Button>

            <Button
              data-ocid="auth.register.button"
              variant="outline"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              className="w-full h-12 text-sm font-tamil rounded-2xl border-2"
            >
              <span className="font-tamil">
                இன்டர்நெட் அடையாளம் மூலம் புதிய கணக்கு
              </span>
            </Button>
          </div>

          <p className="font-tamil text-xs text-muted-foreground text-center mt-6 leading-relaxed">
            Internet Computer இன் பாதுகாப்பான அடையாள சேவை மூலம் உள்நுழைக
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-xs text-muted-foreground font-tamil">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
