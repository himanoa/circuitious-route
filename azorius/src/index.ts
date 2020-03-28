import { Client, } from "discord.js"

const client = new Client()

client.on("message", (message) => {
  message.reply("ねこです")
})

client.login(process.env.DISCORD_TOKEN)
