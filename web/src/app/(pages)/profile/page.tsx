import { Suspense } from "react";
import ProfileClient from "./profile-client";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading profile...</div>}>
      <ProfileClient />
    </Suspense>
  );
}
