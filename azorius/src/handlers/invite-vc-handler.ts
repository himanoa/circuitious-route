import { Message, VoiceChannel } from "discord.js"
import { Handler } from "../handler"

export class InviteVcHandler implements Handler {
  async sendMessage(message: Message, matched: RegExpMatchArray) {
    const channelName = matched[1]
    if(message.guild) {
      const voiceChannel = message.guild.channels.cache.find(channel => channel.name === channelName)
      if(voiceChannel && voiceChannel.type === "voice") {
        await (voiceChannel as VoiceChannel).join()
        message.reply("参加した")
      }
    }
  }
}
