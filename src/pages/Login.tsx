import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { Network } from "network";
import { useProfile } from "components/ProfileProvider";

const GET_USER_PK = `
query login($id: uuid!) {
  users_by_pk(id: $id) { banned email id name }
}`;

export default function Login() {
  const profile = useProfile();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { error, isLoading, mutate } = useMutation(
    async (param: any) => {
      const { id } = await Network.backend("api/login", param);
      const { users_by_pk } = await Network.request(GET_USER_PK, { id }, true);
      return users_by_pk;
    },
    {
      onSuccess: (data) => {
        if (data?.id) {
          profile.setState(data);
          navigate("/");
        }
      },
    }
  );

  const submit = (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  const isEmail = /^[^@]+@[^@]{3,}\.\w{2,}$/.test(email);

  return (
    <div className="flex flex-col items-center justify-center grow">
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border"
        />
        <button
          type="submit"
          disabled={isLoading || !isEmail}
          className="border"
        >
          Login
        </button>
      </form>
    </div>
  );
}
