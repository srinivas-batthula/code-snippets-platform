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
        .max(300, "Description must not exceed 300 characters")
        .optional()
        .or(z.literal("")),

    tags: z
        .array(z.string())
        .max(5, "Cannot have more than 5 tags")
        .refine(
            (tags) =>
                tags.length === 0 ||
                tags.every((tag) => tag.length >= 2 && tag.length <= 20),
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
