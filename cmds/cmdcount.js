module.exports = {
  config: {
    name: "ccc",
    aliases: ["cmdcount", "countcmd"],
    version: "1.1",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: "Show total commands count",
    longDescription: "Display total number of installed commands and category-wise stats",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    const commands = global.GoatBot?.commands || new Map();
    const total = commands.size;
    const categories = {};

    for (const [, cmd] of commands) {
      const cat = cmd.config?.category || "Uncategorized";
      categories[cat] = (categories[cat] || 0) + 1;
    }

    const sorted = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([c, n]) => `• ${c}: ${n}`)
      .join("\n");

    const msg = `⚙️ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐂𝐎𝐔𝐍𝐓 𝐂𝐇𝐄𝐂𝐊𝐄𝐑\n━━━━━━━━━━━━━━━\n📦 Total: ${total}\n\n📂 By Category:\n${sorted}`;

    return message.reply(msg);
  }
};
