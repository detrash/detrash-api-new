import { type ApplicantReviewedResponse } from '@/actions/sumsub';

export const applicantReviewedFinalRejection: ApplicantReviewedResponse = {
  applicantId: '5cb744200a975a67ed1798a4',
  inspectionId: '5cb744200a975a67ed1798a5',
  correlationId: 'req-fa94263f-0b23-42d7-9393-ab10b28ef42d',
  externalUserId: 'externalUserId',
  levelName: 'basic-kyc-level',
  type: 'applicantReviewed',
  reviewResult: {
    moderationComment:
      'We could not verify your profile. If you have any questions, please contact the Company where you try to verify your profile ${clientSupportEmail}',
    clientComment: ' Suspected fraudulent account.',
    reviewAnswer: 'RED',
    rejectLabels: ['UNSATISFACTORY_PHOTOS', 'GRAPHIC_EDITOR', 'FORGERY'],
    reviewRejectType: 'FINAL',
  },
  reviewStatus: 'completed',
  createdAtMs: '2020-02-21 13:23:19.001',
};

export const applicantReviewedSuccess: ApplicantReviewedResponse = {
  applicantId: '5cb56e8e0a975a35f333cb83',
  inspectionId: '5cb56e8e0a975a35f333cb84',
  correlationId: 'req-a260b669-4f14-4bb5-a4c5-ac0218acb9a4',
  externalUserId: 'externalUserId',
  levelName: 'basic-kyc-level',
  type: 'applicantReviewed',
  reviewResult: {
    reviewAnswer: 'GREEN',
  },
  reviewStatus: 'completed',
  createdAtMs: '2020-02-21 13:23:19.321',
};
