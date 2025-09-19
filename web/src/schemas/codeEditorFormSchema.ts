import z from "zod";

export const supportedLanguages = [
    "javascript",
    "typescript",
    "tsx",
    "jsx",
    "python",
    "java",
    "csharp",
    "cpp",
    "html",
    "css",
    "json",
    "markdown",
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const codeEditorFormSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must not exceed 100 characters"),

    description: z
        .string()
        .min(1, "Description is required")
        .max(500, "Description must not exceed 500 characters"),

    tags: z
        .array(z.string())
        .min(1, "At least one tag is required")
        .max(10, "Cannot have more than 10 tags")
        .refine(
            (tags) => tags.every((tag) => tag.length >= 2 && tag.length <= 20),
            "Each tag must be between 2 and 20 characters",
        ),

    code: z
        .string()
        .min(1, "Code is required")
        .max(50000, "Code must not exceed 50,000 characters"),

    language: z.enum(supportedLanguages, {
        message: "Please select a valid programming language",
    }),
});

export type CodeEditorFormData = z.infer<typeof codeEditorFormSchema>;
