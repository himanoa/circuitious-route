import { InviteVcHandler } from "./handlers/invite-vc-handler"
import { Route } from "./route"

export const routes: Route[] = [
  {
    matcher: /^\/invite-vc (.+)/,
    handler: new InviteVcHandler()
  }
]
