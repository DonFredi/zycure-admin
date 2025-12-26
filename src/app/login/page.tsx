"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Redirect if already logged in
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok && !res.error) {
      setEmail("");
      setPassword("");
      router.push("/dashboard"); // manually redirect
    } else {
      alert("Invalid credentials or not admin");
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h2 className="font-bold mt-4 text-2xl">Log in to ZyCure Admin App</h2>

      <div className="flex flex-col gap-3 p-4 w-75 mx-auto mt-20">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>

        <p>
          Forgot password?{" "}
          <Link href="/components/AdminChangePassword" className="">
            Reset password
          </Link>
        </p>
      </div>
    </div>
  );
}
