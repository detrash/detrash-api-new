import { NextRequest } from 'next/server';

import { addKYC } from '@/actions/sumsub';
import { castWebhook2KYC, checkDigest } from '@/utils';

import { applicantReviewedFinalRejection, applicantReviewedSuccess } from './sumsub.mock';

describe('Sumsub', () => {
  const secretKey = 'secret-key';
  const digest = '858837c80cc74a20561b198155fb857111842a330259bb952dd7bb3045ab25a5';

  it('should store failed result', async () => {
    await addKYC(castWebhook2KYC(applicantReviewedFinalRejection));
  });

  it('should store passed result', async () => {
    await addKYC(castWebhook2KYC(applicantReviewedSuccess));
  });

  it('should validate the digest', async () => {
    const request = new NextRequest('https://example.com', {
      method: 'POST',
      body: JSON.stringify(applicantReviewedSuccess),
    });

    request.headers.set('X-Payload-Digest-Alg', 'HMAC_SHA256_HEX');
    request.headers.set('x-payload-digest', digest);

    const result = await checkDigest(request, secretKey);

    expect(result).toBe(true);
  });
});
