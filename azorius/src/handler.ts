import { Message } from "discord.js"

export interface Handler {
  sendMessage(message: Message, matched: RegExpMatchArray): void
}
