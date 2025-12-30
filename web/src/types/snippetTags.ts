// Snippet tags interface and constants
export interface SnippetTags {
    // Framework & Libraries
    react: string;
    vue: string;
    angular: string;
    svelte: string;
    nextjs: string;
    nuxt: string;
    express: string;
    fastapi: string;
    django: string;
    flask: string;
    spring: string;
    laravel: string;

    // Frontend Technologies
    frontend: string;
    backend: string;
    fullstack: string;
    ui: string;
    responsive: string;
    animation: string;
    css3: string;
    html5: string;

    // Backend & Database
    api: string;
    rest: string;
    graphql: string;
    database: string;
    mongodb: string;
    mysql: string;
    postgresql: string;
    redis: string;
    orm: string;

    // Development Concepts
    algorithm: string;
    datastructure: string;
    sorting: string;
    searching: string;
    recursion: string;
    dynamic: string;
    greedy: string;
    graph: string;
    tree: string;

    // Web Development
    crud: string;
    auth: string;
    authentication: string;
    authorization: string;
    jwt: string;
    oauth: string;
    session: string;
    cookies: string;

    // Development Tools
    git: string;
    docker: string;
    kubernetes: string;
    ci: string;
    testing: string;
    unit: string;
    integration: string;
    e2e: string;

    // Programming Paradigms
    oop: string;
    functional: string;
    async: string;
    promise: string;
    callback: string;
    event: string;

    // Performance & Optimization
    performance: string;
    optimization: string;
    caching: string;
    lazy: string;
    memoization: string;

    // Mobile Development
    mobile: string;
    ios: string;
    android: string;
    reactnative: string;
    flutter: string;

    // Cloud & DevOps
    aws: string;
    azure: string;
    gcp: string;
    serverless: string;
    microservices: string;
    deployment: string;

    // Security
    security: string;
    encryption: string;
    hashing: string;
    validation: string;
    sanitization: string;

    // Utilities
    utility: string;
    helper: string;
    config: string;
    setup: string;
    boilerplate: string;
    template: string;
    example: string;
    tutorial: string;
    beginner: string;
    advanced: string;
}

// Array of commonly used snippet tags
export const SNIPPET_TAGS: string[] = [
    // Framework & Libraries
    "react",
    "vue",
    "angular",
    "svelte",
    "nextjs",
    "nuxt",
    "express",
    "fastapi",
    "django",
    "flask",
    "spring",
    "laravel",

    // Frontend Technologies
    "frontend",
    "backend",
    "fullstack",
    "ui",
    "responsive",
    "animation",
    "css3",
    "html5",

    // Backend & Database
    "api",
    "rest",
    "graphql",
    "database",
    "mongodb",
    "mysql",
    "postgresql",
    "redis",
    "orm",

    // Development Concepts
    "algorithm",
    "datastructure",
    "sorting",
    "searching",
    "recursion",
    "dynamic",
    "greedy",
    "graph",
    "tree",

    // Web Development
    "crud",
    "auth",
    "authentication",
    "authorization",
    "jwt",
    "oauth",
    "session",
    "cookies",

    // Development Tools
    "git",
    "docker",
    "kubernetes",
    "ci",
    "testing",
    "unit",
    "integration",
    "e2e",

    // Programming Paradigms
    "oop",
    "functional",
    "async",
    "promise",
    "callback",
    "event",

    // Performance & Optimization
    "performance",
    "optimization",
    "caching",
    "lazy",
    "memoization",

    // Mobile Development
    "mobile",
    "ios",
    "android",
    "reactnative",
    "flutter",

    // Cloud & DevOps
    "aws",
    "azure",
    "gcp",
    "serverless",
    "microservices",
    "deployment",

    // Security
    "security",
    "encryption",
    "hashing",
    "validation",
    "sanitization",

    // Utilities
    "utility",
    "helper",
    "config",
    "setup",
    "boilerplate",
    "template",
    "example",
    "tutorial",
    "beginner",
    "advanced",
];

// Popular tags (most commonly used)
export const POPULAR_TAGS: string[] = [
    "react",
    "javascript",
    "typescript",
    "api",
    "frontend",
    "backend",
    "nodejs",
    "python",
    "database",
    "authentication",
    "crud",
    "async",
    "utility",
    "algorithm",
    "css",
    "html",
    "tutorial",
    "example",
];

// Tag categories for better organization
export const TAG_CATEGORIES = {
    frameworks: [
        "react",
        "vue",
        "angular",
        "svelte",
        "nextjs",
        "express",
        "django",
        "flask",
    ],
    technologies: ["frontend", "backend", "api", "database", "mobile", "web"],
    concepts: [
        "algorithm",
        "datastructure",
        "oop",
        "functional",
        "async",
        "performance",
    ],
    tools: ["git", "docker", "testing", "ci", "deployment"],
    security: ["auth", "authentication", "jwt", "encryption", "security"],
    difficulty: ["beginner", "advanced", "tutorial", "example"],
} as const;

// Function to search tags by query
export const searchTags = (query: string): string[] => {
    if (!query.trim()) return POPULAR_TAGS;

    const lowerQuery = query.toLowerCase();
    return SNIPPET_TAGS.filter((tag) =>
        tag.toLowerCase().includes(lowerQuery),
    ).slice(0, 10); // Limit to 10 results
};

// Function to get tags by category
export const getTagsByCategory = (
    category: keyof typeof TAG_CATEGORIES,
): readonly string[] => {
    return TAG_CATEGORIES[category] || [];
};
