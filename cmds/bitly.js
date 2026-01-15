const axios = require("axios");

module.exports = {
  config: {
    name: "bitly",
    version: "1.2.0",
    author: "SaGor",
    longDescription: "Shorten a link using Bitly",
    shortDescription: "Shorten a link using Bitly",
    category: "general",
    usages: "<link>",
    cooldowns: 10,
    role: 0
  },

  onStart: async function ({ api, event, args }) {
    const token = "ee891aaa3d51db956a8e1c0bdc116cf2e7df839d";
    if (args.length < 1) return api.sendMessage("❌ | Please provide a link to shorten.", event.threadID, event.messageID);
    const originalLink = args[0];
    api.setMessageReaction("⏳", event.messageID, () => {}, true);
    try {
      const response = await axios.post("https://api-ssl.bitly.com/v4/shorten", { long_url: originalLink }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const shortenedLink = response.data.link;
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      api.sendMessage(`${shortenedLink}`, event.threadID, event.messageID);
    } catch (error) {
      console.error("Bitly Error:", error?.response?.data || error.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("❌ | Failed to shorten the link. Please check the URL or try again later.", event.threadID, event.messageID);
    }
  },
};
