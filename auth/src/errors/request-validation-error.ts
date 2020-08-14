import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  // errors: ValidationError[];
  // constructor(errors: ValidationError[]) {
  //   super("Invalid request parameters");
  //   this.errors = errors;
  // }

  // equivalent to
  // constructor(private errors: ValidationError[]) {
  //   super("Invalid request parameters");
  // }

  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
