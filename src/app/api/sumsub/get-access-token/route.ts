import { NextResponse } from 'next/server';

import { getSDKAccessToken } from '@/actions/sumsub';
import { withApiAuthRequired } from '@/auth0';

const getAccessToken = withApiAuthRequired(async (req) => {
  const token = await getSDKAccessToken({ userId: req.auth.email });

  return NextResponse.json({ token });
});

export { getAccessToken as POST };
