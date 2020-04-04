import  * as Express from "express";
import { defineSchema, ValidationError, assertValid } from "@japan-d2/schema"
import { SQL, SQLStatement } from "sql-template-strings"
import { TokenNotFoundError} from "../error"

export const verifyHandler = (
  deps: {
    executeQuery: Promise<(sql: string | SQLStatement) => Promise<any>>,
    generateRandomString: () => void,
    verify: (token: string) => {discordId: string}
  }
) => async (req: Express.Request, res: Express.Response) => {
  const schema = defineSchema().array('profiles', 'object', defineSchema().string('streamKey'))

  try {
    const executeQuery = await deps.executeQuery
    const tokenWithType = req.get("Authorization")
    if(!tokenWithType) {
      throw new TokenNotFoundError()
    }

    assertValid(req.body, schema)
    const [,token] = tokenWithType.split(" ")
    const { discordId } = deps.verify(token)
    try {
      await executeQuery(SQL`BEGIN TRANSACTION`)
      await executeQuery(SQL`DELETE * FROM profiles WHERE profiles.discord_id = ${discordId}`)
      for ( const profile of req.body.profiles ) {
        await executeQuery(SQL`INSERT INTO profiles (discord_id, stream_key) VALUES(${discordId}, ${profile.streamKey})`)
      }
      await executeQuery(SQL`COMMIT`)
    } catch(err) {
      await executeQuery(SQL`ROLLBACK`)
    } 
    const profiles = await executeQuery(SQL`SELECT * FROM user WHERE profiles.discord_id = ${parseInt(discordId, 10)}`)
    res.status(200).json({
      profiles,
      discordId
    })
  } catch(err) {
    if(err instanceof TokenNotFoundError) {
      res.status(401).json({})
    } else if (err instanceof ValidationError) {
      res.status(400).json({error: err})
    }
  }
}
