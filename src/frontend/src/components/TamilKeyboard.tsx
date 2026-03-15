import { CornerDownLeft, Delete } from "lucide-react";
import { useCallback, useId, useState } from "react";

interface TamilKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  visible?: boolean;
}

const VOWELS = ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ"];

const VOWEL_MARKS = ["்", "ா", "ி", "ீ", "ு", "ூ", "ெ", "ே", "ை", "ொ", "ோ", "ௌ"];

const CONSONANTS_ROW1 = ["க", "ங", "ச", "ஞ", "ட", "ண"];
const CONSONANTS_ROW2 = ["த", "ந", "ப", "ம", "ய", "ர"];
const CONSONANTS_ROW3 = ["ல", "வ", "ழ", "ள", "ற", "ன"];
const EXTRA_CHARS = ["ஃ", "ஶ", "ஷ", "ஸ", "ஹ", "ஜ"];

export function TamilKeyboard({
  value,
  onChange,
  onSubmit,
  visible = true,
}: TamilKeyboardProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const pressKey = useCallback(
    (char: string) => {
      onChange(`${value}${char}`);
      setPressedKey(char);
      setTimeout(() => setPressedKey(null), 150);
    },
    [value, onChange],
  );

  const handleBackspace = useCallback(() => {
    const arr = [...value];
    arr.pop();
    onChange(arr.join(""));
    setPressedKey("⌫");
    setTimeout(() => setPressedKey(null), 150);
  }, [value, onChange]);

  const handleSpace = useCallback(() => {
    onChange(`${value} `);
  }, [value, onChange]);

  if (!visible) return null;

  const KeyRow = ({ keys }: { keys: string[] }) => (
    <div className="flex gap-1 justify-center">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          data-ocid="tamil.keyboard.button"
          className={`tamil-key ${pressedKey === k ? "pressed" : ""}`}
          onPointerDown={() => pressKey(k)}
          aria-label={k}
        >
          {k}
        </button>
      ))}
    </div>
  );

  return (
    <fieldset
      className="tamil-keyboard"
      aria-label="தமிழ் விசைப்பலகை"
      style={{ border: "none", margin: 0, padding: 0 }}
    >
      <legend className="sr-only">தமிழ் விசைப்பலகை</legend>
      <div className="mb-2">
        <p className="text-xs text-center text-white/40 mb-1 font-tamil">
          உயிர் எழுத்துகள்
        </p>
        <KeyRow keys={VOWELS} />
      </div>
      <div className="mb-2">
        <p className="text-xs text-center text-white/40 mb-1 font-tamil">
          உயிர்மெய் குறிகள்
        </p>
        <KeyRow keys={VOWEL_MARKS} />
      </div>
      <div className="mb-2">
        <p className="text-xs text-center text-white/40 mb-1 font-tamil">
          மெய் எழுத்துகள்
        </p>
        <div className="flex flex-col gap-1">
          <KeyRow keys={CONSONANTS_ROW1} />
          <KeyRow keys={CONSONANTS_ROW2} />
          <KeyRow keys={CONSONANTS_ROW3} />
          <KeyRow keys={EXTRA_CHARS} />
        </div>
      </div>
      <div className="flex gap-1 mt-2">
        <button
          type="button"
          data-ocid="tamil.keyboard.button"
          className={`tamil-key backspace ${pressedKey === "⌫" ? "pressed" : ""}`}
          onPointerDown={handleBackspace}
          aria-label="நீக்கு"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          type="button"
          data-ocid="tamil.keyboard.button"
          className="tamil-key space-key"
          onPointerDown={handleSpace}
          aria-label="இடைவெளி"
        >
          இடைவெளி
        </button>
        {onSubmit && (
          <button
            type="button"
            data-ocid="tamil.keyboard.button"
            className="tamil-key special"
            onPointerDown={onSubmit}
            aria-label="சரி"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </fieldset>
  );
}

interface TamilInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  label?: string;
  className?: string;
  "data-ocid"?: string;
}

export function TamilInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  label,
  className = "",
  "data-ocid": dataOcid,
}: TamilInputProps) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputId = useId();

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-1.5 font-tamil"
        >
          {label}
        </label>
      )}
      {/* Real input (sr-only) for accessibility - clicking label focuses it */}
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        aria-label={label || placeholder}
        onFocus={() => setShowKeyboard(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit();
        }}
      />
      {/* Visual display - wraps in label so clicking focuses the real input */}
      <label
        htmlFor={inputId}
        className="relative w-full min-h-[48px] px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground font-tamil text-base cursor-text flex items-center"
        style={{
          borderColor: showKeyboard ? "oklch(0.72 0.18 65)" : undefined,
        }}
        data-ocid={dataOcid}
      >
        {value ? (
          <span className="font-tamil">{value}</span>
        ) : (
          <span className="text-muted-foreground font-tamil">
            {placeholder}
          </span>
        )}
        {showKeyboard && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary animate-pulse" />
        )}
      </label>
      {showKeyboard && (
        <div
          className="fixed inset-x-0 bottom-0 z-50"
          style={{ maxWidth: 430, margin: "0 auto" }}
        >
          <div className="relative">
            <button
              type="button"
              className="absolute -top-8 right-3 text-xs text-white/60 bg-black/40 px-3 py-1 rounded-full font-tamil"
              onClick={() => setShowKeyboard(false)}
            >
              மூடு ✕
            </button>
            <TamilKeyboard
              value={value}
              onChange={onChange}
              onSubmit={() => {
                setShowKeyboard(false);
                onSubmit?.();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
