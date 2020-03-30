import * as Express from "express";
import { validate, defineSchema } from "@japan-d2/schema"

const app = Express.default()

app.post("/", (req, res) => {
  const inputSchema = defineSchema().string("discordId")
  if(validate(req.body, inputSchema)) {
    req.body.discordId
  }
})
