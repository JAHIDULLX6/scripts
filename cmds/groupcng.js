const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "gc",
    version: "1.0.1",
    author: "SaGor",
    longDescription: "Change group name, emoji, or photo",
    shortDescription: "Change group info",
    category: "group",
    usages: "name <new name> | emoji <emoji> | photo (reply image)",
    cooldowns: 5,
    role: 1
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0])
      return api.sendMessage(
        "🛠️ | Usage:\n• gc name <new name>\n• gc emoji <emoji>\n• gc photo (reply with image)",
        event.threadID,
        event.messageID
      );

    const action = args[0].toLowerCase();

    try {
      if (action === "name") {
        const newName = args.slice(1).join(" ");
        if (!newName)
          return api.sendMessage("❌ | Please enter a new group name.", event.threadID, event.messageID);
        api.setMessageReaction("⏳", event.messageID, () => {}, true);
        await api.setTitle(newName, event.threadID);
        api.setMessageReaction("✅", event.messageID, () => {}, true);

      } else if (action === "emoji") {
        const emoji = args[1];
        if (!emoji)
          return api.sendMessage("❌ | Please provide an emoji.", event.threadID, event.messageID);
        api.setMessageReaction("⏳", event.messageID, () => {}, true);
        await api.changeThreadEmoji(emoji, event.threadID);
        api.setMessageReaction("✅", event.messageID, () => {}, true);

      } else if (action === "photo") {
        if (
          event.type !== "message_reply" ||
          !event.messageReply.attachments ||
          event.messageReply.attachments.length === 0
        )
          return api.sendMessage(
            "❌ | Please reply to an image to set as group photo.",
            event.threadID,
            event.messageID
          );

        const photoUrl = event.messageReply.attachments[0].url;
        const photoPath = __dirname + "/gc_photo.jpg";
        const response = await axios.get(photoUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(photoPath, Buffer.from(response.data, "binary"));

        api.setMessageReaction("⏳", event.messageID, () => {}, true);
        await api.changeGroupImage(fs.createReadStream(photoPath), event.threadID);
        fs.unlinkSync(photoPath);
        api.setMessageReaction("✅", event.messageID, () => {}, true);

      } else {
        api.sendMessage("❌ | Invalid option.\nUse: name, emoji, or photo", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage(
        "⚠️ | Failed to change group info. Make sure the bot is an admin.",
        event.threadID,
        event.messageID
      );
    }
  },
};
