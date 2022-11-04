import { jwtVerify, importSPKI } from "jose";

//https://github.com/panva/jose

export async function decodeJWT(env: ENV, jwt: string) {
  const publicKey = await importSPKI(
    env.HASURA_PUBLIC_KEY.replace(/\\n/g, "\n"),
    "RS256"
  );
  const { payload } = await jwtVerify(jwt, publicKey);
  return payload;
}

export async function verifyJWT(
  env: ENV,
  id: string,
  jwt: string
): Promise<true> {
  let obj;
  try {
    obj = await decodeJWT(env, jwt);
  } catch (e: any) {
    if (e && e.code === "ERR_JWT_EXPIRED") {
      throw "JWTExpired";
    } else throw e;
  }

  const expiry = obj.exp;
  //jwtVerify "might" also verify the [exp] value
  if (expiry && expiry < Date.now() / 1000) throw "JWTExpired";

  const claim: any = obj["https://hasura.io/jwt/claims"];
  const jwtID = claim["x-hasura-user-id"];
  if (!id || jwtID !== id) throw "Login token mismatch";

  return true;
}
