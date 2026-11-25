"use client";

import { authClient } from "@/lib/auth-client";
import { FormEvent, useState } from "react";

export default function SignInPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function register(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    setPending(true);

    const data = new FormData(e.currentTarget);

    const email = String(data.get("email"));

    const password = String(data.get("password"));

    try {
      const { error } = await authClient.signIn.email({
        email: email,
        password: password,
      });

      if (!!error) {
        setError(error.message!);
      }

      setPending(false);
    } catch {
      console.log("Ошибка регистрации");
      setError("Неизвестная ошибка");
      setPending(false);
    }
  }

  return (
    <div className="flex flex items-center justify-center flex-col h-screen gap-10 ">
      <h1 className="text-4xl font-bold">Sign in</h1>
      <form
        className="flex flex-col gap-2 border border-white bg-zinc-400 p-4 rounded-2xl"
        onSubmit={register}
      >
        <input
          name="email"
          placeholder="Email"
          className="border border-black rounded-2xl p-2"
        />
        <input
          name="password"
          placeholder="password"
          type="password"
          className="border border-black rounded-2xl p-2"
        />
        <button
          disabled={pending === true}
          type="submit"
          className="bg-green-600 text-white"
        >
          Sign in
        </button>
        {pending && <p>Форма отправляется</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
