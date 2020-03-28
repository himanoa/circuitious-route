import { Client, } from "discord.js"
import { getLogger, configure } from "log4js"
import { Route } from "./route"

configure(
  {
    appenders: { 'out': { type: 'stdout' }, "err": { type: "stderr" } },
    categories: {
      default: {
        appenders: ['out'], level: 'info'
      },
      error: {
        appenders: ["err"], level: "error"
      }
    }
  }
)
const logger = getLogger()
const errorLogger = getLogger("error")
const client = new Client()
const routes: Route[] = []

client.on("message", (message) => {
  if(!message.author.bot) {
    for(const route of routes) {
      const matched = message.content.match(route.matcher)
      if(matched) {
        route.handler.reply(message, matched)
        break;
      }
    }
    const s = "ねこです";
    message.reply(s)
    logger.info(`発言: ${s}`)
  }
})

client.on("ready", () => {
  logger.info("Discord鯖に接続しました")
})

client.login(process.env.DISCORD_TOKEN)
