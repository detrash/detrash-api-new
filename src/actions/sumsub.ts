'use server';

import axios, { InternalAxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import { eq } from 'drizzle-orm';
import FormData from 'form-data';

import { db, KYC, kycs, ReviewAnswer, ReviewRejectType, SafeKYC } from '@/db';
import { env } from '@/env';
import { castKYC2SafeKYC, takeUniqueOrThrow } from '@/utils';

const api = axios.create({
  baseURL: 'https://api.sumsub.com/',
  headers: { 'Content-Type': 'application/json', 'X-App-Token': env.SUMSUB_ACCESS_TOKEN },
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

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, env.SUMSUB_SECRET_KEY!);
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

export async function addKYC(newKYC: KYC): Promise<SafeKYC> {
  const [todo] = await db.insert(kycs).values(newKYC).returning();

  return castKYC2SafeKYC(todo);
}

export async function getKYCByUserId(userId: string): Promise<SafeKYC> {
  const kyc = await db
    .select()
    .from(kycs)
    .where(eq(kycs.externalUserId, userId))
    .then(takeUniqueOrThrow)
    .then(castKYC2SafeKYC);

  return kyc;
}

export interface SumsubWebhookResponse {
  applicantId: string;
  inspectionId: string;
  correlationId: string;
  externalUserId: string;
  levelName: string;
  type: string;
  reviewStatus: string;
  createdAtMs: string;
}

export interface ApplicantReviewedResponse extends SumsubWebhookResponse {
  reviewResult: ReviewResult;
}

export interface ReviewResult {
  /** a human-readable comment that can be shown to your applicants.  */
  moderationComment?: string;
  /** a human-readable comment that should not be shown to your applicants.  */
  clientComment?: string;
  reviewAnswer: ReviewAnswer;
  rejectLabels?: string[];
  reviewRejectType?: ReviewRejectType;
}
