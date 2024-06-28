import { NextRequest, NextResponse } from 'next/server';

import { addKYC } from '@/actions';
import { castWebhook2KYC, checkDigest } from '@/utils';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Verify the request if it's coming from Sumsub
  const result = await checkDigest(req);

  if (!result) {
    return NextResponse.json({ status: 'Error' }, { status: 401 });
  }

  const body = await req.json();

  switch (body.type) {
    case 'applicantReviewed':
      await addKYC(castWebhook2KYC(body));
      break;
    default:
      console.log(`Unknown webhook type: ${body.type}`);
      return NextResponse.json({ status: 'Error' }, { status: 400 });
  }

  return NextResponse.json({ status: 'Ok' });
}
