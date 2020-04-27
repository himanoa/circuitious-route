// WebSocketの鯖につないだときに流すイベント
// このイベントを流すことで、イベントを流したソケットにRedisからのイベントが流れるようになる
export type StartSubscribeEvent = {
  type: "start-subscribe";
  payload: {
    discordId: string;
  };
};
