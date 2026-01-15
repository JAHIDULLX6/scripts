const axios = require("axios");
const fs = require("fs-extra");
const FormData = require("form-data");
const path = require("path");

async function handleCatboxUpload({ event, api, message }) {
  const { messageReply, messageID } = event;
  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return message.reply("Please reply to an image or video.");
  }

  const fileUrl = messageReply.attachments[0].url;
  const ext = messageReply.attachments[0].type === "photo" ? ".jpg" : ".mp4";
  const filePath = path.join(__dirname, "temp" + ext);

  api.setMessageReaction("🕛", messageID, () => {}, true);
  const loading = await message.reply("please wait...");

  setTimeout(() => {
    api.unsendMessage(loading.messageID);
  }, 5000);

  try {
    const uploadApiUrl = "https://catbox.moe/user/api.php";

    const response = await axios.get(fileUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", fs.createReadStream(filePath));

    const upload = await axios.post(uploadApiUrl, form, {
      headers: form.getHeaders(),
    });

    fs.unlinkSync(filePath);

    api.setMessageReaction("✅", messageID, () => {}, true);
    return message.reply(upload.data);
  } catch (err) {
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
    api.setMessageReaction("❌", messageID, () => {}, true);
    return message.reply("❌ Failed to upload to Catbox.");
  }
}

module.exports = {
  config: {
    name: "catbox",
    aliases: ["ct"],
    version: "1.3",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: "Upload media to catbox.moe",
    longDescription: "Upload replied image or video to catbox.moe and get link",
    category: "tools",
    guide: {
      en: "{pn} (reply to image/video)"
    }
  },

  onStart: async function ({ event, api, message }) {
    return handleCatboxUpload({ event, api, message });
  }
};
