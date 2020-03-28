import { InviteVcHandler } from "./handlers/invite-vc-handler"
import { Route } from "./route"

const voiceChannelState = { currentJoinedCoiceChannel: null }
export const routes: Route[] = [
  {
    matcher: /^\/invite-vc (.+)/,
    handler: new InviteVcHandler(voiceChannelState)
  }
]
