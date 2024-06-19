'use server';

import axios, { InternalAxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import FormData from 'form-data';

import { db, Todo, todos } from '@/db';

const api = axios.create({
  baseURL: 'https://api.sumsub.com/',
  headers: { 'Content-Type': 'application/json', 'X-App-Token': process.env.SUMSUB_ACCESS_TOKEN },
});

api.interceptors.request.use(createSignature, function (error) {
  return Promise.reject(error);
});

function toWordArray(bytes: Buffer) {
  const words: number[] = [];
  for (let j = 0; j < bytes.length; j++) {
    words[j >>> 2] |= bytes[j] << (24 - 8 * (j % 4));
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length);
}

function createSignature(config: InternalAxiosRequestConfig) {
  var ts = Math.floor(Date.now() / 1000);

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, process.env.SUMSUB_SECRET_KEY!);
  hmac.update(ts + config.method!.toUpperCase() + config.url);
  if (config.data instanceof FormData) {
    hmac.update(toWordArray(config.data.getBuffer()));
  } else if (config.data) {
    hmac.update(config.data);
  }

  config.headers['X-App-Access-Ts'] = ts;
  config.headers['X-App-Access-Sig'] = hmac.finalize().toString(CryptoJS.enc.Hex);
  return config;
}

export async function getSDKAccessToken({
  userId = 'anon',
  levelName = 'basic-kyc-level',
  ttlInSecs = 600,
}:
  | {
      userId?: string;
      levelName?: string;
      ttlInSecs?: number;
    }
  | undefined = {}): Promise<string> {
  const response = await api.post<{ token: string }>(
    `/resources/accessTokens?userId=${userId}&levelName=${levelName}&ttlInSecs=${ttlInSecs}`,
  );
  return response.data.token;
}

export async function createTodo(newTodo: Omit<Todo, 'id' | 'createdAt'>) {
  const [todo] = await db.insert(todos).values(newTodo).returning();

  return todo;
}
