import { upsertProfileHandler } from "./upsert-profiles-handler"
import { SQLStatement } from "sql-template-strings"
import * as Response from "jest-express/lib/response"
import * as Request from "jest-express/lib/request"


describe("upsertProfileHandler", () => {
  describe("when verify successful", () => {
    const executedQuery: string[] = []
    const target = upsertProfileHandler({
      executeQuery: Promise.resolve((sql: SQLStatement | string) => {
        if(typeof sql === "string") {
          executedQuery.push(sql)
          return Promise.resolve([1])
        }
        executedQuery.push(sql.sql)
        return Promise.resolve([
          {discord_id: "123123", stream_key: "XXXX"},
          {discord_id: "123123", stream_key: "YYYY"}
        ])
      }),
      verify: () => ({discordId: "12123123"})
    })

    it("should be success", async () => {
      const request = new Request.Request("https://example.com")
      request.setHeaders("Authorization", "Barer XXXXX")
      request.setBody(
        { profiles: [{ streamKey: "XXXX" }, { streamKey: "YYYY" }] }
      )
      const response = new Response.Response()
      await target(request as any, response as any)
      expect(executedQuery).toMatchSnapshot()
      expect(response.body).toMatchSnapshot()
      expect(response.status).toBeCalledWith(200)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe("when verify failed", () => {
    const executedQuery: string[] = []
    const target = upsertProfileHandler({
      executeQuery: Promise.resolve((sql: SQLStatement | string) => {
        if(typeof sql === "string") {
          executedQuery.push(sql)
          return Promise.resolve([1])
        }
        executedQuery.push(sql.sql)
        return Promise.resolve([1])
      }),
      verify: () => {throw new Error("doo")}
    })

    it("should be failed", async () => {
      const request = new Request.Request("https://example.com")
      request.setHeaders("Authorization", "Barer InvalidToken")
      request.setBody((
        { profiles: [{ streamKey: "XXXX" }, { streamKey: "YYYY" }] }
      ))
      const response = new Response.Response()
      await target(request as any, response as any)
      expect(executedQuery).toMatchSnapshot()
      expect(response.body).toMatchSnapshot()
      expect(response.status).toBeCalledWith(401)
      expect(response.body).toMatchSnapshot()
    })
  })
})
