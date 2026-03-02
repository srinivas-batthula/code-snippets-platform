"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PrismHighlighter from "@/components/PrismHighlighter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Copy, Check } from "lucide-react";

interface Snapshot {
  id: string;
  title: string;
  description?: string;
  settings: Record<string, any>;
  extensions: string[];
  keybindings?: Record<string, any>[];
  createdAt: string;
  updatedAt: string;
  publisherId: string;
  publisherName: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function SnapshotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    const loadSnapshot = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/snapshots/import/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Snapshot not found");
          } else {
            setError("Failed to fetch snapshot");
          }
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!data.ok) {
          setError(data.message || "Failed to fetch snapshot");
          setLoading(false);
          return;
        }

        setSnapshot(data.snapshot);
        setLoading(false);
      } catch (err) {
        console.error("Error loading snapshot:", err);
        setError("Failed to load snapshot data");
        setLoading(false);
      }
    };

    loadSnapshot();
  }, [id]);

  const settingsCount = snapshot
    ? Object.keys(snapshot.settings || {}).length
    : 0;
  const extensionsCount = snapshot ? snapshot.extensions?.length || 0 : 0;
  const keybindingsCount = snapshot ? snapshot.keybindings?.length || 0 : 0;

  // Limit displayed items for a more readable UI
  const MAX_ITEMS = 10;

  const visibleExtensions =
    snapshot && snapshot.extensions
      ? snapshot.extensions.slice(0, MAX_ITEMS)
      : [];
  const hasMoreExtensions = extensionsCount > MAX_ITEMS;

  const settingsEntries =
    snapshot && snapshot.settings
      ? Object.entries(snapshot.settings)
      : [];
  const visibleSettingsEntries = settingsEntries.slice(0, MAX_ITEMS);
  const limitedSettingsObject = Object.fromEntries(visibleSettingsEntries);
  const hasMoreSettings = settingsEntries.length > MAX_ITEMS;

  const visibleKeybindings =
    snapshot && snapshot.keybindings
      ? snapshot.keybindings.slice(0, MAX_ITEMS)
      : [];
  const hasMoreKeybindings = keybindingsCount > MAX_ITEMS;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-lg">Loading snapshot...</p>
        </div>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded">
          Error: {error || "Snapshot not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Search
        </Button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between mb-1 gap-4">
              <h1 className="text-3xl font-bold text-foreground flex-1 pr-4">
                {snapshot.title}
              </h1>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                Snapshot
              </span>
            </div>

            {/* ID + copy */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">ID:</span>
              <code className="rounded bg-muted px-2 py-1 text-[11px] break-all">
                {snapshot.id}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(snapshot.id);
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2000);
                  } catch (err) {
                    console.error("Failed to copy ID:", err);
                  }
                }}
                className="h-7 px-2 text-xs flex items-center gap-1"
              >
                {copiedId ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy ID
                  </>
                )}
              </Button>
            </div>

            {snapshot.description && (
              <p className="text-muted-foreground text-lg">
                {snapshot.description}
              </p>
            )}
          </div>

          {/* Counts summary */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <div className="rounded-md border border-border bg-muted/40 px-3 py-3 text-center">
              <div className="text-foreground font-semibold text-base">
                {extensionsCount}
              </div>
              <div>extensions</div>
            </div>
            <div className="rounded-md border border-border bg-muted/40 px-3 py-3 text-center">
              <div className="text-foreground font-semibold text-base">
                {settingsCount}
              </div>
              <div>settings</div>
            </div>
            <div className="rounded-md border border-border bg-muted/40 px-3 py-3 text-center">
              <div className="text-foreground font-semibold text-base">
                {keybindingsCount}
              </div>
              <div>keybindings</div>
            </div>
          </div>
        </div>

        {/* Extensions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Extensions</CardTitle>
          </CardHeader>
          <CardContent>
            {snapshot.extensions && snapshot.extensions.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2 mb-2">
                  {visibleExtensions.map((ext: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border bg-secondary/20 text-secondary-foreground border-secondary/40"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
                {hasMoreExtensions && (
                  <p className="text-muted-foreground text-xs">
                    +{extensionsCount - MAX_ITEMS} more extension
                    {extensionsCount - MAX_ITEMS === 1 ? "" : "s"} not shown
                    here.
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                No extensions recorded for this snapshot.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Settings JSON */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Settings (settings.json)</CardTitle>
          </CardHeader>
          <CardContent>
            {settingsCount > 0 ? (
              <>
                <PrismHighlighter
                  code={JSON.stringify(limitedSettingsObject, null, 2)}
                  language="json"
                  showLineNumbers={false}
                  className="text-xs"
                />
                {hasMoreSettings && (
                  <p className="text-muted-foreground text-xs mt-2">
                    Showing first {MAX_ITEMS} settings, +{" "}
                    {settingsEntries.length - MAX_ITEMS} more key
                    {settingsEntries.length - MAX_ITEMS === 1 ? "" : "s"} in
                    this snapshot.
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                No settings found in this snapshot.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Keybindings JSON */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">
              Keybindings (keybindings.json)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {keybindingsCount > 0 ? (
              <>
                <PrismHighlighter
                  code={JSON.stringify(visibleKeybindings, null, 2)}
                  language="json"
                  showLineNumbers={false}
                  className="text-xs"
                />
                {hasMoreKeybindings && (
                  <p className="text-muted-foreground text-xs mt-2">
                    Showing first {MAX_ITEMS} keybindings, +{" "}
                    {keybindingsCount - MAX_ITEMS} more not shown here.
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                No keybindings found in this snapshot.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Meta info */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground mb-2">
          <span>
            <strong>Author:</strong> {snapshot.publisherName}
          </span>
          <span>
            <strong>Created:</strong> {formatDate(snapshot.createdAt)}
          </span>
          <span>
            <strong>Updated:</strong> {formatDate(snapshot.updatedAt)}
          </span>
        </div>

        {/* Back to search */}
        <div className="mt-4 flex justify-between">
          <Button variant="outline" onClick={() => router.push("/search")}>
            Back to Search
          </Button>
        </div>
      </div>
    </div>
  );
}


