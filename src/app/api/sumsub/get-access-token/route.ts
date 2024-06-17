import { getSDKAccessToken } from '@/actions/sumsub';

export async function POST(request: Request) {
  const token = await getSDKAccessToken();

  return Response.json({ token });
}
