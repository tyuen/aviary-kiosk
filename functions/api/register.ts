import { generateJWT } from "../generateJWT.js";
import { REPLY_HEADERS, sendRequest } from "../utils.js";

const MUTATION = `
mutation register(
  $email: String!, $name: String!, $password: String!) {
  user: insert_users_one(object: {email: $email, name: $name, password: $password}) {
    id
  }
}`;

export async function onRequestPost({ request, env }: CFContext) {
  const { email, password, name }: StringOnlyJson = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw "Email has invalid format";
  }

  if (email.length > 50) throw "Email too long";

  if (!name || name.length > 50) throw "Display name too long";

  if (!password || password.length < 8) {
    throw "Password too short";
  }

  let id: string;
  try {
    const { user } = await sendRequest(env, MUTATION, {
      email,
      password,
      name,
    });
    id = user.id;
  } catch (e: any) {
    throw "Email already registered";
  }

  //TODO: send verification email

  const jwt = await generateJWT(env, id, "user");

  return new Response(JSON.stringify({ id, jwt }), {
    status: 200,
    headers: REPLY_HEADERS,
  });
}
