const isServer = typeof window === "undefined";

export const getEnv = (name: string) =>
  isServer
    ? (process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`])
    : process.env[`NEXT_PUBLIC_${name}`];

export const requiredUrl = (envName: string): string => {
  const url = getEnv(envName);
  if (!url) throw new Error(`Missing required env var: ${envName}`);
  return url.replace(/\/$/, "");
};

export const hydraAdminUrl = () => requiredUrl("HYDRA_ADMIN_URL");
export const kratosAdminUrl = () => requiredUrl("KRATOS_ADMIN_URL");
export const ketoPublicUrl = () => requiredUrl("KETO_PUBLIC_URL");
export const ketoAdminUrl = () => requiredUrl("KETO_ADMIN_URL");
