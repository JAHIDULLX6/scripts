const axios = require("axios");

module.exports = {
  config: {
    name: "ip",
    aliases: ["ipinfo", "myip"],
    version: "3.0",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View detailed info of an IP or your own IP",
      vi: "Xem thông tin chi tiết của IP"
    },
    longDescription: {
      en: "Get full info of any IP or your own IP with location, ISP, timezone, currency, hosting and more",
      vi: "Nhận thông tin chi tiết của bất kỳ IP nào hoặc IP của bạn với vị trí, ISP, múi giờ, tiền tệ, hosting và nhiều hơn nữa"
    },
    category: "other",
    guide: {
      en: "{pn} [IP] | {pn} json"
    }
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const timeStart = Date.now();

    let ipQuery = args[0];
    const jsonOutput = args.includes("json");

    try {
      if (!ipQuery) {
        const myIpRes = await axios.get("https://api.ipify.org?format=json");
        ipQuery = myIpRes.data.ip;
      }

      const infoip = (await axios.get(`http://ip-api.com/json/${ipQuery}?fields=66846719`)).data;

      if (infoip.status === "fail") {
        return api.sendMessage(`❌ Error: ${infoip.message}`, threadID, messageID);
      }

      if (jsonOutput) {
        return api.sendMessage("```" + JSON.stringify(infoip, null, 2) + "```", threadID, messageID);
      }

      const body = `⏱️ Response Time: ${(Date.now() - timeStart)}ms
🗺️ Continent: ${infoip.continent} (${infoip.continentCode})
🏳️ Country: ${infoip.country}
🎊 Country Code: ${infoip.countryCode}
🕋 Area: ${infoip.region}
⛱️ Region/State: ${infoip.regionName}
🏙️ City: ${infoip.city}
🛣️ District: ${infoip.district || "N/A"}
📮 ZIP Code: ${infoip.zip || "N/A"}
🧭 Latitude: ${infoip.lat}
🧭 Longitude: ${infoip.lon}
⏱️ Timezone: ${infoip.timezone} (Local Time: ${new Date().toLocaleString("en-US", { timeZone: infoip.timezone })})
👨‍💻 ISP / Org: ${infoip.isp || infoip.org || "N/A"}
💵 Currency: ${infoip.currency || "N/A"}
🆔 ASN: ${infoip.as || "N/A"}
🔗 Reverse DNS: ${infoip.reverse || "N/A"}
🛡️ Proxy / VPN: ${infoip.proxy ? "Yes" : "No"}
🖥️ Hosting: ${infoip.hosting ? "Yes" : "No"}
🌐 Google Maps: https://www.google.com/maps/search/?api=1&query=${infoip.lat},${infoip.lon}
🌐 Checked IP: ${ipQuery}`;

      await api.sendMessage({
        body,
        location: {
          latitude: infoip.lat,
          longitude: infoip.lon,
          current: true
        }
      }, threadID, messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Something went wrong while fetching IP info!", threadID, messageID);
    }
  }
};
