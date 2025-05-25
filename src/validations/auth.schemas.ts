import z from "zod";


export const RegistrationSchema = z.object({
    firstName: z.string().min(1, "firstName is required"),
    surname: z.string().min(1, "surname is required"),
    dateOfBirth: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format"),
    phoneNumber: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(10, "Phone number must not exceed 10 digits"),
    email: z.string({message: "Email is required"}).email({message: "Email is not valid"}),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
}).strict();

export const LoginSchema = z.object({
    email: z.string({message: "Email is Required"}).email("email not valid"),
    password: z.string(),
}).strict();