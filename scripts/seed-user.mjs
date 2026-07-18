/**
 * One-time seed script for an existing user.
 * Run: node scripts/seed-user.mjs
 */

import { PrismaClient } from "../lib/generated/prisma/index.js";
import { subDays } from "date-fns";

const db = new PrismaClient();

const USER_ID             = "44bdabf4-b6a1-418f-a5d0-d186b0b90612";
const EXISTING_ACCOUNT_ID = "5a25ca76-139c-4153-a51b-2cf45222298a"; // CURRENT

const CATEGORIES = {
  INCOME: [
    { name: "salary",       range: [55000, 65000], monthly: true },
    { name: "freelance",    range: [8000,  20000] },
    { name: "investments",  range: [2000,  8000]  },
    { name: "other-income", range: [500,   3000]  },
  ],
  EXPENSE: [
    { name: "housing",        range: [15000, 18000], monthly: true },
    { name: "transportation", range: [500,   2000]  },
    { name: "groceries",      range: [1500,  4000]  },
    { name: "utilities",      range: [800,   2000]  },
    { name: "entertainment",  range: [500,   2000]  },
    { name: "food",           range: [300,   1200]  },
    { name: "shopping",       range: [1000,  5000]  },
    { name: "healthcare",     range: [500,   3000]  },
    { name: "education",      range: [1000,  5000]  },
    { name: "travel",         range: [3000,  12000] },
  ],
};

function rand(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function pickCategory(type) {
  const pool = CATEGORIES[type].filter(c => !c.monthly);
  const c    = pool[Math.floor(Math.random() * pool.length)];
  return { category: c.name, amount: rand(c.range[0], c.range[1]) };
}

function makeTx(type, category, amount, date, userId, accountId, extra = {}) {
  return {
    id:          crypto.randomUUID(),
    type,
    amount,
    description: type === "INCOME" ? `Received ${category}` : `Paid for ${category}`,
    date,
    category,
    status:      "COMPLETED",
    userId,
    accountId,
    createdAt:   date,
    updatedAt:   date,
    ...extra,
  };
}

async function seed() {
  console.log("Seeding...");

  const savings = await db.account.create({
    data: { name: "Savings Account", type: "SAVINGS", balance: 0, isDefault: false, userId: USER_ID },
  });

  await db.budget.upsert({
    where:  { userId: USER_ID },
    update: { amount: 50000 },
    create: { userId: USER_ID, amount: 50000 },
  });

  const currentTxs = [];
  const savingsTxs = [];
  let currentBalance = 20000;
  let savingsBalance = 0;
  const today = new Date();
  const monthsSalaryDone  = new Set();
  const monthsHousingDone = new Set();

  for (let i = 90; i >= 0; i--) {
    const date     = subDays(today, i);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    if (date.getDate() === 1 && !monthsSalaryDone.has(monthKey)) {
      monthsSalaryDone.add(monthKey);
      const amount = rand(55000, 65000);
      currentTxs.push(makeTx("INCOME", "salary", amount, date, USER_ID, EXISTING_ACCOUNT_ID));
      currentBalance += amount;
      const transfer = Number((amount * 0.3).toFixed(2));
      savingsTxs.push(makeTx("INCOME", "other-income", transfer, date, USER_ID, savings.id, { description: "Monthly savings transfer" }));
      savingsBalance += transfer;
    }

    if (date.getDate() === 2 && !monthsHousingDone.has(monthKey)) {
      monthsHousingDone.add(monthKey);
      const amount = rand(15000, 18000);
      currentTxs.push(makeTx("EXPENSE", "housing", amount, date, USER_ID, EXISTING_ACCOUNT_ID));
      currentBalance -= amount;
    }

    const dailyCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < dailyCount; j++) {
      if (Math.random() < 0.25) {
        const { category, amount } = pickCategory("INCOME");
        currentTxs.push(makeTx("INCOME", category, amount, date, USER_ID, EXISTING_ACCOUNT_ID));
        currentBalance += amount;
      } else {
        const { category, amount } = pickCategory("EXPENSE");
        currentTxs.push(makeTx("EXPENSE", category, amount, date, USER_ID, EXISTING_ACCOUNT_ID));
        currentBalance -= amount;
      }
    }

    if (Math.random() < 0.1) {
      const amount = rand(2000, 8000);
      savingsTxs.push(makeTx("INCOME", "investments", amount, date, USER_ID, savings.id));
      savingsBalance += amount;
    }
  }

  // Force current-month expense data for the pie chart
  const thisMonth = today.getMonth();
  const thisYear  = today.getFullYear();
  const expenseCats = ["groceries","food","transportation","utilities","entertainment","shopping","healthcare"];
  for (const cat of expenseCats) {
    const catData = CATEGORIES.EXPENSE.find(c => c.name === cat);
    for (let k = 0; k < 4; k++) {
      const daysAgo = Math.floor(Math.random() * (today.getDate() - 1));
      const date    = subDays(today, daysAgo);
      if (date.getMonth() !== thisMonth || date.getFullYear() !== thisYear) continue;
      const amount = rand(catData.range[0] / 3, catData.range[1] / 2);
      currentTxs.push(makeTx("EXPENSE", cat, amount, date, USER_ID, EXISTING_ACCOUNT_ID));
      currentBalance -= amount;
    }
  }

  await db.$transaction(async (t) => {
    await t.transaction.deleteMany({ where: { userId: USER_ID } });
    await t.transaction.createMany({ data: currentTxs });
    await t.transaction.createMany({ data: savingsTxs });
    await t.account.update({ where: { id: EXISTING_ACCOUNT_ID }, data: { balance: Math.max(currentBalance, 1000) } });
    await t.account.update({ where: { id: savings.id }, data: { balance: Math.max(savingsBalance, 500) } });
  });

  console.log(`Current account: ${currentTxs.length} transactions`);
  console.log(`Savings account: ${savingsTxs.length} transactions`);
  console.log("Done!");
  await db.$disconnect();
}

seed().catch(async (e) => {
  console.error(e.message);
  await db.$disconnect();
  process.exit(1);
});
