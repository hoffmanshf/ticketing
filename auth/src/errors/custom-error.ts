// cannot be instantiated
// used to set up requirements for subclasses
// we can use it in 'instanceof' check
export abstract class CustomError extends Error {
  // abstract restricts that subclass must implement statusCode
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // [] means it's an array of objects
  // ? means field is optional
  abstract serializeErrors(): { message: string; field?: string }[];
}
