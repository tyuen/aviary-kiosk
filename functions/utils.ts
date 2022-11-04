declare global {
  type Json = { [key: string]: any };
  type StringOnlyJson = { [key: string]: string };
  type ENV = { [key: string]: string };
  type CFContext = EventContext<ENV, any, any>;
}

export const REPLY_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
};

export function isExpiredJWT(json: Json): boolean {
  const err = json.errors ? json.errors[0] : null;
  if (err && err.extensions) {
    if (err.extensions.code === "invalid-jwt") {
      return true;
    }
  }
  return false;
}

export async function sendRequest(
  env: ENV,
  query: string,
  variables: Json
): Promise<Json> {
  const resp = await fetch(env.REACT_APP_HASURA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + env.HASURA_ADMIN_JWT,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const obj: Json = await resp.json();
  if (obj.errors) throw obj.errors[0];
  return obj.data;
}
