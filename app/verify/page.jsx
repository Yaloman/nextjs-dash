"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export default function VerifyPage() {
  const { data: session, status } = useSession();
  const [email, setEmail]   = useState("");
  const [code,  setCode]    = useState("");
  const [step, setStep] = useState("email"); // remove <"email" | "code">
const [msg, setMsg] = useState(null); 

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => signIn("discord")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl">
          Log in with Discord
        </button>
      </div>
    );
  }

  const discordId = session.user?.discordId;
if (!discordId) {
  // handle missing ID
}   // now guaranteed

  const sendEmail = async () => {
    setMsg(null);
    const res = await fetch("http://localhost:3001/send-verification-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, discordId }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Couldn't send email");
    setStep("code");
  };

  const verifyCode = async () => {
    setMsg(null);
    const res = await fetch("http://localhost:3001/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discordId, code }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Wrong code");
    setMsg("✅ Verification complete! You can return to Discord.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
        <h1 className="text-xl font-bold mb-6 text-center">
          🔒 Email verification for {session.user.name}
        </h1>

        {step === "email" ? (
          <>
            <input
              className="w-full p-2 border rounded mb-4"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendEmail}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Send code
            </button>
          </>
        ) : (
          <>
            <input
              className="w-full p-2 border rounded mb-4"
              type="text"
              placeholder="6‑digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={verifyCode}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Verify
            </button>
          </>
        )}

        {msg && <p className="mt-4 text-center text-sm text-red-600">{msg}</p>}
      </div>
    </div>
  );
}
