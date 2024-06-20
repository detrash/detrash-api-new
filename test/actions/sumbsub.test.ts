import { addKYC } from '@/actions/sumsub';
import { castWebhook2KYC } from '@/utils';

import { applicantReviewedFinalRejection, applicantReviewedSuccess } from './sumsub.mock';

describe('Sumsub', () => {
  it('should store failed result', async () => {
    await addKYC(castWebhook2KYC(applicantReviewedFinalRejection));
  });

  it('should store passed result', async () => {
    await addKYC(castWebhook2KYC(applicantReviewedSuccess));
  });
});
