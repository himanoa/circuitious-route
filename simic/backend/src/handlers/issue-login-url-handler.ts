import { defineSchema, ValidationError, assertValid } from "@japan-d2/schema"
import { SQL, SQLStatement } from "sql-template-strings"
import * as Express from "express";

export const issueLoginUrlHandler:(deps: {
  executeQuery: Promise<(sql: string | SQLStatement) => Promise<any>>,
  generateRandomString: () => void
}) => (req: Express.Request, res: Express.Response) => Promise<void> = (deps) => async (req, res) => {
  const executeQuery = await deps.executeQuery
  const inputSchema = defineSchema().string("discordId")
  try {
    assertValid(req.body, inputSchema)
    console.dir(req.body)
    const loginId = deps.generateRandomString()
    if ((await executeQuery(SQL`SELECT * FROM USERS WHERE discord_id = ${req.body.discordId};`)).length === 0) {
      await executeQuery(SQL`INSERT INTO users (discord_id, current_login_id), VALUES (${req.body.discordId}, ${loginId});`)
    } else {
      await executeQuery(SQL`UPDATE users SET current_login_id = ${loginId} WHERE discord_id = ${req.body.discordId};`)
      await executeQuery(SQL`DELETE refresh_tokens WHERE discord_id = ${req.body.discordId}:`);
    }

    res.status(201).json({ loginId })
  } catch (err) {
    console.dir(err)
    if(err instanceof ValidationError) {
      res.status(400).json({ error: err })
    } else {
      res.status(500).json({
        error: err
      })
    }
  }
}
