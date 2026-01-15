const moment = require("moment");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "github",
    aliases: ["ghprofile"],
    author: "SaGor",
    countdown: 5,
    role: 0,
    category: "media",
    shortDescription: "Fetch detailed GitHub user info",
    guide: "{pn} <GitHub username>"
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("❌ Please provide a GitHub username!", event.threadID, event.messageID);

    try {
      const username = args.join(" ");
      const res = await axios.get(`https://api.github.com/users/${encodeURIComponent(username)}`);
      const user = res.data;

      if (user.message) return api.sendMessage("❌ User not found. Provide a valid username!", event.threadID, event.messageID);

      const {
        login, name, id, bio, public_repos, followers, following,
        location, company, blog, html_url, avatar_url, created_at
      } = user;

      const info = 
`>> GitHub User Info <<

Username: ${login}
Name: ${name || "N/A"}
ID: ${id}
Bio: ${bio || "N/A"}
Public Repos: ${public_repos}
Followers: ${followers}
Following: ${following}
Location: ${location || "N/A"}
Company: ${company || "N/A"}
Blog/Website: ${blog || "N/A"}
Profile URL: ${html_url}
Account Created: ${moment.utc(created_at).format("dddd, MMMM Do YYYY")}`;

      const avatarPath = __dirname + `/cache/gh_avatar_${id}.png`;
      const avatarBuffer = await axios.get(avatar_url, { responseType: "arraybuffer" }).then(res => res.data);
      fs.writeFileSync(avatarPath, avatarBuffer);

      api.sendMessage({ body: info, attachment: fs.createReadStream(avatarPath) }, event.threadID, () => fs.unlinkSync(avatarPath));

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ An error occurred while fetching the user's information. Try again later.", event.threadID, event.messageID);
    }
  }
};
