import { pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const reviewAnswers = ['RED', 'GREEN'] as const;
export type ReviewAnswer = (typeof reviewAnswers)[number];
export const reviewAnswerEnum = pgEnum('enum_reviewAnswer', reviewAnswers);

export const reviewRejectTypes = ['FINAL', 'RETRY'] as const;
export type ReviewRejectType = (typeof reviewRejectTypes)[number];
export const reviewRejectTypeEnum = pgEnum('enum_reviewStatus', reviewRejectTypes);

export const kycs = pgTable('kycs', {
  inspectionId: varchar('inspectionId').notNull().primaryKey(),
  applicantId: varchar('applicantId').notNull(),
  correlationId: varchar('correlationId').notNull(),
  externalUserId: varchar('externalUserId').notNull(),
  levelName: varchar('levelName').notNull(),
  type: varchar('type').notNull(),
  reviewStatus: varchar('reviewStatus').notNull(),
  moderationComment: text('moderationComment'),
  clientComment: text('clientComment'),
  reviewAnswer: reviewAnswerEnum('reviewAnswer').notNull(),
  rejectLabels: varchar('rejectLabels').array(),
  reviewRejectType: reviewRejectTypeEnum('reviewRejectType'),
  createdAtMs: varchar('createdAtMs').notNull(),
});

export type KYC = typeof kycs.$inferSelect;
export type SafeKYC = Pick<
  KYC,
  'externalUserId' | 'reviewStatus' | 'reviewAnswer' | 'moderationComment' | 'createdAtMs'
>;
