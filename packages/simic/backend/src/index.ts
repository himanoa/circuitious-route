import { randomBytes } from "crypto";
import * as Express from "express";
import * as sqlite from "sqlite";
import { issueLoginUrlHandler } from "./handlers/issue-login-url-handler";
import { issueAuthorizedTokenHandler } from "./handlers/issue-authorized-token-handler";
import { upsertProfileHandler } from "./handlers/upsert-profiles-handler";
import { refreshTokenHandler } from "./handlers/refresh-token-handler";
import { verifyHandler } from "./handlers/verify-handler";
import { startStreamingHandler } from "./handlers/start-streaming-handler";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import morgan from "morgan";
import cors from "cors";
import redis from "redis";
import { promisify } from "util";

if (typeof process.env.REDIS_URL !== "string") {
  throw Error("Enviroment variable not found: REDIS_URL");
}

const redisClient = redis.createClient(process.env.REDIS_URL);
redisClient.on("error", (error) => console.error(error));
const publishEvent = promisify(redisClient.publish.bind(redisClient));

if (typeof process.env.DATABASE_PATH !== "string") {
  throw Error("Enviroment variable not found: DATABASE_PATH");
}

if (typeof process.env.PRIVATE_KEY_PATH !== "string") {
  throw Error("Enviroment variable not found: PRIVATE_KEY_PATH");
}

if (typeof process.env.PUBLIC_KEY_PATH !== "string") {
  throw Error("Enviroment variable not found: PRIVATE_KEY_PATH");
}

if (typeof process.env.ACCESS_CONTROL_ALLOW_ORIGIN !== "string") {
  throw Error("Enviroment variable not found: ACCESS_CONTROL_ALLOW_ORIGIN");
}

const privateKey = readFileSync(process.env.PRIVATE_KEY_PATH);
const publicKey = readFileSync(process.env.PUBLIC_KEY_PATH);
const db = sqlite.open(process.env.DATABASE_PATH, { promise: Promise });

const app = Express.default();
app.use(morgan("combined"));
app.use(Express.json());
app.use(
  cors({
    origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
  })
);

function runAsyncWrapper(
  callback: (
    req: Express.Request,
    res: Express.Response,
    next?: Express.NextFunction
  ) => Promise<void>
) {
  return function (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) {
    callback(req, res, next).catch(next);
  };
}

app.post(
  "/login-url",
  runAsyncWrapper(
    issueLoginUrlHandler({
      executeQuery: db.then(
        (db) => new Promise((resolve) => resolve(db.all.bind(db)))
      ),
      generateRandomString: () => randomBytes(16).toString("hex"),
    })
  )
);

app.post(
  "/:loginId/authorize",
  runAsyncWrapper(
    issueAuthorizedTokenHandler({
      executeQuery: db.then(
        (db) => new Promise((resolve) => resolve(db.all.bind(db)))
      ),
      generateRandomString: () => randomBytes(16).toString("hex"),
      sign: ({ discordId }) =>
        jwt.sign({ discordId }, privateKey, {
          algorithm: "RS256",
          expiresIn: 60 * 60,
        }),
    })
  )
);

app.get(
  "/verify",
  runAsyncWrapper(
    verifyHandler({
      executeQuery: db.then(
        (db) => new Promise((resolve) => resolve(db.all.bind(db)))
      ),
      generateRandomString: () => randomBytes(16).toString("hex"),
      verify: (token) =>
        jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as any,
    })
  )
);

app.put(
  "/upsert-profiles",
  runAsyncWrapper(
    upsertProfileHandler({
      executeQuery: db.then(
        (db) => new Promise((resolve) => resolve(db.all.bind(db)))
      ),
      verify: (token) =>
        jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as any,
    })
  )
);

app.post(
  "/refresh-token",
  runAsyncWrapper(
    refreshTokenHandler({
      executeQuery: db.then(
        (db) => new Promise((resolve) => resolve(db.all.bind(db)))
      ),
      generateRandomString: () => randomBytes(16).toString("hex"),
      sign: ({ discordId }) =>
        jwt.sign({ discordId }, privateKey, {
          algorithm: "RS256",
          expiresIn: 60 * 60,
        }),
    })
  )
);

app.post(
  "/start-streaming",
  runAsyncWrapper(
    startStreamingHandler({
      verify: (token) =>
        jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as any,
      publishEvent: async (e) => {
        if (e.type === "start-streaming") {
          await publishEvent(e.payload.discordId, JSON.stringify(e));
          return;
        }
        throw new Error(`${e.type} is not start-streaming event`);
      },
    })
  )
);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Simic backend app listening at localhost:${process.env.PORT || 3000}`
  );
});
