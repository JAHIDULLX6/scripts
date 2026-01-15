const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  config: {
    name: "tagall",
    aliases: ["mentionall"],
    version: "1.0",
    author: "SaGor",
    countDown: 5,
    role: 2,
    shortDescription: "Tag all members with real names",
    longDescription: "Tags everyone in the group one by one with their real names and optional message.",
    category: "group",
    guide: {
      en: "{pn} [text]",
    },
  },

  onStart: async function({ api, event, args }) {
    const { threadID } = event;
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const members = threadInfo.participantIDs || [];
      const textAfter = args.join(" ") || "";

      if (members.length === 0)
        return api.sendMessage("⚠️ No members found in this thread.", threadID);

      for (const uid of members) {
        try {
          const info = await api.getUserInfo(uid);
          const name = info[uid]?.name || "Unknown User";
          await api.sendMessage({
            body: `@${name} ${textAfter}`,
            mentions: [{ id: uid, tag: name }],
          }, threadID);
          await delay(500);
        } catch (err) {
          console.error("Error tagging user:", err);
        }
      }

      api.sendMessage("✅ Done tagging all members!", threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Error occurred while tagging!", threadID);
    }
  },
};
