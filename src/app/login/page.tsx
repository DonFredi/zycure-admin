"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetting, setResetting] = useState(false); // loading state
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

  const handleResetPassword = async () => {
    if (!email) return console.error("Enter your email first");

    try {
      setResetting(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Password reset link:", data.link);
        alert("Password reset email sent!");
      } else {
        console.error(data.error);
        alert("Failed to send reset email");
      }
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h2 className="font-bold mt-4 text-2xl">Log in</h2>

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
          <button
            className="underline text-blue-600 hover:no-underline"
            onClick={handleResetPassword}
            disabled={resetting}
          >
            {resetting ? "Sending..." : "Reset Password"}
          </button>
        </p>
      </div>
    </div>
  );
}
