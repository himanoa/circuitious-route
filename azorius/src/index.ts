import { Client, } from "discord.js"

const client = new Client()

client.on("message", (message) => {
  message.reply("ねこです")
})

client.on("ready", () => {
})

client.login(process.env.DISCORD_TOKEN)
