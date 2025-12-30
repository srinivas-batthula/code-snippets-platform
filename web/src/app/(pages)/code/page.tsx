"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PrismHighlighter from "@/components/PrismHighlighter";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getLanguageDisplayName } from "@/types/languages";

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publisherId: string;
  publisherName: string;
}

interface ApiResponse {
  success: boolean;
  snippets: Snippet[];
  pagination: {
    totalCount: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    nextCursor: string | null;
  };
  message?: string; // For error cases
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

// Function to limit code to lines for preview
const limitCodeToLines = (code: string, maxLines: number = 6) => {
  const lines = code.split("\n");
  const limitedLines = lines.slice(0, maxLines);
  return {
    code: limitedLines.join("\n"),
    hasMore: lines.length > maxLines,
  };
};

export default function CodePage() {
  const router = useRouter();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch snippets on component mount
  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/snippets/web/getAll?limit=20");

        if (!response.ok) {
          throw new Error("Failed to fetch snippets");
        }

        const data: ApiResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message || "API returned error");
        }

        setSnippets(data.snippets);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch snippets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  const handleSnippetClick = (snippet: Snippet) => {
    // Store snippet data in sessionStorage to avoid refetching
    sessionStorage.setItem("currentSnippet", JSON.stringify(snippet));
    router.push(`/snippets/${snippet.id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Code Snippets</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading snippets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Code Snippets</h1>
        <div className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Code Snippets</h1>
        <Button onClick={() => router.push("/search")} variant="outline">
          Search Snippets
        </Button>
      </div>

      {snippets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No snippets found.</p>
          <Button onClick={() => router.push("/editor")} variant="outline">
            Create Your First Snippet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {snippets.map((snippet) => (
            <Card
              key={snippet.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleSnippetClick(snippet)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-semibold flex-1 pr-4">
                    {snippet.title}
                  </CardTitle>
                  <CardAction>
                    <Button variant="secondary" size="sm">
                      {getLanguageDisplayName(snippet.language || "text")}
                    </Button>
                  </CardAction>
                </div>
                {snippet.description && (
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                    {snippet.description}
                  </p>
                )}
              </CardHeader>

              <CardContent>
                {/* Tags */}
                {snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {snippet.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getPillColorForTag(
                          tag,
                        )}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {snippet.tags.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium border bg-muted text-muted-foreground border-border">
                        +{snippet.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
                <span>By {snippet.publisherName}</span>
                <span>{formatDate(snippet.createdAt)}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
