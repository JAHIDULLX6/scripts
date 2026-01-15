const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "countryinfo",
    aliases: ["country", "countrydata", "nation"],
    version: "3.1",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: "Get detailed info about any country",
    longDescription: "Shows population, area, timezone, map, flag, and local time of any country",
    category: "information",
    guide: "{pn} <country name>"
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query) return api.sendMessage("🌍 | Please enter a country name!", event.threadID, event.messageID);

    try {
      const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=false`);
      const country = res.data[0];

      const name = country.name?.common || "N/A";
      const official = country.name?.official || "N/A";
      const capital = country.capital ? country.capital.join(", ") : "N/A";
      const population = country.population?.toLocaleString() || "N/A";
      const area = country.area ? `${country.area.toLocaleString()} km²` : "N/A";
      const region = country.region || "N/A";
      const subregion = country.subregion || "N/A";
      const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
      const currency = country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(", ") : "N/A";
      const timezones = country.timezones || ["N/A"];
      const callingCode = country.idd?.root && country.idd?.suffixes ? `${country.idd.root}${country.idd.suffixes[0]}` : "N/A";
      const borders = country.borders ? country.borders.join(", ") : "None";
      const flag = country.flags?.png || "";
      const emoji = country.flag || "🏳️";
      const drivingSide = country.car?.side || "N/A";
      const continents = country.continents ? country.continents.join(", ") : "N/A";
      const maps = country.maps?.googleMaps || "N/A";
      const latlng = country.latlng ? `${country.latlng[0]}, ${country.latlng[1]}` : "N/A";

      // Generate local time for all timezones
      let localTimes = timezones.map(tz => {
        try {
          return `${tz}: ${moment().tz(tz).format("dddd, MMMM Do YYYY | hh:mm:ss A")}`;
        } catch {
          return `${tz}: N/A`;
        }
      }).join("\n");

      const msg =
`🌍 Country Information

${emoji} Name: ${name}
📜 Official Name: ${official}
🏙️ Capital: ${capital}
🌐 Region: ${region}
🌏 Subregion: ${subregion}
🧭 Continent: ${continents}
📍 Coordinates: ${latlng}
🗺️ Google Map: ${maps}

👥 Population: ${population}
📏 Area: ${area}
💬 Languages: ${languages}
💰 Currency: ${currency}

⏰ Timezone(s) & Local Time:
${localTimes}
📞 Calling Code: ${callingCode}
🚗 Drives On: ${drivingSide}
🧱 Borders: ${borders}`;

      await api.sendMessage({ body: msg, attachment: await global.utils.getStreamFromURL(flag) }, event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage("❌ | Couldn't find that country. Please check spelling or try again.", event.threadID, event.messageID);
    }
  }
};
