export class SimicBackendError extends Error {
  constructor(...params: any[]) {
    super(...params);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundError extends SimicBackendError {}

export class TokenNotFoundError extends SimicBackendError {}

export class LoginIdNotFoundError extends SimicBackendError {}
