import { issueLoginUrlHandler } from "./issue-login-url-handler"
import { SQLStatement } from "sql-template-strings"
import * as Response from "jest-express/lib/response"
import * as Request from "jest-express/lib/request"

describe("issueLoginUrlHandler", () => {
  describe("when exist discordId", () => {
    const executedQuery: string[] = []
    const dummyDeps = {
      executeQuery: Promise.resolve((sql: SQLStatement | string) => {
        if(typeof sql === "string") {
          executedQuery.push(sql)
          return Promise.resolve([1])
        }
        executedQuery.push(sql.sql)
        return Promise.resolve([1])
      })
    }
    
    it("should be valid", async () => {
      const request = new Request.Request("https://example.com")
      request.setBody({
        discordId: 123123123
      })
      const response = new Response.Response()
      await issueLoginUrlHandler(dummyDeps)(request as any, response as any)
      expect(executedQuery).toMatchSnapshot()
      expect(response.status).toBeCalled()
    })
  })
  describe("when not exist discordId", () => {
    const executedQuery: string[] = []
    const dummyDeps = {
      executeQuery: Promise.resolve((sql: SQLStatement | string) => {
        if(typeof sql === "string") {
          executedQuery.push(sql)
          return Promise.resolve([])
        }
        executedQuery.push(sql.sql)
        return Promise.resolve([])
      })
    }
    
    it("should be valid", async () => {
      const request = new Request.Request("https://example.com")
      request.setBody({
        discordId: 123123123
      })
      const response = new Response.Response()
      await issueLoginUrlHandler(dummyDeps)(request as any, response as any)
      expect(executedQuery).toMatchSnapshot()
      expect(response.status).toBeCalled()
    })
  })
})

