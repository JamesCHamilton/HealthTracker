// MongoErrorChecker.ts
export function isMongoError(error: unknown): error is {
    code: number;
    keyValue: Record<string, unknown>;
    [key: string]: unknown;
} {
    return typeof error === "object" && error !== null && "code" in error;
}