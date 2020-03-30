import * as Express from "express";
import { validate, defineSchema } from "@japan-d2/schema"
import * as sqlite from "sqlite"
import { promisify } from "util"

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

app.post("/", runAsyncWrapper(async (req, res) => {
  const inputSchema = defineSchema().string("discordId")
  if(validate(req.body, inputSchema)) {
    req.body.discordId
  }
}))
