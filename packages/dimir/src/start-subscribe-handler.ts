import { StartSubscribeEvent } from "izett";
import WebSocket from "ws";

export type Dependencies = {
  connections: Map<string, WebSocket[]>;
};

export const startSubscribeHandler = (deps: Dependencies) => (
  e: StartSubscribeEvent,
  ws: WebSocket
) => {
  const currentConns = deps.connections.get(e.payload.discordId);
  const discordId = e.payload.discordId;

  if (currentConns) {
    return deps.connections.set(discordId, [...currentConns, ws]);
  }
  deps.connections.set(discordId, [ws]);
};
