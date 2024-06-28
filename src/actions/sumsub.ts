'use server';

import axios from 'axios';
import { eq } from 'drizzle-orm';

import { db, KYC, kycs, ReviewAnswer, ReviewRejectType, SafeKYC } from '@/db';
import { env } from '@/env';
import { castKYC2SafeKYC, createSignature, takeUniqueOrThrow } from '@/utils';

const api = axios.create({
  baseURL: 'https://api.sumsub.com/',
  headers: { 'Content-Type': 'application/json', 'X-App-Token': env.SUMSUB_ACCESS_TOKEN },
});

api.interceptors.request.use(createSignature, function (error) {
  return Promise.reject(error);
});

export async function getSDKAccessToken({
  userId,
  levelName = 'basic-kyc-level',
  ttlInSecs = 600,
}: {
  userId: string;
  levelName?: string;
  ttlInSecs?: number;
}): Promise<string> {
  const response = await api.post<{ token: string }>(`/resources/accessTokens`, undefined, {
    params: { userId, levelName, ttlInSecs },
  });
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

export async function getSignature({
  secretKey,
  digestAlg,
  content,
}: {
  secretKey: string;
  digestAlg: string;
  content: any;
}) {
  const { data } = await api.post<{ digest: string; digestAlg: string }>(
    `/resources/inspectionCallbacks/testDigest`,
    content,
    {
      params: { secretKey, digestAlg },
    },
  );

  return data;
}

export interface SumsubWebhookResponse<T = string> {
  applicantId: string;
  inspectionId: string;
  correlationId: string;
  externalUserId: string;
  levelName: string;
  type: T;
  reviewStatus: string;
  createdAtMs: string;
}

export interface ApplicantReviewedResponse extends SumsubWebhookResponse<'applicantReviewed'> {
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
