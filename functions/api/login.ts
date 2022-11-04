import { generateJWT } from "../generateJWT.js";
import { REPLY_HEADERS, sendRequest } from "../utils.js";

const QUERY = `
query login($email: String!) {
  users(where: {email: {_eq: $email}}, limit: 1) {
    banned id password
  }
}`;

export async function onRequestPost({ request, env }: CFContext) {
  const { email, password }: StringOnlyJson = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw "Email has invalid format";
  }

  if (email.length > 50) throw "Email too long";

  if (!password || password.length < 8) {
    throw "Password too short";
  }

  const { users } = await sendRequest(env, QUERY, { email });

  if (users.length < 1) throw "Invalid email or password";

  const record = users[0];

  if (record.banned) throw "User is locked";

  if (record.password !== password) throw "Invalid email or password";

  const jwt = await generateJWT(env, record.id, "user");

  return new Response(JSON.stringify({ id: record.id, jwt }), {
    status: 200,
    headers: REPLY_HEADERS,
  });
}
