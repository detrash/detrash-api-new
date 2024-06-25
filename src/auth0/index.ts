/* eslint-disable unused-imports/no-unused-vars */

import { AppRouteHandlerFnContext } from '@auth0/nextjs-auth0';
import * as jose from 'jose';
import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';

export interface Auth0Params {
  email: string;
}

export type AppRouteBearerHandlerFn = (
  /**
   * Incoming request object.
   */
  req: NextRequest & { auth: Auth0Params },
  /**
   * Context properties on the request (including the parameters if this was a
   * dynamic route).
   */
  ctx: AppRouteHandlerFnContext,
) => Promise<Response> | Response;

export type WithApiAuthRequiredAppRoute = (
  apiRoute: AppRouteBearerHandlerFn,
) => AppRouteBearerHandlerFn;

export const withApiAuthRequired: WithApiAuthRequiredAppRoute = (
  apiRoute: AppRouteBearerHandlerFn,
) => {
  return async (req, resOrParams) => {
    return appRouteHandler(apiRoute)(req, resOrParams);
  };
};

const appRouteHandler =
  (apiRoute: AppRouteBearerHandlerFn) =>
  async (
    req: NextRequest & { auth: any },
    params: AppRouteHandlerFnContext,
  ): Promise<NextResponse> => {
    const res = new NextResponse();

    const token = req.headers.get('authorization');

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const bearerExtracted = token.slice('Bearer '.length);

    // Get public key from Auth0
    const jwksPath = `https://${env.AUTH0_ISSUER_DOMAIN}/.well-known/jwks.json`;

    const JWKS = jose.createRemoteJWKSet(new URL(jwksPath));

    const { payload } = await jose.jwtVerify(bearerExtracted, JWKS, {
      issuer: `https://${env.AUTH0_ISSUER_DOMAIN}/`,
      requiredClaims: ['email'],
    });

    req.auth = payload;

    const apiRes: NextResponse | Response = await apiRoute(req, params);
    const nextApiRes: NextResponse =
      apiRes instanceof NextResponse ? apiRes : new NextResponse(apiRes.body, apiRes);

    return nextApiRes;
  };
