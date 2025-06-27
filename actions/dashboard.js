"use server"
import { auth } from "@clerk/nextjs/server";
import { db } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import {Prisma} from '../lib/generated/prisma';


// const serializeTransaction = (obj) => {
//     const serialized = {...obj}
//     if(obj.balance?.toNumber()){
//         serialized.balance = obj.balance.toNumber();
//     }
// }

export async function createAccount(data) {
    try {
      const { userId } = await auth();
      if (!userId) throw new Error("User not authenticated");
  
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
      if (!user) throw new Error("User not found");
  
      const { name, balance, isDefault, type } = data;
  
      if (typeof balance !== "number" || isNaN(balance) || balance < 0) {
        throw new Error("Invalid balance amount");
      }
  
      const existingAccounts = await db.account.findMany({
        where: { userId: user.id },
      });
  
      const shouldBeDefault = existingAccounts.length === 0 ? true : isDefault;
  
      if (shouldBeDefault) {
        await db.account.updateMany({
          where: { userId: user.id },
          data: { isDefault: false },
        });
      }
  
      const account = await db.account.create({
        data: {
          name,
          type,
          balance : new Prisma.Decimal(balance), 
          userId: user.id,
          isDefault: shouldBeDefault,
        },
      });
  
      revalidatePath("/dashboard");
      return { success: true, data: account };
    } catch (error) {
      throw new Error(`Error creating account: ${error.message}`);
    }
  }
