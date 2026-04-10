import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.muhammedagic.oversteer",
  appName: "Oversteer",
  // Foundation-only for now. We have not chosen the final native web asset strategy yet,
  // so the actual bundle/copy workflow comes in the next step when we add a native platform.
  webDir: "out",
  backgroundColor: "#080b0f",
  loggingBehavior: "debug",
  ios: {
    contentInset: "never",
    scrollEnabled: true,
  },
  android: {
    backgroundColor: "#080b0f",
  },
};

export default config;
