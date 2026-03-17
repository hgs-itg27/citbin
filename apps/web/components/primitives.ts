import { tv } from "tailwind-variants";

// --- Farbpaletten ---
// Beinhaltet die gewünschten Verläufe aus der neueren Version für Rot, Orange
// und den Dark-Mode Foreground, ansonsten die Farben aus der älteren Version.
const gradientColors = {
  violet: "from-[#FF1CF7] to-[#b249f8]", 
  yellow: "from-[#FF705B] to-[#FFB457]", 
  blue: "from-[#5EA2EF] to-[#0072F5]", 
  cyan: "from-[#00b7fa] to-[#01cfea]", 
  green: "from-[#6FEE8D] to-[#17c964]", 
  pink: "from-[#FF72E1] to-[#F54C7A]", 
  red: "from-[#FF5B5B] to-[#D93C3C]", 
  orange: "from-[#FF8C00] to-[#FF705B]", 
};

// Separate Definition für den speziellen Foreground-Verlauf im Titel
const titleForegroundGradient = "dark:from-[#FFFFFF] dark:to-[#999999]"; 

const gradientClasses = "bg-clip-text text-transparent bg-gradient-to-b";

// --- Title Variant ---
export const title = tv({
  base: "tracking-tight inline font-semibold break-words",
  variants: {
    color: {
      ...gradientColors, // Nutzt die neuen/kombinierten Verläufe
      foreground: titleForegroundGradient, // Spezieller neuer Foreground-Verlauf
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl leading-9", // leading-9 aus alter Version
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md", 
  },
  compoundVariants: [
    {
      // Wendet Gradienten auf alle definierten Farben an (inkl. foreground)
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "red",
        "orange",
        "foreground", // Wichtig: foreground wird hier auch als Gradient behandelt
      ],
      class: gradientClasses,
    },
    // Spezielle Regel für foreground entfernt, da jetzt im Haupt-compoundVariant enthalten
    // und die `foreground`-Definition selbst den Dark-Mode-Selektor enthält.
  ],
});

// --- Subtitle Variant (Basierend auf alter Version, mit Farb-Updates für Rot/Orange) ---
/**
 * A style variant configuration for subtitles using the `tv` utility.
 *
 * This configuration defines base styles and color variants for subtitle components,
 * supporting single-color gradients and responsive width. The `color` variants use
 * specific hex codes for different color themes, while the `fullWidth` variant controls
 * the width of the subtitle. Compound variants apply gradient classes to the defined colors.
 *
 * @remarks
 * - No base text color is set, unlike previous versions.
 * - The `fullWidth` variant defaults to `true` for legacy compatibility.
 * - No 'default' or 'foreground' color variants are provided.
 *
 * @example
 * ```tsx
 * <span className={subtitle({ color: 'violet' })}>Violetter Untertitel</span>
 * ```
 */
export const subtitle = tv({
  // Keine Basis-Textfarbe hier, wie in alter Version
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl max-w-full break-words",
  variants: {
    color: {
      // Verwendet meist die alten "single color" Verläufe
      violet: "from-[#FF1CF7] to-[#FF1CF7]",
      yellow: "from-[#FF705B] to-[#FF705B]",
      blue: "from-[#5EA2EF] to-[#5EA2EF]",
      cyan: "from-[#00b7fa] to-[#00b7fa]",
      green: "from-[#6FEE8D] to-[#6FEE8D]",
      pink: "from-[#FF72E1] to-[#FF72E1]",
      // Nimmt die *FROM*-Farbe aus den neuen Verläufen für Rot/Orange
      red: "from-[#FF5B5B] to-[#FF5B5B]",
      orange: "from-[#FF8C00] to-[#FF8C00]",
      // Keine 'default' oder 'foreground' Variante hier, wie in alter Version
    },
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true, // Default aus alter Version
  },
  compoundVariants: [
    {
      // Wendet Gradienten auf die definierten Farben an
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "red",
        "orange",
      ],
      class: gradientClasses,
    },
  ],
});

// --- Paragraph Variant (Aus neuer Version hinzugefügt) ---
export const paragraph = tv({
  base: "text-base leading-relaxed text-zinc-700 dark:text-zinc-300",
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    muted: {
      true: "text-zinc-500 dark:text-zinc-400",
    },
    color: {
      default: "",
      primary: "text-blue-600 dark:text-blue-400",
      secondary: "text-purple-600 dark:text-purple-400",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "normal",
  },
});

// --- Kicker/Eyebrow Variant (Aus neuer Version hinzugefügt) ---
export const kicker = tv({
  base: "inline-block text-xs font-semibold uppercase tracking-wider mb-2",
  variants: {
    color: {
      ...gradientColors, // Nutzt die oben definierten kombinierten Verläufe
      default: "text-blue-600 dark:text-blue-400", // Standard solide Farbe
    },
    noGradient: {
      // Behält die Option, Gradienten zu deaktivieren
      true: "",
    },
  },
  defaultVariants: {
    color: "default",
  },
  compoundVariants: [
    {
      // Wendet Gradienten nur auf die Farbverlauf-Namen an
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "red",
        "orange",
      ],
      noGradient: false, // Nur wenn noGradient nicht true ist
      class: gradientClasses,
    },
  ],
});
