const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://clerk.your-domain.com",
      applicationID: "convex",
    },
  ],
};

export default authConfig;

