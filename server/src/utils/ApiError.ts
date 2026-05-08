export type ApiErrorCode =
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "AI_PROVIDER_DOWN"
  | "AI_CLOUD_KEY_MISSING"
  | "AI_PROVIDER_UNAVAILABLE"
  | "AI_MODEL_MISSING"
  | "AI_AUTH_FAILED"
  | "AI_INVALID_RESPONSE"
  | "AI_MODEL_NOT_FOUND"
  | "AI_STRUCTURED_OUTPUT_INVALID"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: ApiErrorCode;
  readonly details?: unknown;

  constructor(
    statusCode: number,
    code: ApiErrorCode,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}
