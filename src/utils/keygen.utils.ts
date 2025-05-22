import { customAlphabet } from 'nanoid';
import { createId } from "@paralleldrive/cuid2";

export function generateUniqueId(length: number): string {
    const nanoid = customAlphabet('0123456789', length);
    return nanoid();
}

export function generateDBUniqueKeyId(): string {
    return createId();
}