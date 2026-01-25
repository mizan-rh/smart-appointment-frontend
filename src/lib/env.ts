import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url(),
    BACKEND_URL: z.string().url().optional(),
});

const isServer = typeof window === 'undefined';

const _env = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    BACKEND_URL: process.env.BACKEND_URL,
});

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}

if (isServer && !_env.data.BACKEND_URL) {
    console.error('❌ BACKEND_URL is required on the server');
    throw new Error('Missing BACKEND_URL');
}

export const env = _env.data as {
    NEXT_PUBLIC_API_URL: string;
    BACKEND_URL: string;
};
