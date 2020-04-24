import { startStreamingHandler } from "./start-streaming-handler";
import * as Response from "jest-express/lib/response";
import * as Request from "jest-express/lib/request";

describe("start-streaming-handler", () => {
  describe("when verify successful", () => {
    const target = startStreamingHandler({
      publishEvent: () => Promise.resolve(),
      verify: () => ({ discordId: "12123123".toString() }),
    });

    it("should be failed", async () => {
      const request = new Request.Request("https://example.com");
      request.setHeaders("Authorization", "Barer InvalidToken");
      const response = new Response.Response();
      await target(request as any, response as any);
      expect(response.status).toBeCalledWith(200);
      expect(response.body).toMatchSnapshot();
    });
  });

  describe("when verify failed", () => {
    const target = startStreamingHandler({
      publishEvent: () => Promise.resolve(),
      verify: () => {
        throw new Error("doo");
      },
    });

    it("should be failed", async () => {
      const request = new Request.Request("https://example.com");
      request.setHeaders("Authorization", "Barer InvalidToken");
      const response = new Response.Response();
      await target(request as any, response as any);
      expect(response.status).toBeCalledWith(500);
      expect(response.body).toMatchSnapshot();
    });
  });
});
