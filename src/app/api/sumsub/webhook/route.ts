import { NextApiRequest } from 'next';

import { addKYC } from '@/actions';
import { castWebhook2KYC, checkDigest } from '@/utils';

export async function POST(req: NextApiRequest) {
  const result = await checkDigest(req);

  if (!result) {
    return Response.json({ status: 'Error' }, { status: 401 });
  }

  const body = await req.body();

  switch (body.type) {
    case 'applicantReviewed':
      await addKYC(castWebhook2KYC(body));
      break;
    default:
      console.log(`Unknown webhook type: ${body.type}`);
      return Response.json({ status: 'Error' }, { status: 400 });
  }

  return Response.json({ status: 'Ok' });
}
