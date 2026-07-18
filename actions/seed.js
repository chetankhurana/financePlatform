"use server";

import { db } from "@/lib/prisma";
import { subDays } from "date-fns";

// Categories with their typical amount ranges
const CATEGORIES = {
  INCOME: [
    { name: "salary",       range: [5000, 8000]  },
    { name: "freelance",    range: [1000, 3000]  },
    { name: "investments",  range: [500,  2000]  },
    { name: "other-income", range: [100,  1000]  },
  ],
  EXPENSE: [
    { name: "housing",        range: [1000, 2000] },
    { name: "transportation", range: [100,  500]  },
    { name: "groceries",      range: [200,  600]  },
    { name: "utilities",      range: [100,  300]  },
    { name: "entertainment",  range: [50,   200]  },
    { name: "food",           range: [50,   150]  },
    { name: "shopping",       range: [100,  500]  },
    { name: "healthcare",     range: [100,  1000] },
    { name: "education",      range: [200,  1000] },
    { name: "travel",         range: [500,  2000] },
  ],
};

function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

/**
 * Seeds demo data for a brand-new user:
 *  - 2 accounts (Savings + Current)
 *  - 90 days of randomised transactions on each account
 *  - A monthly budget
 *
 * @param {string} userId  Internal DB UUID of the user (not clerk ID)
 */
export async function seedDemoData(userId) {
  try {
    // ── 1. Create accounts ────────────────────────────────────────────────
    const savingsAccount = await db.account.create({
      data: {
        name: "Main Savings",
        type: "SAVINGS",
        balance: 0,
        isDefault: true,
        userId,
      },
    });

    const currentAccount = await db.account.create({
      data: {
        name: "Daily Expenses",
        type: "CURRENT",
        balance: 0,
        isDefault: false,
        userId,
      },
    });

    // ── 2. Generate transactions for each account ─────────────────────────
    for (const account of [savingsAccount, currentAccount]) {
      const transactions = [];
      let totalBalance = 0;

      for (let i = 90; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const txPerDay = Math.floor(Math.random() * 3) + 1;

        for (let j = 0; j < txPerDay; j++) {
          // Savings: more income, fewer expenses; Current: more expenses
          const incomeChance = account.type === "SAVINGS" ? 0.5 : 0.3;
          const type = Math.random() < incomeChance ? "INCOME" : "EXPENSE";
          const { category, amount } = getRandomCategory(type);

          transactions.push({
            id: crypto.randomUUID(),
            type,
            amount,
            description: `${type === "INCOME" ? "Received" : "Paid for"} ${category}`,
            date,
            category,
            status: "COMPLETED",
            userId,
            accountId: account.id,
            createdAt: date,
            updatedAt: date,
          });

          totalBalance += type === "INCOME" ? amount : -amount;
        }
      }

      // Insert transactions and update balance atomically
      await db.$transaction(async (tx) => {
        await tx.transaction.createMany({ data: transactions });
        await tx.account.update({
          where: { id: account.id },
          data: { balance: totalBalance },
        });
      });
    }

    // ── 3. Create a starting budget ───────────────────────────────────────
    await db.budget.create({
      data: {
        amount: 5000,
        userId,
      },
    });

    return { success: true, message: "Demo data seeded successfully" };
  } catch (error) {
    console.error("❌ Error seeding demo data:", error);
    return { success: false, error: error.message };
  }
}