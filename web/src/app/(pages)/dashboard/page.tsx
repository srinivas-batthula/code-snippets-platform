//demo purpose
"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";


const dashboard = () => {
  const { data: session } = useSession();
  if (!session) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <h3>Hello {session.user?.name},</h3>
      <p>{session.user?.email}</p>

      {/* LogOut btn... */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-4 py-2 bg-red-500 text-white rounded"
        style={{ width: '6rem', height: '2.5rem', fontSize: '1.1rem', borderRadius: '1.5rem', marginTop: '1rem', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  )
}

export default dashboard