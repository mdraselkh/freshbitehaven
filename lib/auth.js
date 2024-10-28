import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import prisma from "./db";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Credentials Provider for phone and password authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "phone" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });
        if (user && await compare(credentials.password, user.password)) {
          return { id: user.id, fullname: user.fullname, email: user.email };
        }
        return null; // Return null if authorization fails
      },
    }),
    
    // Google Provider for OAuth2 authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        // Check if the user already exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!existingUser) {
          // Create a new user if one does not exist
          const newUser = await prisma.user.create({
            data: {
              fullname: profile.name,
              email: profile.email,
              image: profile.picture,
              emailVerified: new Date(),
              password: null, // No password for OAuth users
            },
          });

          // Create a new account link for the Google provider
          await prisma.account.create({
            data: {
              userId: newUser.id,
              provider: "google",
              providerAccountId: profile.sub,
            },
          });

          console.log("New user created:", newUser);
          return {
            id: newUser.id,
            fullname: newUser.fullname,
            email: newUser.email,
            image: newUser.image,
          };
        } else {
          // Check if the Google account is already linked to the existing user
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: profile.sub,
              },
            },
          });

          if (!existingAccount) {
            // Link the Google account to the existing user if not already linked
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: "google",
                providerAccountId: profile.sub,
              },
            });
            console.log("Linked Google account to existing user:", existingUser);
          }
          return {
            id: existingUser.id,
            fullname: existingUser.fullname,
            email: existingUser.email,
            image: existingUser.image,
          };
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("signIn callback - User:", user);
      console.log("signIn callback - Account:", account);
      return true; // Allow sign-in
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.fullname = user.fullname;
        token.email = user.email;
      }
      return token; // Return the updated token
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        fullname: token.fullname,
        email: token.email,
      };
      return session; // Return the updated session
    },
  },
};

export default NextAuth(authOptions);
