import { Message } from "discord.js";

import { Handler } from "../handler";
import { VcState } from "../vc-state";
import join from "url-join";

export class SetStreamKeyHandler implements Handler {
  run(msg: Message, matched: RegExpMatchArray) {
    msg.reply("ストリームキーの設定をするためにDirectMessageを開いてください");
    msg.author.send("こちらにyoutubeのストリームキーをコピペしてください");
  }
}
