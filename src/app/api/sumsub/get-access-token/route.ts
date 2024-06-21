import { getSDKAccessToken } from '@/actions/sumsub';

export async function POST(request: Request) {
  const _body = await request.json();

  // TODO extract userId from Authorization header

  const token = await getSDKAccessToken();

  return Response.json({ token });
}
