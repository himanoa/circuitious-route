import { Events } from "izett";
import { startStreamingHandler } from "./start-streaming-handler";
import { Client } from "discord.js";
import { Logger } from "log4js";

type Dependencies = {
  discordClient: Client;
  logger: Logger;
};

export const handler = (deps: Dependencies) => (event: any) => {
  if (event.type === "start-streaming") {
    startStreamingHandler(deps)(event);
  }
};
