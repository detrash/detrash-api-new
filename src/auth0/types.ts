export interface JWK {
  /** Key Type */
  kty: string;
  /** Key Usage */
  use: string;
  /** RSA Modulus */
  n: string;
  /** RSA Exponent */
  e: string;
  /** Key ID */
  kid: string;
  /** X.509 Certificate Thumbprint (SHA-1) */
  x5t: string;
  /** X.509 Certificate Chain */
  x5c: string[];
  /** Algorithm */
  alg: string;
}
