"use client";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, LogOut, Mail, User, Clock } from "lucide-react";

// helper to format dates
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString();
};

interface UserInfo {
  username: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  is_from_oauth?: boolean;
  is_verified?: boolean;
  is_admin?: boolean;
  token?: string;
  last_login?: string;
}

const Dashboard = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenCopied, setTokenCopied] = useState(false);

  const requestedUsername = searchParams?.get("username") || "";

  useEffect(() => {
    const load = async () => {
      // Wait for session to load before proceeding
      if (status === "loading") {
        return;
      }

      setLoading(true);
      setError(null);

      // determine which username to fetch
      let target = requestedUsername;
      if (!target && (session?.user as any)?.username) {
        target = (session?.user as any).username;
      }

      if (!target) {
        // No username in params and no logged-in user -> redirect to sign-in
        if (status === "unauthenticated") {
          router.push("/sign-in");
        }
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/users/${encodeURIComponent(target)}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load user");
        } else {
          setUserInfo(data.user);
          setIsOwner(!!data.isOwner);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user info");
      }

      setLoading(false);
    };

    load();
  }, [session, requestedUsername, router, status]);

  const copyToken = async () => {
    if (!userInfo?.token) return;
    try {
      await navigator.clipboard.writeText(userInfo.token);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }
  if (!userInfo) {
    return (
      <div className="max-w-md mx-auto p-6">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isOwner ? "Your account settings and information" : `Viewing ${userInfo.username}'s profile`}
            </p>
          </div>
          {isOwner && (
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-6 pb-6 border-b">
              {userInfo.avatar_url ? (
                <img
                  src={userInfo.avatar_url}
                  alt={userInfo.username}
                  className="h-28 w-28 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-28 w-28 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
              )}

              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold">{userInfo.username}</h2>
                  {userInfo.bio && <p className="text-muted-foreground text-sm mt-2">{userInfo.bio}</p>}
                </div>

                <div className="flex flex-wrap gap-2">
                  {userInfo.is_verified && (
                    <span className="inline-block px-2.5 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                      ✓ Verified
                    </span>
                  )}
                  {userInfo.is_admin && (
                    <span className="inline-block px-2.5 py-1 bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">
                      Admin
                    </span>
                  )}
                  {userInfo.is_from_oauth && (
                    <span className="inline-block px-2.5 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                      OAuth
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-6 space-y-4">
              <h3 className="font-semibold text-sm">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Username</p>
                    <p className="font-medium break-all">{userInfo.username}</p>
                  </div>
                </div>
                {userInfo.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium break-all">{userInfo.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owner Only Section */}
        {isOwner && (
          <div className="space-y-6">
            {/* PAT Token Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-sm mb-4">Developer Access</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">PAT Token (for VSCode Extension)</label>
                    <div className="mt-2 flex flex-col sm:flex-row gap-2">
                      <code className="flex-1 bg-muted px-3 py-2 rounded font-mono text-xs break-all">
                        {userInfo.token ? userInfo.token.substring(0, 20) + "..." : "-"}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToken}
                        className="w-full sm:w-auto"
                      >
                        {tokenCopied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Full Token
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Use this token to authenticate with the VSCode extension
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Login Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-sm mb-4">Account Activity</h3>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Login</p>
                    <p className="font-medium">{formatDate(userInfo.last_login)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;