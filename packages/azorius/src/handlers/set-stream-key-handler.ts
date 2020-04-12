import { Message } from "discord.js";

import { Handler } from "../handler";
import { VcState } from "../vc-state";
import fetch from "node-fetch";
import join from "url-join";

export class SetStreamKeyHandler implements Handler {
  async run(msg: Message, matched: RegExpMatchArray) {
    if (process.env.LOGIN_URL_API) {
      const response = await fetch(process.env.LOGIN_URL_API, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordId: msg.author.id.toString() }),
      });
      if (response.status !== 201) {
        throw new Error("response is not 201");
      }
      const { loginId } = await response.json();
      msg.reply(
        "ストリームキーの設定をするためにDirectMessageを開いてください"
      );
      msg.author.send(`${join(process.env.LOGIN_URL as string, loginId)}`);
    } else {
      throw new Error("LOGIN_URL_API is not defined");
    }
  }
}
