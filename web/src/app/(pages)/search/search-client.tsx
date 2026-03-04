"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    X,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Plus,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    PROGRAMMING_LANGUAGES,
    getLanguageDisplayName,
} from "@/types/languages";
import { SNIPPET_TAGS, searchTags } from "@/types/snippetTags";

interface Snippet {
    id: string;
    title: string;
    description: string;
    code: string;
    language: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    publisherId: string;
    publisherName: string;
    // Snapshot-specific metadata (optional for snippet mode)
    isSnapshot?: boolean;
    extensionsCount?: number;
    settingsCount?: number;
    keybindingsCount?: number;
}

type SearchMode = "snippets" | "snapshots";

interface SnippetApiResponse {
    success: boolean;
    snippets: Snippet[];
    pagination: {
        totalCount: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        nextCursor: string | null;
    };
    message?: string;
}

interface SnapshotFromApi {
    id: string;
    title: string;
    description: string | null;
    publisherId: string;
    publisherName: string;
    createdAt: string;
    updatedAt: string;
    extensionsCount: number;
    settingsCount: number;
    keybindingsCount: number;
}

interface SnapshotApiResponse {
    success: boolean;
    snapshots: SnapshotFromApi[];
    pagination: {
        totalCount: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        nextCursor: string | null;
    };
    message?: string;
}

