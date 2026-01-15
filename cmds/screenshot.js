module.exports = {
  config: {
    name: "ss",
    aliases: ["screenshot"],
    version: "1.0",
    author: "SAGOR",
    role: 0,
    category: "utility",
    description: "Take a HD mobile view screenshot of a website using Screenshot Machine API.",
    usage: "ss <url>"
  },

  onStart: async function({ api, event, args }) {
    const fs = require("fs");
    const axios = require("axios");
    const path = require("path");

    if (!args[0]) return api.sendMessage("Please provide a URL!", event.threadID, event.messageID);

    let url = args[0];
    if (!url.startsWith("http")) url = "https://" + url;

    const apiKey = "1e1458";
    const apiUrl = `https://api.screenshotmachine.com?key=${apiKey}&url=${encodeURIComponent(url)}&dimension=1080x1920&device=mobile&format=png`;

    const filePath = path.join(__dirname, "ss.png");

    try {
      const response = await axios({
        url: apiUrl,
        method: "GET",
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, response.data);

      api.sendMessage({ body: `📱 HD Mobile screenshot of: ${url}`, attachment: fs.createReadStream(filePath) }, event.threadID, () => {
        fs.unlinkSync(filePath);
      }, event.messageID);

    } catch (err) {
      api.sendMessage("❌ Failed to capture screenshot!\n" + err.message, event.threadID, event.messageID);
    }
  }
};
