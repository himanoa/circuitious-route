import { InviteVcHandler } from "./handlers/invite-vc-handler";
import { LeaveVcHandler } from "./handlers/leave-vc-handler";
import { SetStreamKeyHandler } from "./handlers/set-stream-key-handler";
import { Route } from "./route";

const voiceChannelState = { currentJoinedVoiceChannel: null };
export const routes: Route[] = [
  {
    matcher: /^\/invite-vc (.+)/,
    handler: new InviteVcHandler(voiceChannelState),
  },
  {
    matcher: /^\/leave-vc/,
    handler: new LeaveVcHandler(voiceChannelState),
  },
  {
    matcher: /\/set-stream-key/,
    handler: new SetStreamKeyHandler(),
  },
];
