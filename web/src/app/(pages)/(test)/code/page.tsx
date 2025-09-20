"use client";

import React, { useEffect, useState } from "react";
import PrismHighlighter from "@/components/PrismHighlighter";
import axios from "axios";

interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
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

const Page = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          "/api/snippets/web/get-all?limit=20",
        );

        if (response.data.ok) {
          setSnippets(response.data.snippets);
        } else {
          setError("Failed to fetch snippets");
        }
      } catch (err) {
        console.error("Error fetching snippets:", err);
        setError("Error fetching snippets");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Code Snippets</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading snippets...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Code Snippets</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Code Snippets</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">
            No snippets found. Create one to get started!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Code Snippets ({snippets.length})
      </h1>

      {/* 2-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {snippets.map((snippet) => (
          <div
            key={snippet.id}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
          >
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  {snippet.title}
                </h2>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {snippet.language}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {snippet.description}
              </p>

              {/* Tags */}
              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {snippet.tags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {snippet.tags.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{snippet.tags.length - 5} more
                    </span>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="text-xs text-gray-500">
                Created: {new Date(snippet.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Code Preview */}
            <div className="max-h-64 overflow-hidden">
              <PrismHighlighter
                code={snippet.code}
                language={snippet.language}
                showLineNumbers={true}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
