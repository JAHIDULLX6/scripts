// 🔒 Author Lock - Do not change this!
const AUTHOR = "Mastermind X Rocky";
if (AUTHOR !== "Mastermind X Rocky") {
  throw new Error("⛔ Do not change the author. File will not work.");
}

const axios = require("axios");

module.exports = {
  config: {
    name: "addmem",
    version: "1.0",
    author: AUTHOR, // Do not change this
    description: "Add all members from other groups to current box",
    usage: "addmem",
    cooldown: 10,
    permissions: [2],
  },

  onStart: async function ({ api, event }) {
    const threadList = await api.getThreadList(100, null, ["INBOX"]);
    const currentThreadID = event.threadID;
    const botID = api.getCurrentUserID();
    const addedUsers = new Set();

    for (const thread of threadList) {
      if (thread.threadID === currentThreadID || !thread.isGroup) continue;

      try {
        const threadInfo = await api.getThreadInfo(thread.threadID);
        for (const userID of threadInfo.participantIDs) {
          if (userID !== botID && !addedUsers.has(userID)) {
            try {
              await api.addUserToGroup(userID, currentThreadID);
              addedUsers.add(userID);
            } catch (err) {
              console.log(`Failed to add user ${userID}: ${err.message}`);
            }
          }
        }
      } catch (err) {
        console.log(`Failed to get info for thread ${thread.threadID}: ${err.message}`);
      }
    }

    api.sendMessage(`✅ Members from all other groups added (if possible).`, currentThreadID);
  }
};