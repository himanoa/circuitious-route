import { Client } from "discord.js";
import { getLogger, configure } from "log4js";
import { routes } from "./default-routes";
import redis from "redis";

configure({
  appenders: { out: { type: "stdout" }, err: { type: "stderr" } },
  categories: {
    default: {
      appenders: ["out"],
      level: "info",
    },
    error: {
      appenders: ["err"],
      level: "error",
    },
  },
});
const logger = getLogger();
const errorLogger = getLogger("error");
const client = new Client();

if (typeof process.env.REDIS_URL !== "string") {
  throw Error("Enviroment variable not found: REDIS_URL");
}

const subscriber = redis.createClient(process.env.REDIS_URL);
const publisher = redis.createClient(process.env.REDIS_URL);
subscriber.on("error", (error) => console.error(error));
publisher.on("error", (error) => console.error(error));

subscriber.on("message", (channel, value) => {
  logger.info(`${channel}: ${value}`);
});

client.on("ready", () => {
  client.users.cache.forEach((u) => {
    subscriber.subscribe(u.id);
  });
});

client.on("message", (message) => {
  if (!message.author.bot) {
    for (const route of routes) {
      const matched = message.content.match(route.matcher);
      logger.info(`matched: ${matched} `);
      if (matched) {
        route.handler.run(message, matched);
        break;
      }
    }
  }
});

client.on("ready", () => {
  logger.info("Discord鯖に接続しました");
});

client.login(process.env.DISCORD_TOKEN);
