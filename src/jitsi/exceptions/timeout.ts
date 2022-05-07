export class TimeoutException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, this.constructor.prototype);
  }
}
