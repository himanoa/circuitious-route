// 管理画面上から配信が開始されたときに発生するイベント
export type StartStreamingEvent = {
  type: "start-streaming";
  payload: {
    discordId: string;
  };
};
