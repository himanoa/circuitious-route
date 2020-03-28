import { Message } from "discord.js"

export interface Handler {
  reply(message: Message, matched: RegExpMatchArray): void
}
