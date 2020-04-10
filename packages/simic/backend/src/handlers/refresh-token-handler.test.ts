import { refreshTokenHandler } from "./refresh-token-handler";
import { SQLStatement } from "sql-template-strings";
import * as Response from "jest-express/lib/response";
import * as Request from "jest-express/lib/request";

describe("refreshTokenHandler", () => {
  describe("when verify successful", () => {
    const executedQuery: string[] = [];
    const target = refreshTokenHandler({
      executeQuery: Promise.resolve((sql: SQLStatement | string) => {
        if (typeof sql === "string") {
          executedQuery.push(sql);
          return Promise.resolve([1]);
        }
        executedQuery.push(sql.sql);
        return Promise.resolve([1]);
      }),
      generateRandomString: () => "foobar",
      sign: () => "signed strings",
    });

    it("should be failed", async () => {
      const request = new Request.Request("https://example.com");
      request.setBody({
        refreshToken: "XXXXXX",
      });
      request.setHeaders("Authorization", "Barer InvalidToken");
      const response = new Response.Response();
      await target(request as any, response as any);
      expect(executedQuery).toMatchSnapshot();
      expect(response.status).toBeCalledWith(201);
      expect(response.body).toMatchSnapshot();
    });
  });

  describe("when verify failed", () => {
    const executedQuery: string[] = [];
    const target = refreshTokenHandler({
      executeQuery: Promise.resolve((sql: SQLStatement | string) => {
        if (typeof sql === "string") {
          executedQuery.push(sql);
          return Promise.resolve([1]);
        }
        if (/^SELECT \* FROM refresh_tokens/.test(sql.sql)) {
          return Promise.resolve([]);
        }
        executedQuery.push(sql.sql);
        return Promise.resolve([1]);
      }),
      generateRandomString: () => "foobar",
      sign: () => "signed strings",
    });

    it("should be failed", async () => {
      const request = new Request.Request("https://example.com");
      request.setBody({
        refreshToken: "XXXXXX",
      });
      request.setHeaders("Authorization", "Barer InvalidToken");
      const response = new Response.Response();
      await target(request as any, response as any);
      expect(executedQuery).toMatchSnapshot();
      expect(response.status).toBeCalledWith(401);
      expect(response.body).toMatchSnapshot();
    });
  });
});
