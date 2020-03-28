import { Message } from "discord.js"

export interface Handler {
  run(message: Message, matched: RegExpMatchArray): void
}
