const fs = require("fs-extra");
const path = require("path");

module.exports = {
 config: {
 name: "global",
 version: "1.0",
 author: "SaGor",
 countDown: 10,
 role: 2,
 shortDescription: {
 en: "Send global update notification"
 },
 description: {
 en: "Send a global styled message to all threads/groups"
 },
 category: "admin",
 guide: {
 en: "+gu your message here"
 }
 },

 onStart: async function ({
 api, event, args, threadsData
 }) {
 const content = args.join(" ");
 if (!content) return api.sendMessage("⚠️ | Please provide update message!", event.threadID, event.messageID);

 const allThreads = await threadsData.getAll();
 const sendTo = allThreads.filter(t => !!t.threadID && !t.isGroupBlocked && !t.data?.banned);

 const styledMsg = [
 "┏━━━━━━━━━━━━┓",
 "┃ 💌 𝐆𝐥𝐨𝐛𝐚𝐥 𝐔𝐩𝐝𝐚𝐭𝐞 ┃",
 "┗━━━━━━━━━━━━┛",
 "",
 `📝 𝐌𝐞𝐬𝐬𝐚𝐠𝐞:\n${content}`,
 "",
 "━━━━━━━━━━━━━━━",
 "💠 𝐁𝐨𝐭:  SaGor",
 "🔖 𝐁𝐲: JAHIDUL ISLAM SAGOR",
 "📅 " + (new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" }))
 ].join("\n");

 let success = 0, failed = 0;

 for (const thread of sendTo) {
 try {
 await api.sendMessage(styledMsg, thread.threadID);
 success++;
 } catch (e) {
 failed++;
 }
 }

 return api.sendMessage(
 `✅ 𝐆𝐥𝐨𝐛𝐚𝐥 𝐮𝐩𝐝𝐚𝐭𝐞 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐞!\n\n📤 Sent: ${success}\n❌ Failed: ${failed}`,
 event.threadID, event.messageID
 );
 }
};
