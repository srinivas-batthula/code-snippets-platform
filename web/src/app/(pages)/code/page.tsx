"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PrismHighlighter from "@/components/PrismHighlighter";
import { Button } from "@/components/ui/button";

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

interface ApiResponse {
  ok: boolean;
  snippets: Snippet[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSnippets: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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

// SWR fetcher function
const fetcher = async (url: string): Promise<ApiResponse> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch snippets");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("API returned error");
  }

  return data;
};

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

// Function to limit code to lines and calculate height
const limitCodeToLines = (code: string, maxLines: number = 3) => {
  const lines = code.split("\n");
  const limitedLines = lines.slice(0, maxLines);
  const actualLineCount = Math.min(lines.length, maxLines);

  return {
    code: limitedLines.join("\n"),
    lineCount: actualLineCount,
    // Calculate height: base height + (line height * number of lines)
    // Using approximate 20px per line + 8px padding
    height: Math.max(60, actualLineCount * 20 + 16),
  };
};

// TagsWithOverflow component
const TagsWithOverflow = ({ tags }: { tags: string[] }) => {
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [hiddenTags, setHiddenTags] = useState<string[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || tags.length === 0) return;

    const calculateVisibleTags = () => {
      const container = containerRef.current;
      if (!container) return;

      // Create a temporary element to measure tag widths
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.visibility = "hidden";
      tempContainer.style.whiteSpace = "nowrap";
      tempContainer.style.display = "flex";
      tempContainer.style.gap = "8px";
      document.body.appendChild(tempContainer);

      const containerWidth = container.offsetWidth;
      let currentWidth = 0;
      let visibleCount = 0;
      const GAP_SIZE = 8;
      const OVERFLOW_PILL_WIDTH = 40; // Estimated width for +N pill

      for (let i = 0; i < tags.length; i++) {
        // Create temporary tag element
        const tempTag = document.createElement("span");
        tempTag.className =
          "px-2 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200";
        tempTag.textContent = tags[i];
        tempContainer.appendChild(tempTag);

        const tagWidth = tempTag.offsetWidth;
        const widthWithGap = currentWidth + tagWidth + (i > 0 ? GAP_SIZE : 0);

        // Check if we need to reserve space for +N pill
        const needsOverflowPill = i < tags.length - 1;
        const totalWidthNeeded =
          widthWithGap +
          (needsOverflowPill ? GAP_SIZE + OVERFLOW_PILL_WIDTH : 0);

        if (totalWidthNeeded <= containerWidth) {
          currentWidth = widthWithGap;
          visibleCount++;
        } else {
          break;
        }
      }

      document.body.removeChild(tempContainer);

      // Ensure at least one tag is visible
      visibleCount = Math.max(1, visibleCount);

      // If we need to show overflow pill, reduce visible count by 1 if necessary
      if (visibleCount < tags.length && visibleCount > 1) {
        visibleCount = Math.max(1, visibleCount - 1);
      }

      setVisibleTags(tags.slice(0, visibleCount));
      setHiddenTags(tags.slice(visibleCount));
    };

    calculateVisibleTags();

    const handleResize = () => calculateVisibleTags();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [tags]);

  if (tags.length === 0) return null;

  return (
    <div ref={containerRef} className="flex items-center gap-2 flex-1 min-w-0">
      {/* Visible tags */}
      {visibleTags.map((tag, index) => (
        <span
          key={index}
          className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getRandomPillColor()}`}
        >
          {tag}
        </span>
      ))}

      {/* Overflow indicator */}
      {hiddenTags.length > 0 && (
        <div className="relative">
          <span
            className="px-2 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors whitespace-nowrap "
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            +{hiddenTags.length}
          </span>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
              <div className="bg-card border border-gray-200/70 text-gray-900 text-xs rounded-lg py-2 px-3 shadow-lg whitespace-nowrap w-fit">
                <div className="flex flex-wrap gap-1 w-fit justify-center items-center">
                  {hiddenTags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getRandomPillColor()}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-card"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function SearchPage() {
  const router = useRouter();

  // Use SWR for data fetching and caching
  const { data, error, isLoading } = useSWR(
    "/api/snippets/getAll",
    fetcher,
    {
      revalidateOnFocus: false, // Don't refetch when window regains focus
      revalidateOnReconnect: true, // Refetch when reconnected to internet
      dedupingInterval: 60000, // Dedupe requests for 1 minute
    },
  );

  const snippets = data?.snippets || [];

  const handleSnippetClick = (snippet: Snippet) => {
    // Store snippet data in sessionStorage to avoid refetching
    sessionStorage.setItem("currentSnippet", JSON.stringify(snippet));
    router.push(`/code/${snippet.id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Code Snippets</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Code Snippets</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Code Snippets</h1>

      {snippets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No snippets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {snippets.map((snippet) => (
            <Card
              key={snippet.id}
              className="flex flex-col gap-0 h-fit cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleSnippetClick(snippet)}
            >
              <CardHeader className="">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-semibold flex-1 pr-4">
                    {snippet.title}
                  </CardTitle>
                  <CardAction>
                    <Button variant="secondary" size="sm">
                      {snippet.language}
                    </Button>
                  </CardAction>
                </div>
              </CardHeader>

              <CardContent className="py-0 my-0">
                <div className="h-8 flex items-center mb-4">
                  <TagsWithOverflow tags={snippet.tags} />
                </div>
              </CardContent>

              <CardContent className="py-0 my-0">
                <div className="relative rounded-md overflow-hidden h-full">
                  {(() => {
                    const codeData = limitCodeToLines(snippet.code, 6);
                    return (
                      <div className="h-full overflow-hidden border rounded-md border-gray-700">
                        <PrismHighlighter
                          code={codeData.code}
                          language={snippet.language.toLowerCase()}
                          showLineNumbers={false}
                          showCopyButton={true}
                          className="text-xs"
                        />
                      </div>
                    );
                  })()}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#16191d] to-transparent pointer-events-none"></div>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <div className="text-xs text-gray-500">
                  Created: {formatDate(snippet.createdAt)}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
