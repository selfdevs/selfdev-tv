export const getEnvOrThrow = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const getEnvOrDefault = (key: string, defaultValue: string): string => {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value;
};
