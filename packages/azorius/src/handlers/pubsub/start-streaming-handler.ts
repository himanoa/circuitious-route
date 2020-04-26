import { StartStreamingEvent } from "izett";
import { Client, VoiceChannel, Channel } from "discord.js";
import { Logger } from "log4js";

export type Dependencies = {
  discordClient: Client;
  logger: Logger;
};

const isVoiceChannel = (c: Channel): c is VoiceChannel => c.type === "voice";

export const startStreamingHandler = (deps: Dependencies) => (
  event: StartStreamingEvent
) => {
  const { discordId } = event.payload;
  const voiceChannels = deps.discordClient.channels.cache.filter(
    (c) => c.type === "voice"
  );
  const streamerUserJoinedVoiceChannel = voiceChannels.find((v) => {
    if (isVoiceChannel(v)) {
      return Array.from(v.members.keys()).includes(discordId);
    }
    return false;
  });

  if (
    streamerUserJoinedVoiceChannel &&
    isVoiceChannel(streamerUserJoinedVoiceChannel)
  ) {
    return streamerUserJoinedVoiceChannel.join();
  }
  deps.logger.info(
    "ボイスチャンネルに配信開始したユーザーが存在しませんでした"
  );
};
