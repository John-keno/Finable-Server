import { z } from "zod"

export const CipherSchema = z.object({
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    cardNumber: z.string().optional(),
    cvv: z.string().optional(),
    expiryDate: z.string().optional(),
}).strict()