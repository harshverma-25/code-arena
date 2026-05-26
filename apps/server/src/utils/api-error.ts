export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: any[];
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, errors: any[] = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    
    // Set the prototype explicitly to restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
