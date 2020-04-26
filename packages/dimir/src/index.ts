import redis from "redis";
import WebSocket from "ws";

if (typeof process.env.PORT !== "string") {
  throw Error("Enviroment variable not found: REDIS_URL");
}

if (typeof process.env.REDIS_URL !== "string") {
  throw Error("Enviroment variable not found: REDIS_URL");
}

const subscriber = redis.createClient(process.env.REDIS_URL);
subscriber.on("error", (error) => console.error(error));

const ws = new WebSocket.Server({
  port: parseInt(process.env.PORT, 10),
});

const currentConnections: WebSocket[] = [];

subscriber.on("pmessage", (_pattern, _channel, msg) => {
  for (const connection of currentConnections) {
    connection.send(msg);
  }
});

subscriber.psubscribe("*");

ws.on("connection", (socket) => {
  console.log("connected");
  currentConnections.push(socket);
});
