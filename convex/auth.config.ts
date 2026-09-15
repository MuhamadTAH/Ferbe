const authConfig = {
  providers: [
    {
      domain:
        process.env.CLERK_JWT_ISSUER_DOMAIN ||
        "https://splendid-marmoset-4572.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};

export default authConfig;

