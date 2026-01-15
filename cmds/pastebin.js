const PastebinAPI = require('pastebin-js');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "bin",
    aliases: ["pastebin"],
    version: "1.0",
    author: "SaGor",
    countDown: 5,
    role: 2,
    shortDescription: "Upload command file to Pastebin",
    longDescription: "Uploads a file from the 'cmds' folder to Pastebin and returns the link.",
    category: "utility",
    guide: {
      en: "{pn} <filename>\nExample: {pn} help",
    },
  },

  onStart: async function({ api, event, args }) {
    const pastebin = new PastebinAPI({
      api_dev_key: "LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9"
    });

    if (!args[0]) return api.sendMessage("⚠️ Please provide a file name.", event.threadID);

    const fileName = args[0].replace(/\.js$/, "");
    const filePath = path.join(__dirname, fileName + ".js");

    if (!fs.existsSync(filePath))
      return api.sendMessage("❌ File not found in cmds folder!", event.threadID);

    try {
      const fileData = fs.readFileSync(filePath, "utf8");

      const pasteUrl = await pastebin.createPaste({
        text: fileData,
        title: fileName,
        privacy: 1,
      });

      const rawLink = pasteUrl.replace("pastebin.com/", "pastebin.com/raw/");
      api.sendMessage(`${rawLink}`, event.threadID);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Failed to upload file to Pastebin.", event.threadID);
    }
  },
};
