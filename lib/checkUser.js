import { currentUser } from "@clerk/nextjs/server";
import { db } from "../lib/prisma";
import { seedDemoData } from "../actions/seed";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // Return existing user immediately — no seeding needed
    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // ── Brand-new user: create DB record ──────────────────────────────────
    const name = `${user.firstName} ${user.lastName}`;
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name,
        imageUrl: user.imageUrl,
      },
    });

    // ── Seed demo data in the background (non-blocking) ───────────────────
    seedDemoData(newUser.id).catch((err) =>
      console.error("⚠️  Demo seed failed (non-fatal):", err)
    );

    return newUser;
  } catch (error) {
    console.error("❌ Error in checkUser:", error);
  }
};