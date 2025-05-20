// lib/fetch.ts
import { Agent } from 'undici';

const isProd = process.env.NODE_ENV === 'production';

const agent = new Agent({
  connect: {
    rejectUnauthorized: isProd, // kalau production, cek SSL; kalau dev ignore SSL error
  },
});

export async function fetchWithAgent(url: string, options: any = {}) {
  return fetch(url, { ...options, dispatcher: agent });
}
