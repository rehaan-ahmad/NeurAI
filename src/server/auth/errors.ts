// Error surface for unauthorized / forbidden states.
// Route handlers and server actions throw these; UI layer maps them to
// the dedicated unauthorized/forbidden pages.

export class UnauthorizedError extends Error {
  public readonly status = 401;
  constructor() { super("Unauthorized"); this.name = "UnauthorizedError"; }
}

export class ForbiddenError extends Error {
  public readonly status = 403;
  public readonly reason: string;
  constructor(reason: string) {
    super("Forbidden");
    this.name = "ForbiddenError";
    this.reason = reason;
  }
}

export function isAuthError(error: unknown): error is UnauthorizedError | ForbiddenError {
  return (
    error instanceof UnauthorizedError || error instanceof ForbiddenError
  );
}
