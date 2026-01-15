const fs = require("fs");
const { downloadVideo } = require("sagor-video-downloader");

module.exports = {
    config: {
        name: "autolink",
        version: "1.0",
        author: "SaGor",
        countDown: 5,
        role: 0,
        shortDescription: "Auto-download and send videos with title",
        category: "media",
    },

    onStart: async function () {},

    onChat: async function ({ api, event }) {
        const threadID = event.threadID;
        const message = event.body;
        const linkMatch = message.match(/(https?:\/\/[^\s]+)/);
        if (!linkMatch) return;

        const url = linkMatch[0];
        api.setMessageReaction("⏳", event.messageID, () => {}, true);

        try {
            const { title, filePath } = await downloadVideo(url);
            api.sendMessage(
                { body: `🎬 Title: ${title}`, attachment: fs.createReadStream(filePath) },
                threadID,
                () => {
                    fs.unlinkSync(filePath);
                    api.setMessageReaction("✅", event.messageID, () => {}, true);
                }
            );
        } catch (err) {
            api.setMessageReaction("❌", event.messageID, () => {}, true);
        }
    }
};
