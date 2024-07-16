"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      Not signed in <br />
      <button
        className="bg-orange-500 rounded-md p-1 m-2"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </div>
  );
}
