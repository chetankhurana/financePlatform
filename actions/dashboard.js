"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "../lib/generated/prisma";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance?.toNumber) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount?.toNumber) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Find the user in your DB by Clerk ID
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Convert balance to float and validate
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat) || balanceFloat < 0) {
      throw new Error("Invalid balance amount");
    }

    // Find existing accounts to decide default status
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    // If new account is default, unset others
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create the new account with correct decimal type for balance
    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault, // Override the isDefault based on our logic
      },
    });

    // Serialize balance (and amount if present) for safe return
    const serializedAccount = serializeTransaction(account);

    // Revalidate the dashboard path to update UI
    revalidatePath("/dashboard");

    return { success: true, data: serializedAccount };
  } catch (error) {
    console.error("Error in createAccount:", error);
    throw error;
  }
}

export async function getUserAccounts() {
  const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Find the user in your DB by Clerk ID
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count:{
          select:{transactions : true}
        }
      }
    })

    const serializedAccount = accounts.map(serializeTransaction);
    return serializedAccount;

}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}
