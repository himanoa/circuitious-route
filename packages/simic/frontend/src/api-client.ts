export class SimicApiClientError extends Error {
  constructor(...params: any[]) {
    super(...params);
    this.name = this.constructor.name;
  }
}

export class AccessTokenNotFoundError extends SimicApiClientError {}
export class RefreshTokenNotFoundError extends SimicApiClientError {}
export class InvalidAccessTokenError extends SimicApiClientError {}

export class VerifyError extends SimicApiClientError {}
export class RefreshError extends SimicApiClientError {}
export class UpsertError extends SimicApiClientError {}

export type Profile = { streamKey: string };

export class SimicApiClient {
  constructor(
    private endPoint: string,
    private accessToken: string | null,
    private refreshToken: string | null
  ) {}

  async authorize(loginId: string): Promise<void> {
    if (this.accessToken === null && this.refreshToken === null) {
      const { accessToken, refreshToken } = await (
        await fetch(`${this.endPoint}/${loginId}/authorize`, { method: "post" })
      ).json();
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    }
  }

  async verify(): Promise<{ profiles: Profile[] }> {
    if (this.accessToken === null) {
      throw new AccessTokenNotFoundError();
    }
    try {
      const response = await fetch(`${this.endPoint}/verify`, {
        method: "get",
        headers: { Authorization: `Barer ${this.accessToken}` },
      });
      if (response.status === 401) throw new InvalidAccessTokenError();
      return await response.json();
    } catch (err) {
      if (
        err instanceof InvalidAccessTokenError &&
        this.refreshToken !== null
      ) {
        // TODO: ちゃんとリトライしたほうが良い
        await this.refresh();
        await this.verify();
      }
      throw new VerifyError(err);
    }
  }

  async refresh(): Promise<{ refreshToken: string; accessToken: string }> {
    if (this.refreshToken === null) {
      throw new RefreshTokenNotFoundError();
    }

    try {
      const { accessToken, refreshToken } = await (
        await fetch(`${this.endPoint}/refresh-token`, {
          method: "post",
          body: JSON.stringify({ refreshToken: this.refreshToken }),
          headers: { "Content-Type": "application/json" },
        })
      ).json();
      this.refreshToken = refreshToken;
      this.accessToken = accessToken;
      return { accessToken, refreshToken };
    } catch (err) {
      throw new RefreshError(err);
    }
  }

  async upsertProfile(profiles: Profile[]): Promise<void> {
    try {
      const response = await fetch(`${this.endPoint}/upsert-profiles`, {
        method: "post",
        body: JSON.stringify({ profiles }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Barer ${this.accessToken}",
        },
      });
      if (response.status === 401) throw new InvalidAccessTokenError();
      return await response.json();
    } catch (err) {
      if (
        err instanceof InvalidAccessTokenError &&
        this.refreshToken !== null
      ) {
        // TODO: ちゃんとリトライしたほうが良い
        await this.refresh();
        await this.verify();
      }
      throw new UpsertError(err);
    }
  }
}
