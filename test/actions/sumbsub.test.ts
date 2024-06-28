import { NextRequest } from 'next/server';

import { addKYC } from '@/actions/sumsub';
import { env } from '@/env';
import { castWebhook2KYC, checkDigest } from '@/utils';

import { applicantReviewedFinalRejection, applicantReviewedSuccess } from './sumsub.mock';

describe('Sumsub', () => {
  const secretKey = env.SUMSUB_SECRET_KEY;
  const digest = '2d2bdee4fe1397bd753ab2b3026c4baa424f866f38f387b74a633b8193d95044';

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
        correlationId: 'f5fc66f9941801ab78829808d389d20c',
        levelName: 'basic-kyc-level',
        sandboxMode: true,
        externalUserId: 'level-b222f906-66e5-4268-a985-78e8dbb88d92',
        type: 'applicantCreated',
        reviewStatus: 'init',
        createdAt: '2024-06-28 10:23:17+0000',
        createdAtMs: '2024-06-28 10:23:17.624',
        clientId: 'recy.life',
      }),
    });

    request.headers.set('X-Payload-Digest-Alg', 'HMAC_SHA256_HEX');
    request.headers.set('x-payload-digest', digest);

    const result = await checkDigest(request, secretKey);

    expect(result).toBe(true);
  });
});
