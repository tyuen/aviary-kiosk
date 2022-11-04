import { REPLY_HEADERS } from "../utils";

//allow CORS
export async function onRequestOptions({ request }) {
  const origin = request.headers.get("Origin");
  if (
    origin &&
    (origin.startsWith("https://") || origin.startsWith("http://"))
  ) {
    return new Response("CORS Allowed", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "3600",
      },
    });
  } else {
    return new Response("Invalid Origin", { status: 401 });
  }
}

//allow all requests only if these headers are set
async function onRequestGeneric({ request, next }) {
  if (
    request.headers.get("Content-Type") !== "application/json" ||
    request.headers.get("X-Requested-With") !== "XMLHttpRequest"
  ) {
    return new Response("Invalid Content-Type, X-Requested-With", {
      status: 401,
    });
  } else {
    try {
      return await next();
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message || e }), {
        status: 403,
        headers: REPLY_HEADERS,
      });
    }
  }
}

export const onRequestPost = onRequestGeneric;
export const onRequestGet = onRequestGeneric;
