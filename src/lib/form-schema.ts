import { z } from "zod";

export const registerFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 characters." })
    .max(100, { message: "Name must be not more than 100 characters." }),
  username: z
    .string()
    .min(1, { message: "Username must be at least 1 characters." })
    .max(100, { message: "Username must be not more than 100 characters." }),
  password: z
    .string()
    .min(1, { message: "Password must be at least 1 characters." })
    .max(100, { message: "Password must be not more than 100 characters." }),
});

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username must be at least 1 characters." })
    .max(100, { message: "Username must be not more than 100 characters." }),
  password: z
    .string()
    .min(1, { message: "Password must be at least 1 characters." })
    .max(100, { message: "Password must be not more than 100 characters." }),
});

export const createTripFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title must be at least 1 characters." })
    .max(100, { message: "Title must be not more than 100 characters." }),
  description: z
    .string()
    .min(1, { message: "Description must be at least 1 characters." })
    .max(1001, {
      message: "Description must be not more than 1000 characters.",
    }),
  latitude: z.number(),
  longitude: z.number(),
});
