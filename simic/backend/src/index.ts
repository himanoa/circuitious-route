import * as Express from "express";
import * as sqlite from "sqlite"
import {issueLoginUrlHandler} from "./handlers/issue-login-url-handler"

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

app.post("/", runAsyncWrapper(issueLoginUrlHandler(
  {
    executeQuery: db.then(db => new Promise((resolve) => resolve(db.get)))
  }
)))
