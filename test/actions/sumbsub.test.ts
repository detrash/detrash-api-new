import { NextRequest } from 'next/server';

import { addKYC } from '@/actions/sumsub';
import { env } from '@/env';
import { castWebhook2KYC, checkDigest } from '@/utils';

import { applicantReviewedFinalRejection, applicantReviewedSuccess } from './sumsub.mock';

describe('Sumsub', () => {
  const secretKey = env.SUMSUB_SECRET_KEY;
  const digest = '60fffd53d8d81491bb237518c1caf0c03d7fc91ebfe45da0d50c5f197588ca8d';

  it('should store failed result', async () => {
    await addKYC(castWebhook2KYC(applicantReviewedFinalRejection));
  });

  it('should store passed result', async () => {
    await addKYC(castWebhook2KYC(applicantReviewedSuccess));
  });

  it('should validate the digest', async () => {
    const request = new NextRequest('https://example.com', {
      method: 'POST',
      body: JSON.stringify({
        applicantId: '667d395322f209432df7298e',
        inspectionId: '667d395322f209432df7298f',
        applicantType: 'individual',
        correlationId: '955ea5b0cc7a118532d927ae9f13a5ad',
        levelName: 'basic-kyc-level',
        sandboxMode: true,
        externalUserId: 'level-b222f906-66e5-4268-a985-78e8dbb88d92',
        type: 'applicantCreated',
        reviewStatus: 'init',
        createdAt: '2024-06-28 10:40:16+0000',
        createdAtMs: '2024-06-28 10:40:16.575',
        clientId: 'recy.life',
      }),
    });

    request.headers.set('X-Payload-Digest-Alg', 'HMAC_SHA256_HEX');
    request.headers.set('x-payload-digest', digest);

    const result = await checkDigest(request, secretKey);

    expect(result).toBe(true);
  });
});
