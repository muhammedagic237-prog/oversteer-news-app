import type { RuntimeShell, RuntimeShellMode } from "@/lib/types";

type RuntimeNavigator = Navigator & {
  standalone?: boolean;
  userAgentData?: {
    mobile?: boolean;
  };
};

type RuntimeWindow = Window & {
  Capacitor?: {
    getPlatform?: () => string;
    isNativePlatform?: () => boolean;
  };
};

const defaultShell: RuntimeShell = {
  mode: "browser",
  label: "Browser shell",
  guidance:
    "Browser mode active. The app should still behave well on phones and is ready for later wrapping.",
  ios: false,
  android: false,
  mobile: false,
  standalone: false,
  nativeWrapper: false,
  canShare: false,
  prefersReducedMotion: false,
};

function getCapacitorMode(target: RuntimeWindow): RuntimeShellMode | null {
  const platform = target.Capacitor?.getPlatform?.();
  const nativeWrapper = target.Capacitor?.isNativePlatform?.() ?? false;

  if (!nativeWrapper || !platform) {
    return null;
  }

  if (platform === "ios") {
    return "capacitor-ios";
  }

  if (platform === "android") {
    return "capacitor-android";
  }

  return null;
}

function getShellCopy(mode: RuntimeShellMode, ios: boolean, mobile: boolean) {
  switch (mode) {
    case "capacitor-ios":
      return {
        label: "Capacitor iOS shell",
        guidance:
          "Native iOS shell detected. Safe-area spacing, foreground refresh, and local-first persistence are all tuned for a wrapped app flow.",
      };
    case "capacitor-android":
      return {
        label: "Capacitor Android shell",
        guidance:
          "Native Android shell detected. The layout is using app-style spacing and background resume refresh for a wrapped mobile experience.",
      };
    case "standalone-web":
      return {
        label: "Installed standalone shell",
        guidance:
          "Installed web-app mode detected. Oversteer is using edge-to-edge spacing and tab-safe layout like a lightweight native shell.",
      };
    case "browser":
    default:
      if (ios && mobile) {
        return {
          label: "iPhone browser shell",
          guidance:
            "Running in mobile Safari. Add to Home Screen works cleanly now, and the same shell is ready to be wrapped inside Capacitor later.",
        };
      }

      if (mobile) {
        return {
          label: "Mobile browser shell",
          guidance:
            "Running in a phone browser. The app now ships with safe-area spacing, install metadata, and foreground refresh behavior for mobile use.",
        };
      }

      return {
        label: "Browser shell",
        guidance:
          "Desktop or browser preview mode active. The mobile shell is still safe-area aware, but this is not yet running inside a native wrapper.",
      };
  }
}

export function detectRuntimeShell(): RuntimeShell {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return defaultShell;
  }

  const runtimeWindow = window as RuntimeWindow;
  const runtimeNavigator = navigator as RuntimeNavigator;
  const userAgent = runtimeNavigator.userAgent.toLowerCase();
  const ios = /iphone|ipad|ipod/.test(userAgent);
  const android = /android/.test(userAgent);
  const mobile =
    runtimeNavigator.userAgentData?.mobile ??
    (ios || android || runtimeWindow.innerWidth < 860);
  const standalone =
    runtimeNavigator.standalone === true ||
    runtimeWindow.matchMedia?.("(display-mode: standalone)")?.matches ||
    false;
  const mode = getCapacitorMode(runtimeWindow) ?? (standalone ? "standalone-web" : "browser");
  const { label, guidance } = getShellCopy(mode, ios, mobile);

  return {
    mode,
    label,
    guidance,
    ios,
    android,
    mobile,
    standalone,
    nativeWrapper: mode === "capacitor-ios" || mode === "capacitor-android",
    canShare: typeof runtimeNavigator.share === "function",
    prefersReducedMotion:
      runtimeWindow.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false,
  };
}
