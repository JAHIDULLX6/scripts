/**
 * ================================
 *  Author  : SAGOR
 *  Note    : Coded with ➲ by SAGOR
 * ================================
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// ✅ YOUR WRAPPER API
const API_ENDPOINT =
  "https://apis-by-sagor--error-system.replit.app/api?prompt=";

// ================= IMAGE DOWNLOAD =================
async function downloadImage(url, tempDir, filename) {
  const tempFilePath = path.join(tempDir, filename);
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 60000
  });
  await fs.writeFile(tempFilePath, response.data);
  return tempFilePath;
}

// ================= GRID CREATE =================
async function createGridImage(imagePaths, outputPath) {
  const images = await Promise.all(imagePaths.map(p => loadImage(p)));

  const imgWidth = images[0].width;
  const imgHeight = images[0].height;
  const padding = 10;
  const numberSize = 40;

  const canvas = createCanvas(
    imgWidth * 2 + padding * 3,
    imgHeight * 2 + padding * 3
  );
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const positions = [
    { x: padding, y: padding },
    { x: imgWidth + padding * 2, y: padding },
    { x: padding, y: imgHeight + padding * 2 },
    { x: imgWidth + padding * 2, y: imgHeight + padding * 2 }
  ];

  images.slice(0, 4).forEach((img, i) => {
    const { x, y } = positions[i];
    ctx.drawImage(img, x, y, imgWidth, imgHeight);

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.arc(x + numberSize, y + numberSize, numberSize - 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(i + 1, x + numberSize, y + numberSize);
  });

  await fs.writeFile(outputPath, canvas.toBuffer("image/png"));
  return outputPath;
}

// ================= COMMAND =================
module.exports = {
  config: {
    name: "meta",
    aliases: ["metaai", "metagen"],
    version: "1.1",
    author: "SAGOR",
    role: 0,
    category: "ai-image",
    guide: {
      en: "{pn} <prompt>\nExample: {pn} a cute cat anime style"
    }
  },

  onStart: async function ({ message, args, event, commandName }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("❌ Prompt দিন");

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    message.reaction("⏳", event.messageID);

    try {
      // 🔄 CALL WRAPPER API
      const res = await axios.get(
        API_ENDPOINT + encodeURIComponent(prompt),
        { timeout: 150000 }
      );

      const images = res.data?.data?.images;
      if (!images || images.length < 4)
        throw new Error("Images not found");

      const imageUrls = images.slice(0, 4).map(i => i.url);
      const tempPaths = [];

      for (let i = 0; i < imageUrls.length; i++) {
        tempPaths.push(
          await downloadImage(
            imageUrls[i],
            cacheDir,
            `meta_${Date.now()}_${i}.png`
          )
        );
      }

      const gridPath = path.join(cacheDir, `meta_grid_${Date.now()}.png`);
      await createGridImage(tempPaths, gridPath);

      message.reply(
        {
          body:
            "✨ Meta AI generated 4 images\n\nReply 1–4 or `all`",
          attachment: fs.createReadStream(gridPath)
        },
        (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              author: event.senderID,
              imageUrls,
              tempPaths,
              gridPath
            });
          }
        }
      );

      message.reaction("✅", event.messageID);
    } catch (e) {
      console.error(e);
      message.reaction("❌", event.messageID);
      message.reply("❌ Image generate failed");
    }
  },

  onReply: async function ({ message, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    const reply = event.body.toLowerCase();
    const cacheDir = path.join(__dirname, "cache");

    try {
      message.reaction("⏳", event.messageID);

      if (reply === "all") {
        const files = [];
        for (let i = 0; i < Reply.imageUrls.length; i++) {
          const p = path.join(cacheDir, `meta_all_${Date.now()}_${i}.png`);
          await downloadImage(Reply.imageUrls[i], cacheDir, path.basename(p));
          files.push(fs.createReadStream(p));
        }
        await message.reply({ attachment: files });
      } else {
        const i = parseInt(reply) - 1;
        if (i < 0 || i > 3) return;

        const p = path.join(cacheDir, `meta_${Date.now()}.png`);
        await downloadImage(Reply.imageUrls[i], cacheDir, path.basename(p));
        await message.reply({ attachment: fs.createReadStream(p) });
      }

      message.reaction("✅", event.messageID);
    } catch (e) {
      message.reaction("❌", event.messageID);
      message.reply("❌ Failed");
    } finally {
      global.GoatBot.onReply.delete(Reply.messageID);
    }
  }
};