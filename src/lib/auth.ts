
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

/**
 * Reuse one MongoClient across hot reloads / warm serverless invocations.
 * The fallback URI only keeps `next build` working without env vars; real
 * requests need MONGODB_URI.
 */
const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017",
    {
      serverSelectionTimeoutMS: 8000,
    }
  );

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db(process.env.MONGODB_DB ?? "bazardor");

const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
};

export const auth = betterAuth({
  database: mongodbAdapter(db),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      disableImplicitLinking: false,
    },
  },

  socialProviders,

  // nextCookies must stay the last plugin.
  plugins: [nextCookies()],
});