// Define colors for tags and language pills using CSS custom properties
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

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("search") || "",
    );
    const [selectedLanguage, setSelectedLanguage] = useState<string>(
        searchParams.get("language") || "",
    );
    const [selectedTags, setSelectedTags] = useState<string[]>(
        searchParams.get("tag") ? [searchParams.get("tag")!] : [],
    );
    const [selectedUser, setSelectedUser] = useState<string>(
        searchParams.get("user") || "",
    );
    const [mode, setMode] = useState<SearchMode>(
        searchParams.get("type") === "snapshots" ? "snapshots" : "snippets",
    );
    const [tagInput, setTagInput] = useState<string>("");
    const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [currentPage, setCurrentPage] = useState(1);

    // Loading and data states
    const [isLoading, setIsLoading] = useState(false);
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [pagination, setPagination] = useState({
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        nextCursor: null as string | null,
    });
    const [error, setError] = useState<string | null>(null);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const tagInputRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                tagInputRef.current &&
                !tagInputRef.current.contains(event.target as Node)
            ) {
                setShowTagSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounced search with 300ms delay
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setCurrentPage(1);
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchQuery]);

    // Tag input suggestions
    useEffect(() => {
        if (tagInput.trim().length > 0) {
            const suggestions = searchTags(tagInput).filter(
                (tag) => !selectedTags.includes(tag),
            );
            setTagSuggestions(suggestions.slice(0, 8));
            setShowTagSuggestions(true);
        } else {
            setTagSuggestions([]);
            setShowTagSuggestions(false);
        }
    }, [tagInput, selectedTags]);

    // Add tag function
    const addTag = (tag: string) => {
        const trimmedTag = tag.trim().toLowerCase();
        if (trimmedTag && !selectedTags.includes(trimmedTag)) {
            setSelectedTags([...selectedTags, trimmedTag]);
            setTagInput("");
            setShowTagSuggestions(false);
        }
    };

    // Remove tag function
    const removeTag = (tagToRemove: string) => {
        setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
    };

    // Handle tag input key press
    const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (tagInput.trim()) {
                addTag(tagInput);
            }
        } else if (e.key === "Escape") {
            setShowTagSuggestions(false);
        }
    };

    // Fetch snippets function
    const fetchSnippets = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams();
            params.set("limit", "10");

            if (debouncedQuery.trim()) params.set("search", debouncedQuery.trim());
            if (selectedLanguage && selectedLanguage !== "all")
                params.set("language", selectedLanguage);
            if (selectedUser && selectedUser !== "")
                params.set("user", selectedUser);
            if (selectedTags.length > 0) {
                // The API expects single tag parameter, so we'll use the first selected tag
                params.set("tag", selectedTags[0]);
            }

            const endpoint =
                mode === "snippets"
                    ? "/api/snippets/getAll"
                    : "/api/snapshots/getAll";

            const response = await fetch(`${endpoint}?${params.toString()}`);
            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: Failed to fetch ${mode === "snippets" ? "snippets" : "snapshots"}`,
                );
            }

            const data = await response.json();
            console.log(data);

            if (!data.success) {
                throw new Error(data.message || "API returned error");
            }

            if (mode === "snippets") {
                const snippetData = data as SnippetApiResponse;
                setSnippets(snippetData.snippets);
                setPagination({
                    totalCount: snippetData.pagination.totalCount,
                    totalPages: snippetData.pagination.totalPages,
                    hasNextPage: snippetData.pagination.hasNextPage,
                    nextCursor: snippetData.pagination.nextCursor,
                });
            } else {
                const snapshotData = data as SnapshotApiResponse;
                const mappedSnippets: Snippet[] = snapshotData.snapshots.map((s) => ({
                    id: s.id,
                    title: s.title,
                    description: s.description || "",
                    code: "",
                    language: "",
                    tags: [],
                    publisherId: s.publisherId,
                    publisherName: s.publisherName,
                    createdAt: s.createdAt,
                    updatedAt: s.updatedAt,
                    isSnapshot: true,
                    extensionsCount: s.extensionsCount,
                    settingsCount: s.settingsCount,
                    keybindingsCount: s.keybindingsCount,
                }));
                setSnippets(mappedSnippets);
                setPagination({
                    totalCount: snapshotData.pagination.totalCount,
                    totalPages: snapshotData.pagination.totalPages,
                    hasNextPage: snapshotData.pagination.hasNextPage,
                    nextCursor: snapshotData.pagination.nextCursor,
                });
            }
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(err.message || "Failed to fetch snippets");
            setSnippets([]);
            setPagination({
                totalCount: 0,
                totalPages: 0,
                hasNextPage: false,
                nextCursor: null,
            });
        } finally {
            setIsLoading(false);
        }
    }, [debouncedQuery, selectedLanguage, selectedTags, selectedUser, mode]);

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedQuery.trim()) params.set("search", debouncedQuery.trim());
        if (selectedLanguage && selectedLanguage !== "all")
            params.set("language", selectedLanguage);
        if (selectedUser && selectedUser !== "")
            params.set("user", selectedUser);
        if (selectedTags.length > 0) params.set("tag", selectedTags[0]);
        params.set("type", mode);

        const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
        router.replace(newUrl, { scroll: false });
    }, [debouncedQuery, selectedLanguage, selectedTags, selectedUser, mode, router]);

    // Fetch snippets when dependencies change
    useEffect(() => {
        fetchSnippets();
    }, [fetchSnippets]);

    const handleSnippetClick = (snippet: Snippet) => {
        // Navigate to appropriate detail page based on current mode / data
        if (mode === "snapshots" || snippet.isSnapshot) {
            router.push(`/snapshots/${snippet.id}`);
        } else {
            router.push(`/snippets/${snippet.id}`);
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedLanguage("");
        setSelectedTags([]);
        setTagInput("");
        setSelectedUser("");
        setCurrentPage(1);
    };

    const hasActiveFilters =
        debouncedQuery ||
        (selectedLanguage && selectedLanguage !== "all") ||
        (selectedUser && selectedUser !== "") || selectedTags.length > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Search{" "}
                        <span className="inline-flex items-center rounded-full border border-border bg-muted px-1 py-1 text-sm">
                            <button
                                type="button"
                                onClick={() => setMode("snippets")}
                                className={`px-3 py-1 rounded-full transition-colors ${mode === "snippets"
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Snippets
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("snapshots")}
                                className={`px-3 py-1 rounded-full transition-colors ${mode === "snapshots"
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Snapshots
                            </button>
                        </span>
                    </h1>
                    <p className="text-muted-foreground">
                        Find <strong>code-snippets</strong> &{" "}
                        <strong>env-snapshots</strong> by title, language, user or tags
                    </p>
                </div>

                {/* Search Input */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                            type="text"
                            placeholder={
                                mode === "snippets"
                                    ? "Search snippets by title or description..."
                                    : "Search snapshots by title or description..."
                            }
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 h-12 text-lg"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 space-y-4 ">
                    <div className="flex flex-wrap gap-4 ">
                        {/* Language Filter */}
                        <div className="w-[200px]" hidden={mode === "snapshots"}>
                            <Select
                                value={selectedLanguage || "all"}
                                onValueChange={(value) =>
                                    setSelectedLanguage(value === "all" ? "" : value)
                                }
                            >
                                <SelectTrigger className="w-50">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Languages</SelectItem>
                                    {PROGRAMMING_LANGUAGES.map((lang) => (
                                        <SelectItem key={lang} value={lang}>
                                            {getLanguageDisplayName(lang)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tag Filter */}
                        <div className="w-[300px] relative" ref={tagInputRef}>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search by tags"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagInputKeyPress}
                                        onFocus={() =>
                                            tagInput.trim() && setShowTagSuggestions(true)
                                        }
                                        className="pr-8"
                                    />
                                    <button
                                        onClick={() => {
                                            if (tagInput.trim()) {
                                                addTag(tagInput);
                                            }
                                        }}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                        disabled={!tagInput.trim()}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Tag Suggestions */}
                                {showTagSuggestions && tagSuggestions.length > 0 && (
                                    <div className="absolute z-10 w-full bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                                        {tagSuggestions.map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => addTag(tag)}
                                                className="w-full text-left px-3 py-2 hover:bg-accent text-sm text-popover-foreground hover:text-accent-foreground"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Selected Tags */}
                                {selectedTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTags.map((tag) => (
                                            <div
                                                key={tag}
                                                className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getPillColorForTag(
                                                    tag,
                                                )}`}
                                            >
                                                <span>{tag}</span>
                                                <button
                                                    onClick={() => removeTag(tag)}
                                                    className="hover:text-red-500"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* User Filter */}
                        <div className="w-[220px]">
                            <Input
                                type="text"
                                placeholder="Filter by user"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                            />
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                {!isLoading && (
                    <div className="mb-4 flex justify-between items-center text-sm text-muted-foreground">
                        <div>
                            {error ? (
                                <span className="text-destructive">Error: {error}</span>
                            ) : (
                                <span>
                                    {hasActiveFilters ? "Found" : "Showing"}{" "}
                                    {pagination.totalCount}{" "}
                                    {mode === "snippets" ? "snippet" : "snapshot"}
                                    {pagination.totalCount !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">
                            Searching {mode === "snippets" ? "snippets" : "snapshots"}...
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && snippets.length === 0 && hasActiveFilters && !error && (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground mb-4">
                            <Search className="h-16 w-16 mx-auto mb-4" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">
                            No {mode === "snippets" ? "snippets" : "snapshots"} found
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Try adjusting your search criteria or filters
                        </p>
                        <Button onClick={clearFilters} variant="outline">
                            Clear all filters
                        </Button>
                    </div>
                )}

                {/* Default State (no search) */}
                {!isLoading && snippets.length === 0 && !hasActiveFilters && !error && (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground mb-4">
                            <Search className="h-16 w-16 mx-auto mb-4" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">
                            Start searching for code snippets
                        </h3>
                        <p className="text-muted-foreground">
                            Use the search bar above to find snippets by title, description,
                            language, or tags
                        </p>
                    </div>
                )}

                {/* Results Grid */}
                {!isLoading && snippets.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {snippets.map((snippet) => (
                                <Card
                                    key={snippet.id}
                                    className={`cursor-pointer transition-shadow duration-200 ${mode === "snapshots"
                                            ? "border-primary/40 border-dashed bg-muted/40 hover:shadow-md"
                                            : "hover:shadow-lg"
                                        }`}
                                    onClick={() => handleSnippetClick(snippet)}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-xl font-semibold flex-1 pr-2">
                                                {snippet.title}
                                            </CardTitle>
                                            {mode === "snippets" ? (
                                                <CardAction>
                                                    <Button variant="secondary" size="sm">
                                                        {getLanguageDisplayName(snippet.language)}
                                                    </Button>
                                                </CardAction>
                                            ) : (
                                                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                                    Snapshot
                                                </span>
                                            )}
                                        </div>
                                        {snippet.description && (
                                            <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                                                {snippet.description}
                                            </p>
                                        )}
                                    </CardHeader>

                                    <CardContent>
                                        {mode === "snippets" ? (
                                            <>
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

                                                {/* Code Preview */}
                                                {snippet.code && (
                                                    <div className="mt-4">
                                                        <div className="rounded-md border bg-muted/30 p-0 max-h-30 overflow-hidden">
                                                            <PrismHighlighter
                                                                code={limitCodeToLines(snippet.code, 6).code}
                                                                language={snippet.language}
                                                                showLineNumbers={false}
                                                                className="text-xs"
                                                            />
                                                            {limitCodeToLines(snippet.code, 6).hasMore && (
                                                                <div className="text-xs text-muted-foreground mt-2 text-center">
                                                                    ... more lines
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="mt-2 space-y-3">
                                                <div className="grid grid-cols-3 gap-2 text-xs">
                                                    <div className="rounded-md border border-border bg-background/60 px-2 py-2 text-center">
                                                        <div className="font-semibold text-foreground">
                                                            {snippet.extensionsCount ?? 0}
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                            extensions
                                                        </div>
                                                    </div>
                                                    <div className="rounded-md border border-border bg-background/60 px-2 py-2 text-center">
                                                        <div className="font-semibold text-foreground">
                                                            {snippet.settingsCount ?? 0}
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                            settings
                                                        </div>
                                                    </div>
                                                    <div className="rounded-md border border-border bg-background/60 px-2 py-2 text-center">
                                                        <div className="font-semibold text-foreground">
                                                            {snippet.keybindingsCount ?? 0}
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                            keybindings
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter onClick={() => router.push(`/profile?username=${snippet.publisherName}`)} className="flex justify-between items-center text-xs text-muted-foreground cursor-cell">
                                        <span className="hover:text-blue-400">By {snippet.publisherName}</span>
                                        <span>{formatDate(snippet.createdAt)}</span>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {/* Load More */}
                        {pagination.hasNextPage && (
                            <div className="flex justify-center">
                                <Button onClick={fetchSnippets} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Load More"
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
