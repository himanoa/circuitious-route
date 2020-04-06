import { issueAuthorizedTokenHandler } from "./issue-authorized-token-handler"
import { SQLStatement } from "sql-template-strings"
import * as Response from "jest-express/lib/response"
import * as Request from "jest-express/lib/request"

describe("issueAuthorizedTokenHandler", () => {
  describe("when exist discordId", () => {
    describe("when exist refreshToken", () => {
      const executedQuery: string[] = []
      const dummyDeps = {
        executeQuery: Promise.resolve((sql: SQLStatement | string) => {
          if(typeof sql === "string") {
            executedQuery.push(sql)
            return Promise.resolve([1])
          }
          executedQuery.push(sql.sql)
          return Promise.resolve([1])
        }),
        generateRandomString: () => "foobar",
        sign: () => "signed strings"
      }
      
      it("should be valid", async () => {
        const request = new Request.Request("https://example.com")
        request.setParams({
          loginId: "XXXXX"
        })
        const response = new Response.Response()
        await issueAuthorizedTokenHandler(dummyDeps)(request as any, response as any)
        expect(executedQuery).toMatchSnapshot()
        expect(response.status).toBeCalledWith(401)
        expect(response.body).toMatchSnapshot()
      })
    })

    describe("when not exist refreshToken", () => {
      const executedQuery: string[] = []
      const dummyDeps = {
        executeQuery: Promise.resolve((sql: SQLStatement | string) => {
          if(typeof sql === "string") {
            executedQuery.push(sql)
            return Promise.resolve([1])
          }
          executedQuery.push(sql.sql)
          if(/^SELECT \* FROM refresh_tokens/.test(sql.sql)) {
            return Promise.resolve([])
          }
          return Promise.resolve([1])
        }),
        generateRandomString: () => "foobar",
        sign: () => "signed strings"
      }
      
      it("should be valid", async () => {
        const request = new Request.Request("https://example.com")
        request.setParams({
          loginId: "XXXXX"
        })
        const response = new Response.Response()
        await issueAuthorizedTokenHandler(dummyDeps)(request as any, response as any)
        expect(executedQuery).toMatchSnapshot()
        expect(response.status).toBeCalledWith(201)
        expect(response.body).toMatchSnapshot()
      })
    })
    })
  })

  describe("when invalid params", () => {
    const executedQuery: string[] = []
    const dummyDeps = {
      executeQuery: Promise.resolve((sql: SQLStatement | string) => {
        if(typeof sql === "string") {
          executedQuery.push(sql)
          return Promise.resolve([])
        }
        executedQuery.push(sql.sql)
        return Promise.resolve([])
      }),
      generateRandomString: () => "foobar",
      sign: () => "signed strings"
    }
    
    it("should be error", async () => {
      const request = new Request.Request("https://example.com")
      request.setParams({
        invalid: "123123123"
      })
      const response = new Response.Response()
      await issueAuthorizedTokenHandler(dummyDeps)(request as any, response as any)
      expect(executedQuery).toMatchSnapshot()
      expect(response.status).toBeCalledWith(400)
      expect(response.body).toMatchSnapshot() 
    })
  })

  describe("when db error", () => {
    const executedQuery: string[] = []
    const dummyDeps = {
      executeQuery: Promise.resolve((sql: SQLStatement | string) => {
        throw Error("DB")
      }),
      generateRandomString: () => "foobar",
      sign: () => "signed strings"
    }
    
    it("should be error", async () => {
      const request = new Request.Request("https://example.com")
      const response = new Response.Response()
      request.setParams({
        loginId: "XXXXX"
      })
      await issueAuthorizedTokenHandler(dummyDeps)(request as any, response as any)
      expect(executedQuery).toMatchSnapshot()
      expect(response.status).toBeCalledWith(500)
      expect(response.body).toMatchSnapshot() 
    })
  })
