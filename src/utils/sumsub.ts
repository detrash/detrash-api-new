import { InternalAxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import FormData from 'form-data';
import { NextApiRequest } from 'next';

import { ApplicantReviewedResponse } from '@/actions/sumsub';
import { KYC, SafeKYC } from '@/db';
import { env } from '@/env';

function toWordArray(bytes: Buffer) {
  const words: number[] = [];
  for (let j = 0; j < bytes.length; j++) {
    words[j >>> 2] |= bytes[j] << (24 - 8 * (j % 4));
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length);
}

export function createSignature(config: InternalAxiosRequestConfig) {
  var ts = Math.floor(Date.now() / 1000);

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, env.SUMSUB_SECRET_KEY);
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

export async function checkDigest(req: NextApiRequest): Promise<boolean> {
  if (typeof req.headers['X-Payload-Digest-Alg'] !== 'string') {
    throw new Error('Missing digest algorithm');
  }

  const algo = {
    HMAC_SHA1_HEX: 'sha1',
    HMAC_SHA256_HEX: 'sha256',
    HMAC_SHA512_HEX: 'sha512',
  }[req.headers['X-Payload-Digest-Alg']];
  if (!algo) {
    throw new Error('Unsupported algorithm');
  }

  const body = await req.body();
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, env.SUMSUB_SECRET_KEY);
  const calculatedDigest = hmac.update(body).finalize().toString(CryptoJS.enc.Hex);

  return calculatedDigest === req.headers['x-payload-digest'];
}

/**
 * Sanitize the KYC object to remove any sensitive information.
 * @param kyc The KYC object to sanitize.
 * @returns The sanitized KYC object.
 */
export function castKYC2SafeKYC(kyc: KYC): SafeKYC {
  return {
    externalUserId: kyc.externalUserId,
    reviewStatus: kyc.reviewStatus,
    reviewAnswer: kyc.reviewAnswer,
    moderationComment: kyc.moderationComment,
    createdAtMs: kyc.createdAtMs,
  };
}

/**
 *
 * @param webhook
 * @returns
 */
export function castWebhook2KYC(webhook: ApplicantReviewedResponse): KYC {
  return {
    inspectionId: webhook.inspectionId,
    applicantId: webhook.applicantId,
    correlationId: webhook.correlationId,
    externalUserId: webhook.externalUserId,
    levelName: webhook.levelName,
    type: webhook.type,
    reviewStatus: webhook.reviewStatus,
    moderationComment: webhook.reviewResult.moderationComment ?? null,
    clientComment: webhook.reviewResult.clientComment ?? null,
    reviewAnswer: webhook.reviewResult.reviewAnswer,
    rejectLabels: webhook.reviewResult.rejectLabels ?? null,
    reviewRejectType: webhook.reviewResult.reviewRejectType ?? null,
    createdAtMs: webhook.createdAtMs,
  };
}
