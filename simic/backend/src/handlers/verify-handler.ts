import  * as Express from "express";
import { SQL, SQLStatement } from "sql-template-strings"
import { TokenNotFoundError } from "./TokenNotFoundError"

export const verifyHandler = (
  deps: {
    executeQuery: Promise<(sql: string | SQLStatement) => Promise<any>>,
    generateRandomString: () => void,
    verify: (token: string) => { discordId: string }
  }
) => async (req: Express.Request, res: Express.Response) => {
  try {
    const executeQuery = await deps.executeQuery
    const tokenWithType = req.get("Authorization")
    if(!tokenWithType) {
      throw new TokenNotFoundError()
    }
    const [,token] = tokenWithType.split(" ")
    const { discordId } = deps.verify(token)
    // await executeQuery(SQL`SELECT * `)
  } catch {

  }
}
