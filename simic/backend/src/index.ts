import { randomBytes }  from "crypto"
import * as Express from "express";
import * as sqlite from "sqlite"
import {issueLoginUrlHandler} from "./handlers/issue-login-url-handler"
import { issueAuthorizedTokenHandler } from "./handlers/issue-authorized-token-handler"
import { upsertProfileHandler } from "./handlers/upsert-profiles-handler"
import { refreshTokenHandler } from "./handlers/refresh-token-handler"
import { verifyHandler } from "./handlers/verify-handler"
import jwt from "jsonwebtoken"
import { readFileSync } from "fs"
import morgan from  "morgan"

if(typeof process.env.DATABASE_PATH !== "string") {
  throw Error("Enviroment variable not found: DATABASE_PATH")
}

if(typeof process.env.PRIVATE_KEY_PATH !== "string") {
  throw Error("Enviroment variable not found: PRIVATE_KEY_PATH")
}

if(typeof process.env.PUBLIC_KEY_PATH !== "string") {
  throw Error("Enviroment variable not found: PRIVATE_KEY_PATH")
}


const privateKey = readFileSync(process.env.PRIVATE_KEY_PATH)
const publicKey = readFileSync(process.env.PUBLIC_KEY_PATH)
const db = sqlite.open(process.env.DATABASE_PATH, { promise: Promise })

const app = Express.default()
app.use(morgan("combined"))
app.use(Express.json())

function runAsyncWrapper (callback: (req: Express.Request, res: Express.Response, next?: Express.NextFunction) => Promise<void>) {
  return function (req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    callback(req, res, next)
      .catch(next)
  }
}

app.post("/login-url", runAsyncWrapper(issueLoginUrlHandler(
  {
    executeQuery: db.then(db => new Promise((resolve) => resolve(db.all.bind(db)))),
    generateRandomString: () => randomBytes(16).toString("hex")
  }
)))

app.post("/:loginId/authorize", runAsyncWrapper(issueAuthorizedTokenHandler(
  {
    executeQuery: db.then(db => new Promise((resolve) => resolve(db.all.bind(db)))),
    generateRandomString: () => randomBytes(16).toString("hex"),
    sign: ({ discordId }) => jwt.sign({discordId}, privateKey, { algorithm: "RS256", expiresIn: 60 * 60 })
  }
)))

app.get("/verify", runAsyncWrapper(verifyHandler(
  {
    executeQuery: db.then(db => new Promise((resolve) => resolve(db.all.bind(db)))),
    generateRandomString: () => randomBytes(16).toString("hex"),
    verify: (token) => jwt.verify(token, publicKey, { algorithms: ["RS256"]}) as any
  }
)))

app.put("/upsert-profiles", runAsyncWrapper(upsertProfileHandler(
  {
    executeQuery: db.then(db => new Promise((resolve) => resolve(db.all))),
    verify: (token) => jwt.verify(token, publicKey, { algorithms: ["RS256"]}) as any
  }
)))

app.post("/refresh-token", runAsyncWrapper(refreshTokenHandler(
  {
    executeQuery: db.then(db => new Promise((resolve) => resolve(db.all.bind(db)))),
    generateRandomString: () => randomBytes(16).toString("hex"),
    sign: ({ discordId }) => jwt.sign({discordId}, privateKey, { algorithm: "RS256", expiresIn: 60 * 60 })
  }
)))

app.listen(process.env.PORT || 3000, () => {
  console.log("Simic backend app listening at localhost:3000")
})
