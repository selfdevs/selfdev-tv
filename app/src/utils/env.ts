export const getEnvOrThrow = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};
