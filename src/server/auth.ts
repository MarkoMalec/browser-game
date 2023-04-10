import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../env.mjs";
import { prisma } from "./db";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}


const updateMissingSkills = async (userId: string) => {
  // Get all skills from the 'skills' table
  const allSkills = await prisma.skills.findMany();

  // Get the user's current skills from the 'user_skills' table
  const userSkills = await prisma.user_skills.findMany({
    where: { user_id: userId },
  });

  // Find the missing skills
  const missingSkills = allSkills.filter(
    (skill) => !userSkills.some((userSkill) => userSkill.skill_id === skill.skill_id)
  );

  // Create the missing skills in the 'user_skills' table for the user
  const createUserSkillsPromises = missingSkills.map((skill) => {
    return prisma.user_skills.create({
      data: {
        user_id: userId,
        skill_id: skill.skill_id,
      },
    });
  });

  await Promise.all(createUserSkillsPromises);
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  events: {
    signIn: async ({ user }) => {
      console.log("signIn event triggered");
      await updateMissingSkills(user.id);
      return true;
    },
    afterSignIn: async ({ user }) => {
      console.log("This is the user: " + user);
      await updateMissingSkills(user.id);
    },
  },

  callbacks: {
    
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
