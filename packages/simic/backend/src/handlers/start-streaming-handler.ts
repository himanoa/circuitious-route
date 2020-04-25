import * as Express from "express";
import { Events } from "izett";
import { TokenNotFoundError } from "../error";

export const startStreamingHandler = (deps: {
  publishEvent: (event: Events) => Promise<void>;
  verify: (token: string) => { discordId: string };
}) => async (req: Express.Request, res: Express.Response) => {
  const tokenWithType = req.get("Authorization");
  if (!tokenWithType) {
    throw new TokenNotFoundError("Token is not found");
  }

  try {
    const [, token] = tokenWithType.split(" ");
    const { discordId } = deps.verify(token);
    await deps.publishEvent({
      type: "start-streaming",
      payload: {
        discordId,
      },
    });
    res.status(200).json({});
  } catch (err) {
    if (err instanceof TokenNotFoundError) {
      res.status(401).json({ error: err });
    }
    console.dir(err);
    res.status(500).json({ error: err });
  }
};
