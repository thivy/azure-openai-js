const requiredServerEnvs = ["AZURE_OPEN_AI_KEY", "AZURE_OPEN_AI_BASE"] as const;

type RequiredServerEnvKeys = (typeof requiredServerEnvs)[number];

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<RequiredServerEnvKeys, string> {}
  }
}

export {};
