export class AppError extends Error {
  public readonly isOperational = true;

  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // Fixes prototype chain for custom errors
    Error.captureStackTrace(this, this.constructor);
  }
}

// 409 Conflict - Used for "Email already exists" or "Username taken"
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

// 401 Unauthorized - Used for "Invalid credentials" or "Invalid token"
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

// 403 Forbidden - Used for "Admin only" or "You don't own this resource"
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

// 404 Not Found - Used for "User not found" or "Product not found"
export class ResourceNotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

// 422 Unprocessable Entity - Used for validation errors (if not using Zod)
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422);
  }
}
