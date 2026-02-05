import { homedir } from "os";
import { join } from "path";

export const NotificationPlugin = async ({ $, client }) => {
  const agentSoundPath = join(homedir(), ".config/opencode/audio/staplebops-01.aac");
  const permissionSoundPath = join(homedir(), ".config/opencode/audio/staplebops-02.aac");
  const errorSoundPath = join(homedir(), ".config/opencode/audio/nope-03.aac");

  // Check if a session is a main (non-subagent) session
  const isMainSession = async (sessionID) => {
    try {
      const result = await client.session.get({ path: { id: sessionID } });
      const session = result.data ?? result;
      return !session.parentID;
    } catch {
      // If we can't fetch the session, assume it's main to avoid missing notifications
      return true;
    }
  };

  return {
    event: async ({ event }) => {
      // Only notify for main session events, not background subagents
      if (event.type === "session.idle") {
        const sessionID = event.properties.sessionID;
        if (await isMainSession(sessionID)) {
          await $`afplay ${agentSoundPath}`;
        }
      }

      // Permission prompt created
      if (event.type === "permission.asked") {
        await $`afplay ${permissionSoundPath}`;
      }

      // Question prompt created
      if (event.type === "question.asked") {
        await $`afplay ${permissionSoundPath}`;
      }

      // Session error
      if (event.type === "session.error") {
        await $`afplay ${errorSoundPath}`;
      }
    },
  };
};
