export type Json = { [key: string]: any };

export const Network = ((fetch) => {
  let jwt = "";

  const instance = {
    isLoggedIn() {
      return !!jwt;
    },
    logout() {
      jwt = "";
    },

    request: _request,
    backend: _backend,
  };

  async function _request(
    query: string,
    variables: Json,
    doAuth?: boolean
  ): Promise<Json> {
    const bearer = doAuth ? { Authorization: "Bearer " + jwt } : {};

    const res = await fetch(process.env.REACT_APP_HASURA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...bearer,
      },
      body: JSON.stringify({
        query: query.replace(/\s+/g, " "),
        variables: variables || {},
      }),
    });

    let json: Json;
    try {
      json = await res.json();
    } catch (e: any) {
      throw res.statusText;
    }

    if (json.errors) {
      //any GraphQL errors
      if (json.errors?.[0]?.extensions?.code === "invalid-jwt") {
        jwt = "";
        throw Error("SessionExpired");
      } else {
        throw json.errors[0];
      }
    }
    return json.data;
  }

  async function _backend(
    path: string,
    body: Json,
    doAuth?: boolean
  ): Promise<Json> {
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(doAuth ? { ...body, jwt } : body),
      });

      let json: Json;
      try {
        json = await res.json();
      } catch (e: any) {
        throw res.statusText;
      }
      if (json.error) throw json.error;

      //remove and save JWT from the reply if exists
      //should only happen for "login"
      const { jwt: newJWT, ...rest } = json;
      if (newJWT) jwt = newJWT;

      return rest;
    } catch (e: any) {
      if (e.message === "JWTExpired") {
        jwt = "";
        throw Error("SessionExpired");
      }
      throw e;
    }
  }

  return instance;
})(fetch);
