const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "removebg",
    aliases: ["rbg", "bgremove"],
    version: "1.0",
    author: "SAGOR",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Remove image background"
    },
    description: {
      en: "Remove background using SAGOR RBG API"
    },
    category: "image",
    guide: {
      en: "Reply to an image and type {p}removebg"
    }
  },

  onStart: async function ({ message, event }) {
    try {
      if (!event.messageReply || !event.messageReply.attachments?.[0]) {
        return message.reply(
          "reply\nExample:\nremovebg"
        );
      }

      const imgUrl = event.messageReply.attachments[0].url;
      const apiUrl = `https://rbg-api-by-sagor.vercel.app/api/removebg?image_url=${encodeURIComponent(imgUrl)}`;

      await message.reply("Background remove...");

      const res = await axios.get(apiUrl);

      if (!res.data || res.data.status !== "success") {
        return message.reply("error");
      }

      const base64 = res.data.data.image_base64;
      const buffer = Buffer.from(base64, "base64");

      const filePath = path.join(
        __dirname,
        "cache",
        `removebg_${Date.now()}.png`
      );

      await fs.outputFile(filePath, buffer);

      return message.reply(
        {
          body: "✅ Background Removed Successfully\n🤖 SAGOR API",
          attachment: fs.createReadStream(filePath)
        },
        () => fs.unlinkSync(filePath)
      );

    } catch (err) {
      return message.reply("Server error!");
    }
  }
};