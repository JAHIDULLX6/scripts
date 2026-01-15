module.exports = {
  config: {
    name: "hack",
    aliases: [],
    version: "1.0.0",
    author: "SaGor",
    role: 0,
    category: "Fun",
    description: "Create a fun canvas image with user profile and background",
    usages: "user",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": ""
    }
  },

  wrapText: (ctx, text, maxWidth) => {
    return new Promise(resolve => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText('W').width > maxWidth) return resolve(null);
      const words = text.split(' ');
      const lines = [];
      let line = '';
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
          else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
        else {
          lines.push(line.trim());
          line = '';
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  },

  onStart: async function({ api, event }) {
    const fs = require("fs-extra");
    const axios = require("axios");
    const { loadImage, createCanvas } = require("canvas");

    const pathImg = __dirname + "/cache/background.png";
    const pathAvt1 = __dirname + "/cache/Avtmot.png";

    const id = Object.keys(event.mentions)[0] || event.senderID;
    const userInfo = await api.getUserInfo(id);
    const name = userInfo[id].name;

    const backgrounds = [
      "https://drive.google.com/uc?id=1RwJnJTzUmwOmP3N_mZzxtp63wbvt9bLZ"
    ];
    const bgUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    const getAvt = (await axios.get(
      `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(pathAvt1, Buffer.from(getAvt, "utf-8"));

    const getBg = (await axios.get(bgUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(getBg, "utf-8"));

    const baseImage = await loadImage(pathImg);
    const baseAvt = await loadImage(pathAvt1);

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    ctx.font = "400 23px Arial";
    ctx.fillStyle = "#1878F3";
    ctx.textAlign = "start";

    const lines = await this.wrapText(ctx, name, 1160);
    ctx.fillText(lines.join('\n'), 200, 497);

    ctx.drawImage(baseAvt, 83, 437, 100, 101);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);

    return api.sendMessage(
      { body: ``, attachment: fs.createReadStream(pathImg) },
      event.threadID,
      () => fs.unlinkSync(pathImg),
      event.messageID
    );
  }
};
