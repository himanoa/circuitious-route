import * as Express from "express";
import { validate, defineSchema } from "@japan-d2/schema"
import { promisify } from "util"

if(typeof process.env.DATABASE_PATH !== "string") {
  throw Error("Enviroment variable not found: DATABASE_PATH")
}
const db = new sqlite3.Database(process.env.DATABASE_PATH)

const app = Express.default()

app.post("/", (req, res) => {
  const inputSchema = defineSchema().string("discordId")
  if(validate(req.body, inputSchema)) {
    req.body.discordId
  }
})
