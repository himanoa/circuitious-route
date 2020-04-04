import { randomBytes }  from "crypto"
import * as Express from "express";
import * as sqlite from "sqlite"
import {issueLoginUrlHandler} from "./handlers/issue-login-url-handler"
import { issueAuthorizedTokenHandler } from "./handlers/issue-authorized-token-handler"
import { upsertProfileHandler } from "./handlers/upsert-profiles-handler"
import { verifyHandler } from "./handlers/verify-handler"
import jwt from "jsonwebtoken"

if(typeof process.env.DATABASE_PATH !== "string") {
  throw Error("Enviroment variable not found: DATABASE_PATH")
}
const db = sqlite.open(process.env.DATABASE_PATH, { promise: Promise })

const app = Express.default()

function runAsyncWrapper (callback: (req: Express.Request, res: Express.Response, next?: Express.NextFunction) => Promise<void>) {
  return function (req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    callback(req, res, next)
      .catch(next)
  }
}

app.post("/login-url", runAsyncWrapper(issueLoginUrlHandler(
  {
    executeQuery: db.then(db => new Promise((resolve) => resolve(db.get))),
    generateRandomString: () => randomBytes(16).toString("hex")
  }
)))

app.post("/authorize", runAsyncWrapper(issueAuthorizedTokenHandler(
  {
    executeQuery: db.then(db => new Promise((resolve) => resolve(db.get))),
    generateRandomString: () => randomBytes(16).toString("hex"),
    sign: ({ discordId }) => jwt.sign({discordId}, null as any, { algorithm: "RS256", expiresIn: 60 * 60 })
  }
)))

app.get("/verify", runAsyncWrapper(verifyHandler(
  {
    executeQuery: db.then(db => new Promise((resolve) => resolve(db.get))),
    generateRandomString: () => randomBytes(16).toString("hex"),
    verify: (token) => jwt.verify(token, null as any, { algorithms: ["HS256"]}) as any
  }
)))

app.put("/upsert-profiles", runAsyncWrapper(upsertProfileHandler(
  {
    executeQuery: db.then(db => new Promise((resolve) => resolve(db.get))),
    verify: (token) => jwt.verify(token, null as any, { algorithms: ["HS256"]}) as any
  }
)))
