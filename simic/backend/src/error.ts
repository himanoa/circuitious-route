export class UserNotFoundError extends Error {
  constructor(params: any) {
    super(params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserNotFoundError)
    }

    this.name = 'UserNotFoundError'
  }
}

export class TokenNotFoundError extends Error {
  constructor(params: any) {
    super(params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TokenNotFoundError)
    }

    this.name = 'TokenNotFoundError'
  }
}

export class LoginIdNotFoundError extends Error {
  constructor(params: any) {
    super(params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoginIdNotFoundError)
    }

    this.name = 'LoginIdNotFoundError'
  }
}
