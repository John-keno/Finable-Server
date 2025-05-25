import { z } from "zod"

export const CipherSchema = z.object({
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    cardNUmber: z.string().optional(),
    cvv: z.string().optional(),
    expiryDate: z.string().optional(),
}).strict()