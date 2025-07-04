import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "hello-world", // Unique app ID
  name: "FinAi",
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000, // Exponential backoff
    maxAttempts: 2,
  }),
});