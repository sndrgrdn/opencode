const RM_RF_PATTERN = /(^|\[;&|\]\s*)\s*(?:sudo\s+)?(?:command\s+)?rm\s+-(?:rf|fr)\b/

export const TrashProtectionPlugin = async ({ client }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "bash") {
        return
      }

      const command = output?.args?.command ?? ""

      if (RM_RF_PATTERN.test(command)) {
        await client.app.log({
          body: {
            service: "trash-protection",
            level: "warn",
            message: `Blocked dangerous rm -rf command`,
            extra: { originalCommand: command },
          },
        });

        throw new Error("Refusing to run `rm -rf`. Use `trash` instead.")
      }
    },
  };
};
