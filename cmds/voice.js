const fs = require('fs');
const fetch = require('node-fetch');
const googleTTS = require('google-tts-api');

const supportedIds = [
  "rachel", "drew", "clyde", "paul", "domi", "dave", "fin", "sarah",
  "antoni", "thomas", "charlie", "george", "emily", "elli", "callum",
  "patrick", "harry", "liam", "dorothy", "josh", "arnold", "charlotte",
  "alice", "matilda", "matthew", "james", "joseph", "jeremy", "michael",
  "ethan", "chris", "gigi", "freya", "brian", "grace", "daniel", "lily",
  "serena", "adam", "nicole", "bill", "jessie", "sam", "glinda",
  "giovanni", "mimi"
];

module.exports = {
  config: {
    name: "voice",
    version: "2.2",
    author: "SaGor",
    role: 0,
    shortDescription: "Send MP3 voice message for supported IDs",
    longDescription: "Generates and sends a TTS MP3 voice message for a supported name with custom text using Google TTS",
    category: "fun",
    usages: "voice <name> <text>",
    cooldowns: 5,
  },

  onStart: async function ({ api, event, args }) {
    const name = args[0];
    const text = args.slice(1).join(" ");
    if (!name || !text) return api.sendMessage("Usage: voice <name> <text>", event.threadID, event.messageID);

    if (!supportedIds.includes(name.toLowerCase())) {
      return api.sendMessage(`${name} is not supported. ❌`, event.threadID, event.messageID);
    }

    try {
      const url = googleTTS.getAudioUrl(text, { lang: 'en', slow: false, host: 'https://translate.google.com' });
      const filePath = __dirname + `/voice_${name}.mp3`;

      const response = await fetch(url);
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      api.sendMessage({
        body: `🎤 Voice message for "${name}":`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage("Failed to generate voice. ❌", event.threadID, event.messageID);
    }
  }
};
