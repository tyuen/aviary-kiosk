import { SignJWT, importPKCS8 } from "jose";

//https://github.com/panva/jose
//https://github.com/hasura/learn-graphql/issues/177
//https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9

export async function generateJWT(
  env: ENV,
  id: string,
  role: string
): Promise<string> {
  const token = await new SignJWT({
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": [role],
      "x-hasura-default-role": role,
      "x-hasura-user-id": id,
    },
  })
    .setProtectedHeader({ alg: "RS256" })
    .setExpirationTime("6h")
    .sign(
      await importPKCS8(env.HASURA_PRIVATE_KEY.replace(/\\n/g, "\n"), "RS256")
    );
  return token;
}
