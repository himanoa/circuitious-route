import { Message } from "discord.js"

import { Handler } from "../handler"
import { VcState } from "../vc-state"

export class LeaveVcHandler implements Handler {
  constructor(private state: VcState ) {}
  run(msg: Message) {
    if(!this.state.currentJoinedVoiceChannel) {
      msg.reply("現在ボイスチャンネルには参加していません")
      return
    }
    this.state.currentJoinedVoiceChannel.leave()
  }
}
