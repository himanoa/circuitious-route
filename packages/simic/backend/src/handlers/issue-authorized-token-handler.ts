import { SQL, SQLStatement } from "sql-template-strings";
import * as Express from "express";
import { UserNotFoundError, LoginIdNotFoundError } from "../error";

type Token = string;

export const issueAuthorizedTokenHandler: (deps: {
  executeQuery: Promise<(sql: string | SQLStatement) => Promise<any>>;
  sign: (obj: { discordId: string }) => Token;
  generateRandomString: () => string;
}) => (req: Express.Request, res: Express.Response) => Promise<void> = (
  deps
) => async (req, res) => {
  const executeQuery = await deps.executeQuery;
  try {
    if (req.params && req.params.loginId === undefined) {
      throw new LoginIdNotFoundError("Login id is not found");
    }
    const [user] = await executeQuery(
      SQL`SELECT * FROM users WHERE current_login_id = ${req.params.loginId};`
    );
    if (!user) {
      throw new UserNotFoundError(`User is not found`);
    }
    const refreshToken = await executeQuery(
      SQL`SELECT * FROM refresh_tokens WHERE discord_id = ${user.discord_id} AND activated = 1;`
    );

    if (refreshToken.length === 0) {
      const refreshToken = deps.generateRandomString();
      await executeQuery(
        SQL`INSERT INTO refresh_tokens (discord_id, token, activated, created_at) VALUES (${user.discord_id}, ${refreshToken}, 1, strftime('%s', 'now'));`
      );
      res.status(201).json({
        refreshToken: refreshToken,
        accessToken: deps.sign({ discordId: user.discord_id }),
      });
    } else {
      res.status(401).json({});
    }
  } catch (err) {
    if (err.name === "LoginIdNotFoundError") {
      res.status(400).json({});
    } else if (err.name === "UserNotFoundError") {
      res.status(401).json({ error: err });
    } else {
      res.status(500).json({
        error: err,
      });
    }
  }
};
