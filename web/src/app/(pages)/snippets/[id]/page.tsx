"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PrismHighlighter from "@/components/PrismHighlighter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Copy, Check } from "lucide-react";
import { getLanguageDisplayName } from "@/types/languages";

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  code: string;
  createdAt: string;
  updatedAt: string;
  publisherId: string;
  publisherName: string;
}

// Define colors for tags using CSS custom properties
const pillColors = [
  "bg-chart-1/20 text-chart-1 border-chart-1/30",
  "bg-chart-2/20 text-chart-2 border-chart-2/30",
  "bg-chart-3/20 text-chart-3 border-chart-3/30",
  "bg-chart-4/20 text-chart-4 border-chart-4/30",
  "bg-chart-5/20 text-chart-5 border-chart-5/30",
  "bg-accent/20 text-accent-foreground border-accent/30",
  "bg-secondary/20 text-secondary-foreground border-secondary/30",
];

// Deterministic color assignment based on tag content
const getPillColorForTag = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    const char = tag.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const colorIndex = Math.abs(hash) % pillColors.length;
  return pillColors[colorIndex];
};

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function SnippetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch snippet from API
        console.log("Fetching snippet from API...");
        const response = await fetch(`/api/snippets/import/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Snippet not found");
          } else {
            setError("Failed to fetch snippet");
          }
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!data.ok) {
          setError(data.message || "Failed to fetch snippet");
          setLoading(false);
          return;
        }

        setSnippet(data.snippet);
        setLoading(false);
      } catch (err) {
        console.error("Error loading snippet:", err);
        setError("Failed to load snippet data");
        setLoading(false);
      }
    };

    loadSnippet();
  }, [id]);

  const copyToClipboard = async () => {
    if (!snippet?.code) return;

    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-lg">Loading snippet...</p>
        </div>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded">
          Error: {error || "Snippet not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-foreground flex-1 pr-4">
              {snippet.title}
            </h1>
            <div className="flex gap-2">
              <Button variant="secondary" size="default">
                {getLanguageDisplayName(snippet.language || "text")}
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </div>

          {snippet.description && (
            <p className="text-muted-foreground text-lg mb-4">
              {snippet.description}
            </p>
          )}

          {/* Tags */}
          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {snippet.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getPillColorForTag(
                    tag,
                  )}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          
        </div>

        {/* Code */}
        <Card className="mb-6 p-1 rounded-lg">
          <CardContent className="p-0 m-0">
            <div className="rounded-lg overflow-hidden">
              {snippet.code ? (
                <PrismHighlighter
                  code={snippet.code}
                  language={(snippet.language || "text").toLowerCase()}
                  showLineNumbers={true}
                  showCopyButton={true}
                  className="text-sm"
                />
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No code content available for this snippet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

          {/* Author and Date Info */}

        <div className="flex items-center justify-around gap-4 text-sm text-muted-foreground mb-6 p-3 bg-muted/30 rounded-lg">
            <span>
              <strong>Author:</strong> {snippet.publisherName}
            </span>
            {/* <span>•</span> */}
            <span>
              <strong>Created:</strong> {formatDate(snippet.createdAt)}
            </span>
            {/* <span>•</span> */}
            <span>
              <strong>Updated:</strong> {formatDate(snippet.updatedAt)}
            </span>
          </div>

        {/* Related Actions */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => router.push("/search")}>
            Browse More Snippets
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const searchParams = new URLSearchParams();
                searchParams.set("language", snippet.language);
                router.push(`/search?${searchParams.toString()}`);
              }}
            >
              More {getLanguageDisplayName(snippet.language)} Snippets
            </Button>

            {snippet.tags.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  const searchParams = new URLSearchParams();
                  searchParams.set("tag", snippet.tags[0]);
                  router.push(`/search?${searchParams.toString()}`);
                }}
              >
                More "{snippet.tags[0]}" Snippets
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
