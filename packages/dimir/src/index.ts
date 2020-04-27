import redis from "redis";
import WebSocket from "ws";
import { startSubscribeHandler } from "./start-subscribe-handler";

if (typeof process.env.PORT !== "string") {
  throw Error("Enviroment variable not found: REDIS_URL");
}

if (typeof process.env.REDIS_URL !== "string") {
  throw Error("Enviroment variable not found: REDIS_URL");
}

const subscriber = redis.createClient(process.env.REDIS_URL);
subscriber.on("error", (error) => console.error(error));

const connections = new Map<string, WebSocket[]>();

const ws = new WebSocket.Server({
  port: parseInt(process.env.PORT, 10),
});

subscriber.on("pmessage", (_pattern, _channel, msg) => {
  const message = JSON.parse(msg);
  const { discordId } = message.payload;
  const conns = connections.get(discordId);
  if (conns) {
    for (const connection of conns) {
      connection.send(msg);
    }
  }
});

subscriber.psubscribe("*");

ws.on("connection", (socket) => {
  socket.on("message", (msg) => {
    const payload = JSON.parse(msg.toString());
    if (payload.type === "start-subscribe") {
      console.log(`Start subscription ${payload.payload.discordId}`);
      startSubscribeHandler({
        connections,
      })(payload, socket);
    }
  });
});
