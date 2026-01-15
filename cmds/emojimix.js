const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "emojimix",
  version: "1.0.0",
  author: "SAGOR",
  countDown: 5,
  role: 0,
  shortDescription: "Mix two emojis into one image",
  longDescription: "Combine two emojis using SAGOR's EmojiMix API",
  category: "fun",
  guide: {
    en: "{p}emojimix 😂 💀"
  }
};

module.exports.onStart = async function ({ message, args, api, event }) {
  try {
    // 🧩 Check for required args
    if (args.length < 2) {
      return message.reply("❌ Usage:\n{p}emojimix 😂 💀");
    }

    const emoji1 = args[0];
    const emoji2 = args[1];

  
    const apiUrl = `https://emojimix-xx-by-sagor.vercel.app/api/sagor?emoji1=${encodeURIComponent(
      emoji1
    )}&emoji2=${encodeURIComponent(emoji2)}`;

    const res = await axios.get(apiUrl);

    if (!res.data || res.data.status !== "success") {
      return message.reply("❌ | API failed or returned invalid data.");
    }

    // 🖼 Convert base64 image to buffer
    const base64Image = res.data.data.image.replace(/^data:image\/png;base64,/, "");
    const imgPath = path.join(__dirname, "cache", `emojimix_${Date.now()}.png`);
    fs.writeFileSync(imgPath, Buffer.from(base64Image, "base64"));

    // ✅ Send result
    await message.reply({
      body: `✅ | Emoji Mixed Successfully!\n👤 Author: SAGOR`,
      attachment: fs.createReadStream(imgPath)
    });

    // 🧹 Cleanup
    fs.unlinkSync(imgPath);
  } catch (error) {
    message.reply(`❌ | Failed to mix emojis!\nError: ${error.message}`);
  }
};