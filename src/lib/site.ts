export const getSiteUrl = () => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const value = configured || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
  return value.replace(/\/$/, "");
};
