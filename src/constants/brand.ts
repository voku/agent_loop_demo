/**
 * agent-loop Brand Identity & Design System Specification
 * 
 * Standardized palette, logo geometry rules, and canonical descriptions.
 * "One variable at a time, a rare triumph over human design-process entropy."
 */

export interface BrandColorRole {
  role: string;
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

export const BRAND_PALETTE: BrandColorRole[] = [
  {
    role: "Deep background",
    name: "Midnight Navy",
    hex: "#071426",
    rgb: "7, 20, 38",
    usage: "Primary dark canvas, deep containers, base surface"
  },
  {
    role: "Secondary background",
    name: "Deep Blue",
    hex: "#0B1F46",
    rgb: "11, 31, 70",
    usage: "Elevated dark cards, subtle gradients, secondary surfaces"
  },
  {
    role: "Purple accent",
    name: "Electric Violet",
    hex: "#6428FF",
    rgb: "100, 40, 255",
    usage: "Gradient start (0%), intent / decision phase, accent badges"
  },
  {
    role: "Primary blue",
    name: "Electric Blue",
    hex: "#1688FF",
    rgb: "22, 136, 255",
    usage: "Gradient center (50%), primary actions, execution / evidence"
  },
  {
    role: "Cyan accent",
    name: "Bright Cyan",
    hex: "#18D7E8",
    rgb: "24, 215, 232",
    usage: "Gradient end (100%), progress / continuation, terminal highlights"
  },
  {
    role: "Primary text, dark mode",
    name: "Soft White",
    hex: "#F8FAFC",
    rgb: "248, 250, 252",
    usage: "High-contrast headings, wordmark, and body text on dark backgrounds"
  },
  {
    role: "Primary text, light mode",
    name: "Near Black",
    hex: "#0B1220",
    rgb: "11, 18, 32",
    usage: "High-contrast wordmark, headings, and body text on light backgrounds"
  }
];

export const LOGO_GRADIENT = {
  direction: "angled (0%, 60% to 100%, 40%)",
  css: "linear-gradient(135deg, #7C3AED 0%, #6366F1 22%, #2563EB 42%, #0284C7 70%, #00D2FF 100%)",
  stops: [
    {
      offset: "0%",
      hex: "#7C3AED",
      name: "Vibrant Purple",
      conceptualRole: "intent / planning"
    },
    {
      offset: "22%",
      hex: "#6366F1",
      name: "Indigo",
      conceptualRole: "contract verification"
    },
    {
      offset: "42%",
      hex: "#2563EB",
      name: "Royal Blue",
      conceptualRole: "execution & tool invocation"
    },
    {
      offset: "70%",
      hex: "#0284C7",
      name: "Sky Blue",
      conceptualRole: "evidence capture"
    },
    {
      offset: "100%",
      hex: "#00D2FF",
      name: "Electric Cyan",
      conceptualRole: "lifecycle completion / routing"
    }
  ]
};

export const BACKGROUND_STANDARDS = {
  dark: {
    primary: "#0B0F19",
    secondary: "#001445",
    gradientCss: "linear-gradient(135deg, #000921 0%, #001445 50%, #002673 100%)",
    note: "Deep twilight navy with subtle blue elevation."
  },
  light: {
    primary: "#F8FAFC",
    secondary: "#FFFFFF",
    note: "Clean, high-contrast light canvas using #F8FAFC or white."
  }
};

export const LOGO_SHORT_DESCRIPTION = `agent-loop uses a bold geometric infinity-loop symbol formed from a thick, smooth, perfectly continuous rounded ribbon. Its color transitions seamlessly from rich purple through indigo and royal blue to electric cyan. The lowercase agent-loop wordmark uses clean, modern geometric sans-serif typography.`;

export const LOGO_DETAILED_DESCRIPTION = `Minimalist geometric logo for agent-loop:

The icon is a tangent-matched, mathematically smooth infinity loop (lemniscate) constructed from a thick rounded ribbon with clean semicircular outer curves. It represents closed-loop execution, durable state authority, and iteration in developer agent workflows.

Apply a vibrant gradient starting with deep purple (#7C3AED), sweeping through indigo (#6366F1) and royal blue (#2563EB), into bright sky blue (#0284C7) and radiant cyan (#00D2FF).

Pair with the exact lowercase wordmark "agent-loop" in bold geometric sans-serif typography. On dark backgrounds, typography is crisp white (#FFFFFF) with high contrast.`;

export const CORE_VISUAL_RULE = {
  mark: "Smooth continuous ribbon infinity loop",
  philosophy: "Continuous feedback loop with explicit contract gates and durable verification."
};
