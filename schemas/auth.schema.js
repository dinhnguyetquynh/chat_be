import {z} from 'zod';

export const userSignupSchema = z.object({
    phoneNumber: z.string(),
    password: z.string().min(8),
});

export const userLoginSchema = z.object({
    phoneNumber: z.string(),
    password: z.string().min(8),
});

export const tokenSchema = z.object({
    token: z.string(),
});