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
import { ArrowLeft, Loader2 } from "lucide-react";

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  code: string;
  createdAt: string;
  updatedAt: string;
}

// Define 7 different pill colors
const pillColors = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-red-100 text-red-800 border-red-200",
];

// Function to get random color for pills
const getRandomPillColor = () => {
  return pillColors[Math.floor(Math.random() * pillColors.length)];
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

  const id = params.id as string;

  useEffect(() => {
    const loadSnippet = () => {
      try {
        // Get snippet data from sessionStorage
        const storedSnippet = sessionStorage.getItem("currentSnippet");

        if (storedSnippet) {
          const parsedSnippet = JSON.parse(storedSnippet) as Snippet;
          // Verify the ID matches the URL parameter
          if (parsedSnippet.id === id) {
            setSnippet(parsedSnippet);
            setLoading(false);
          } else {
            setError(
              "Snippet ID mismatch. Please go back and select a snippet.",
            );
            setLoading(false);
          }
        } else {
          // Fallback: redirect back to main page if no data found
          setError(
            "Snippet data not found. Please go back and select a snippet.",
          );
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load snippet data");
        setLoading(false);
      }
    };

    loadSnippet();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 text-lg">Loading snippet...</p>
        </div>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
          Back to Snippets
        </Button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex-1 pr-4">
              {snippet.title}
            </h1>
            <Button variant="secondary" size="lg">
              {snippet.language}
            </Button>
          </div>

          {snippet.description && (
            <p className="text-gray-600 text-lg mb-4">{snippet.description}</p>
          )}

          {/* Tags */}
          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {snippet.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getRandomPillColor()}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Code */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="rounded-lg overflow-hidden">
              <PrismHighlighter
                code={snippet.code}
                language={snippet.language.toLowerCase()}
                showLineNumbers={true}
                showCopyButton={true}
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <span>Created: {formatDate(snippet.createdAt)}</span>
          <span>Updated: {formatDate(snippet.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
