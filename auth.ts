import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/utils/saltAndHashPassword";
import { prisma } from "@/prisma/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const email = credentials?.email as string;
          const password = credentials?.password as string;

          if (!email || !password) {
            return null;
          }

          // Get user from database
          const getUserFromDb = await prisma.user.findUnique({
            where: {
              email: email,
            },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
            },
          });

          // Return null if user not found
          if (!getUserFromDb) {
            return null;
          }

          // Verify password
          const isPasswordValid = verifyPassword(password, getUserFromDb.password);

          // Return null if password is invalid
          if (!isPasswordValid) {
            return null;
          }

          // Return user object with their profile data
          return {
            id: String(getUserFromDb.id), // next-auth expects id to be a string
            name: getUserFromDb.name,
            email: getUserFromDb.email,
          };
        } catch (error) {
          // Log error
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
});
