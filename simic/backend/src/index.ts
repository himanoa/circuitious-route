import * as Express from "express";
import { validate, defineSchema, ValidationError } from "@japan-d2/schema"
import * as sqlite from "sqlite"
import { SQL, SQLStatement } from "sql-template-strings"
import { randomBytes }  from "crypto"
import { format } from "url"

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

export const generateUrlHandler:(deps: {
  executeQuery: Promise<(sql: string | SQLStatement) => Promise<any>>
}) => (req: Express.Request, res: Express.Response) => Promise<void> = (deps) => async (req, res) => {
  const executeQuery = await deps.executeQuery
  const inputSchema = defineSchema().string("discordId")
  if(validate(req.body, inputSchema)) {
    const loginId = randomBytes(16).toString("hex")
    try {
      if ((await executeQuery(SQL`SELECT * FROM USERS WHERE discord_id = ${req.body.discordId}`)).length === 0) {
        await executeQuery(SQL`INSERT INTO users (discord_id, current_login_id), VALUES (${req.body.discordId}, ${loginId})`)
      } else {
        await executeQuery(SQL`UPDATE users SET loginId = ${loginId} WHERE discord_id = ${req.body.discordId}`)
      }

      res.status(201).json({ loginUrl: format({ protocol: req.protocol, host: req.get("host"), pathname: `/login/${loginId}` }) })
    } catch (err) {
      if(err instanceof ValidationError) {
        res.status(400).json({ error: err })
      } else {
        res.status(500).json({
          error: err
        })
      }
    }
  }
}

app.post("/", runAsyncWrapper(generateUrlHandler(
  {
    executeQuery: db.then(db => new Promise((resolve) => resolve(db.get)))
  }
)))
