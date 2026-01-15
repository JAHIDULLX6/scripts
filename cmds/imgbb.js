module.exports = {
  config: {
    name: "imgbb",
    aliases: ["uploadimg", "imgup"],
    version: "1.0.0",
    role: 0,
    author: "SaGor",
    description: { en: "Upload a photo to ImgBB" },
    longDescription: { en: "Reply to an image and use this command to upload it to ImgBB and get a link" },
    commandCategory: "Uploader",
    usages: "{pn} [reply to photo]",
    cooldowns: 5
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID } = event;
    const axios = require("axios");

    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return api.sendMessage("❌ Please reply to a photo.", threadID, messageID);
    }

    try {
      const attachment = event.messageReply.attachments[0];
      const imageUrl = attachment.url;

      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const base64Image = Buffer.from(response.data, "binary").toString("base64");

      const apiResponse = await axios.post("https://imgbb-sagor-api.vercel.app/sagor/upload", {
        image: base64Image
      });

      const data = apiResponse.data;

      if (data.success) {
        api.sendMessage(`${data.url}`, threadID, messageID);
      } else {
        api.sendMessage("❌ Upload failed!", threadID, messageID);
      }
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Something went wrong!", threadID, messageID);
    }
  }
};
