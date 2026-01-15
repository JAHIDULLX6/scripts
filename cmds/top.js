module.exports = {
  config: {
    name: "top",
    version: "1.5",
    author: "SaGor",
    role: 0,
    shortDescription: { en: "Top 15 Rich Users" },
    longDescription: { en: "Shows the top 15 users with the highest money in a styled format." },
    category: "group",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const allUsers = await usersData.getAll();

      if (!allUsers || allUsers.length === 0)
        return api.sendMessage("❌ No user data available.", event.threadID, event.messageID);

      const topUsers = allUsers
        .sort((a, b) => (b.money || 0) - (a.money || 0))
        .slice(0, 15);

      const rankEmojis = ["🥇", "🥈", "🥉"]; // Top 3 medals

      const topUsersList = topUsers.map((user, index) => {
        const emoji = rankEmojis[index] || `#${index + 1}`;
        const name = user.name || "Unknown";
        const money = user.money || 0;

        // Bold Unicode for name
        const boldName = name.split("").map(c => {
          if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.charCodeAt(0) + 0x1D400 - 65);
          if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.charCodeAt(0) + 0x1D41A - 97);
          return c;
        }).join("");

        return `➤ ${emoji} ${boldName} 💰 ${money}`;
      });

      const messageText = `🏆 𝐓𝐎𝐏 15 𝗥𝗜𝗖𝗛 𝗨𝗦𝗘𝗥𝗦:\n${topUsersList.join("\n")}`;

      return api.sendMessage(messageText, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ Failed to fetch top users.", event.threadID, event.messageID);
    }
  }
};
