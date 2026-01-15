const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "time",
    aliases: ["clock", "timezone"],
    version: "5.4",
    role: 0,
    author: "SaGor",
    shortDescription: { en: "Show country flag and current time" },
    longDescription: { en: "Displays the current time, date, and flag for a specified country." },
    category: "Utility",
    guide: { en: "{pn} <country_name> - Show time of the country" },
    cooldowns: 2
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("Please provide a country name!", event.threadID, event.messageID);

    const countryName = args.join(" ").toLowerCase();

    const countries = [
      {"name":"Afghanistan","flag":"🇦🇫","timezone":"Asia/Kabul"},
  {"name":"Albania","flag":"🇦🇱","timezone":"Europe/Tirane"},
  {"name":"Algeria","flag":"🇩🇿","timezone":"Africa/Algiers"},
  {"name":"Andorra","flag":"🇦🇩","timezone":"Europe/Andorra"},
  {"name":"Angola","flag":"🇦🇴","timezone":"Africa/Luanda"},
  {"name":"Antigua and Barbuda","flag":"🇦🇬","timezone":"America/Antigua"},
  {"name":"Argentina","flag":"🇦🇷","timezone":"America/Argentina/Buenos_Aires"},
  {"name":"Armenia","flag":"🇦🇲","timezone":"Asia/Yerevan"},
  {"name":"Australia","flag":"🇦🇺","timezone":"Australia/Sydney"},
  {"name":"Austria","flag":"🇦🇹","timezone":"Europe/Vienna"},
  {"name":"Azerbaijan","flag":"🇦🇿","timezone":"Asia/Baku"},
  {"name":"Bahamas","flag":"🇧🇸","timezone":"America/Nassau"},
  {"name":"Bahrain","flag":"🇧🇭","timezone":"Asia/Bahrain"},
  {"name":"Bangladesh","flag":"🇧🇩","timezone":"Asia/Dhaka"},
  {"name":"Barbados","flag":"🇧🇧","timezone":"America/Barbados"},
  {"name":"Belarus","flag":"🇧🇾","timezone":"Europe/Minsk"},
  {"name":"Belgium","flag":"🇧🇪","timezone":"Europe/Brussels"},
  {"name":"Belize","flag":"🇧🇿","timezone":"America/Belize"},
  {"name":"Benin","flag":"🇧🇯","timezone":"Africa/Porto-Novo"},
  {"name":"Bhutan","flag":"🇧🇹","timezone":"Asia/Thimphu"},
  {"name":"Bolivia","flag":"🇧🇴","timezone":"America/La_Paz"},
  {"name":"Bosnia and Herzegovina","flag":"🇧🇦","timezone":"Europe/Sarajevo"},
  {"name":"Botswana","flag":"🇧🇼","timezone":"Africa/Gaborone"},
  {"name":"Brazil","flag":"🇧🇷","timezone":"America/Sao_Paulo"},
  {"name":"Brunei","flag":"🇧🇳","timezone":"Asia/Brunei"},
  {"name":"Bulgaria","flag":"🇧🇬","timezone":"Europe/Sofia"},
  {"name":"Burkina Faso","flag":"🇧🇫","timezone":"Africa/Ouagadougou"},
  {"name":"Burundi","flag":"🇧🇮","timezone":"Africa/Bujumbura"},
  {"name":"Cabo Verde","flag":"🇨🇻","timezone":"Atlantic/Cape_Verde"},
  {"name":"Cambodia","flag":"🇰🇭","timezone":"Asia/Phnom_Penh"},
  {"name":"Cameroon","flag":"🇨🇲","timezone":"Africa/Douala"},
  {"name":"Canada","flag":"🇨🇦","timezone":"America/Toronto"},
  {"name":"Central African Republic","flag":"🇨🇫","timezone":"Africa/Bangui"},
  {"name":"Chad","flag":"🇹🇩","timezone":"Africa/Ndjamena"},
  {"name":"Chile","flag":"🇨🇱","timezone":"America/Santiago"},
  {"name":"China","flag":"🇨🇳","timezone":"Asia/Shanghai"},
  {"name":"Colombia","flag":"🇨🇴","timezone":"America/Bogota"},
  {"name":"Comoros","flag":"🇰🇲","timezone":"Indian/Comoro"},
  {"name":"Congo (Congo-Brazzaville)","flag":"🇨🇬","timezone":"Africa/Brazzaville"},
  {"name":"Costa Rica","flag":"🇨🇷","timezone":"America/Costa_Rica"},
  {"name":"Croatia","flag":"🇭🇷","timezone":"Europe/Zagreb"},
  {"name":"Cuba","flag":"🇨🇺","timezone":"America/Havana"},
  {"name":"Cyprus","flag":"🇨🇾","timezone":"Asia/Nicosia"},
  {"name":"Czechia (Czech Republic)","flag":"🇨🇿","timezone":"Europe/Prague"},
  {"name":"Denmark","flag":"🇩🇰","timezone":"Europe/Copenhagen"},
  {"name":"Djibouti","flag":"🇩🇯","timezone":"Africa/Djibouti"},
  {"name":"Dominica","flag":"🇩🇲","timezone":"America/Dominica"},
  {"name":"Dominican Republic","flag":"🇩🇴","timezone":"America/Santo_Domingo"},
  {"name":"Ecuador","flag":"🇪🇨","timezone":"America/Guayaquil"},
  {"name":"Egypt","flag":"🇪🇬","timezone":"Africa/Cairo"},
  {"name":"El Salvador","flag":"🇸🇻","timezone":"America/El_Salvador"},
  {"name":"Equatorial Guinea","flag":"🇬🇶","timezone":"Africa/Malabo"},
  {"name":"Eritrea","flag":"🇪🇷","timezone":"Africa/Asmara"},
  {"name":"Estonia","flag":"🇪🇪","timezone":"Europe/Tallinn"},
  {"name":"Eswatini (fmr. Swaziland)","flag":"🇸🇿","timezone":"Africa/Mbabane"},
  {"name":"Ethiopia","flag":"🇪🇹","timezone":"Africa/Addis_Ababa"},
  {"name":"Fiji","flag":"🇫🇯","timezone":"Pacific/Fiji"},
  {"name":"Finland","flag":"🇫🇮","timezone":"Europe/Helsinki"},
  {"name":"France","flag":"🇫🇷","timezone":"Europe/Paris"},
  {"name":"Gabon","flag":"🇬🇦","timezone":"Africa/Libreville"},
  {"name":"Gambia","flag":"🇬🇲","timezone":"Africa/Banjul"},
  {"name":"Georgia","flag":"🇬🇪","timezone":"Asia/Tbilisi"},
  {"name":"Germany","flag":"🇩🇪","timezone":"Europe/Berlin"},
  {"name":"Ghana","flag":"🇬🇭","timezone":"Africa/Accra"},
  {"name":"Greece","flag":"🇬🇷","timezone":"Europe/Athens"},
  {"name":"Grenada","flag":"🇬🇩","timezone":"America/Grenada"},
  {"name":"Guatemala","flag":"🇬🇹","timezone":"America/Guatemala"},
  {"name":"Guinea","flag":"🇬🇳","timezone":"Africa/Conakry"},
  {"name":"Guinea-Bissau","flag":"🇬🇼","timezone":"Africa/Bissau"},
  {"name":"Guyana","flag":"🇬🇾","timezone":"America/Guyana"},
  {"name":"Haiti","flag":"🇭🇹","timezone":"America/Port-au-Prince"},
  {"name":"Honduras","flag":"🇭🇳","timezone":"America/Tegucigalpa"},
  {"name":"Hungary","flag":"🇭🇺","timezone":"Europe/Budapest"},
  {"name":"Iceland","flag":"🇮🇸","timezone":"Atlantic/Reykjavik"},
  {"name":"India","flag":"🇮🇳","timezone":"Asia/Kolkata"},
  {"name":"Indonesia","flag":"🇮🇩","timezone":"Asia/Jakarta"},
  {"name":"Iran","flag":"🇮🇷","timezone":"Asia/Tehran"},
  {"name":"Iraq","flag":"🇮🇶","timezone":"Asia/Baghdad"},
  {"name":"Ireland","flag":"🇮🇪","timezone":"Europe/Dublin"},
  {"name":"Israel","flag":"🇮🇱","timezone":"Asia/Jerusalem"},
  {"name":"Italy","flag":"🇮🇹","timezone":"Europe/Rome"},
  {"name":"Jamaica","flag":"🇯🇲","timezone":"America/Jamaica"},
  {"name":"Japan","flag":"🇯🇵","timezone":"Asia/Tokyo"},
  {"name":"Jordan","flag":"🇯🇴","timezone":"Asia/Amman"},
  {"name":"Kazakhstan","flag":"🇰🇿","timezone":"Asia/Almaty"},
  {"name":"Kenya","flag":"🇰🇪","timezone":"Africa/Nairobi"},
  {"name":"Kiribati","flag":"🇰🇮","timezone":"Pacific/Tarawa"},
  {"name":"Kuwait","flag":"🇰🇼","timezone":"Asia/Kuwait"},
  {"name":"Kyrgyzstan","flag":"🇰🇬","timezone":"Asia/Bishkek"},
  {"name":"Laos","flag":"🇱🇦","timezone":"Asia/Vientiane"},
  {"name":"Latvia","flag":"🇱🇻","timezone":"Europe/Riga"},
  {"name":"Lebanon","flag":"🇱🇧","timezone":"Asia/Beirut"},
  {"name":"Lesotho","flag":"🇱🇸","timezone":"Africa/Maseru"},
  {"name":"Liberia","flag":"🇱🇷","timezone":"Africa/Monrovia"},
  {"name":"Libya","flag":"🇱🇾","timezone":"Africa/Tripoli"},
  {"name":"Liechtenstein","flag":"🇱🇮","timezone":"Europe/Vaduz"},
  {"name":"Lithuania","flag":"🇱🇹","timezone":"Europe/Vilnius"},
  {"name":"Luxembourg","flag":"🇱🇺","timezone":"Europe/Luxembourg"},
  {"name":"Madagascar","flag":"🇲🇬","timezone":"Indian/Antananarivo"},
  {"name":"Malawi","flag":"🇲🇼","timezone":"Africa/Blantyre"},
  {"name":"Malaysia","flag":"🇲🇾","timezone":"Asia/Kuala_Lumpur"},
  {"name":"Maldives","flag":"🇲🇻","timezone":"Indian/Maldives"},
  {"name":"Mali","flag":"🇲🇱","timezone":"Africa/Bamako"},
  {"name":"Malta","flag":"🇲🇹","timezone":"Europe/Malta"},
  {"name":"Marshall Islands","flag":"🇲🇭","timezone":"Pacific/Majuro"},
  {"name":"Mauritania","flag":"🇲🇷","timezone":"Africa/Nouakchott"},
  {"name":"Mauritius","flag":"🇲🇺","timezone":"Indian/Mauritius"},
  {"name":"Mexico","flag":"🇲🇽","timezone":"America/Mexico_City"},
  {"name":"Micronesia","flag":"🇫🇲","timezone":"Pacific/Pohnpei"},
  {"name":"Moldova","flag":"🇲🇩","timezone":"Europe/Chisinau"},
  {"name":"Monaco","flag":"🇲🇨","timezone":"Europe/Monaco"},
  {"name":"Mongolia","flag":"🇲🇳","timezone":"Asia/Ulaanbaatar"},
  {"name":"Montenegro","flag":"🇲🇪","timezone":"Europe/Podgorica"},
  {"name":"Morocco","flag":"🇲🇦","timezone":"Africa/Casablanca"},
  {"name":"Mozambique","flag":"🇲🇿","timezone":"Africa/Maputo"},
  {"name":"Myanmar (Burma)","flag":"🇲🇲","timezone":"Asia/Yangon"},
  {"name":"Namibia","flag":"🇳🇦","timezone":"Africa/Windhoek"},
  {"name":"Nauru","flag":"🇳🇷","timezone":"Pacific/Nauru"},
  {"name":"Nepal","flag":"🇳🇵","timezone":"Asia/Kathmandu"},
  {"name":"Netherlands","flag":"🇳🇱","timezone":"Europe/Amsterdam"},
  {"name":"New Zealand","flag":"🇳🇿","timezone":"Pacific/Auckland"},
  {"name":"Nicaragua","flag":"🇳🇮","timezone":"America/Managua"},
  {"name":"Niger","flag":"🇳🇪","timezone":"Africa/Niamey"},
  {"name":"Nigeria","flag":"🇳🇬","timezone":"Africa/Lagos"},
  {"name":"North Korea","flag":"🇰🇵","timezone":"Asia/Pyongyang"},
  {"name":"North Macedonia","flag":"🇲🇰","timezone":"Europe/Skopje"},
  {"name":"Norway","flag":"🇳🇴","timezone":"Europe/Oslo"},
  {"name":"Oman","flag":"🇴🇲","timezone":"Asia/Muscat"},
  {"name":"Pakistan","flag":"🇵🇰","timezone":"Asia/Karachi"},
  {"name":"Palau","flag":"🇵🇼","timezone":"Pacific/Palau"},
  {"name":"Palestine State","flag":"🇵🇸","timezone":"Asia/Gaza"},
  {"name":"Panama","flag":"🇵🇦","timezone":"America/Panama"},
  {"name":"Papua New Guinea","flag":"🇵🇬","timezone":"Pacific/Port_Moresby"},
  {"name":"Paraguay","flag":"🇵🇾","timezone":"America/Asuncion"},
  {"name":"Peru","flag":"🇵🇪","timezone":"America/Lima"},
  {"name":"Philippines","flag":"🇵🇭","timezone":"Asia/Manila"},
  {"name":"Poland","flag":"🇵🇱","timezone":"Europe/Warsaw"},
  {"name":"Portugal","flag":"🇵🇹","timezone":"Europe/Lisbon"},
  {"name":"Qatar","flag":"🇶🇦","timezone":"Asia/Qatar"},
  {"name":"Romania","flag":"🇷🇴","timezone":"Europe/Bucharest"},
  {"name":"Russia","flag":"🇷🇺","timezone":"Europe/Moscow"},
  {"name":"Rwanda","flag":"🇷🇼","timezone":"Africa/Kigali"},
  {"name":"Saint Kitts and Nevis","flag":"🇰🇳","timezone":"America/St_Kitts"},
  {"name":"Saint Lucia","flag":"🇱🇨","timezone":"America/St_Lucia"},
  {"name":"Saint Vincent and the Grenadines","flag":"🇻🇨","timezone":"America/St_Vincent"},
  {"name":"Samoa","flag":"🇼🇸","timezone":"Pacific/Apia"},
  {"name":"San Marino","flag":"🇸🇲","timezone":"Europe/San_Marino"},
  {"name":"Sao Tome and Principe","flag":"🇸🇹","timezone":"Africa/Sao_Tome"},
  {"name":"Saudi Arabia","flag":"🇸🇦","timezone":"Asia/Riyadh"},
  {"name":"Senegal","flag":"🇸🇳","timezone":"Africa/Dakar"},
  {"name":"Serbia","flag":"🇷🇸","timezone":"Europe/Belgrade"},
  {"name":"Seychelles","flag":"🇸🇨","timezone":"Indian/Mahe"},
  {"name":"Sierra Leone","flag":"🇸🇱","timezone":"Africa/Freetown"},
  {"name":"Singapore","flag":"🇸🇬","timezone":"Asia/Singapore"},
  {"name":"Slovakia","flag":"🇸🇰","timezone":"Europe/Bratislava"},
  {"name":"Slovenia","flag":"🇸🇮","timezone":"Europe/Ljubljana"},
  {"name":"Solomon Islands","flag":"🇸🇧","timezone":"Pacific/Guadalcanal"},
  {"name":"Somalia","flag":"🇸🇴","timezone":"Africa/Mogadishu"},
  {"name":"South Africa","flag":"🇿🇦","timezone":"Africa/Johannesburg"},
  {"name":"South Korea","flag":"🇰🇷","timezone":"Asia/Seoul"},
  {"name":"South Sudan","flag":"🇸🇸","timezone":"Africa/Juba"},
  {"name":"Spain","flag":"🇪🇸","timezone":"Europe/Madrid"},
  {"name":"Sri Lanka","flag":"🇱🇰","timezone":"Asia/Colombo"},
  {"name":"Sudan","flag":"🇸🇩","timezone":"Africa/Khartoum"},
  {"name":"Suriname","flag":"🇸🇷","timezone":"America/Paramaribo"},
  {"name":"Sweden","flag":"🇸🇪","timezone":"Europe/Stockholm"},
  {"name":"Switzerland","flag":"🇨🇭","timezone":"Europe/Zurich"},
  {"name":"Syria","flag":"🇸🇾","timezone":"Asia/Damascus"},
  {"name":"Tajikistan","flag":"🇹🇯","timezone":"Asia/Dushanbe"},
  {"name":"Tanzania","flag":"🇹🇿","timezone":"Africa/Dar_es_Salaam"},
  {"name":"Thailand","flag":"🇹🇭","timezone":"Asia/Bangkok"},
  {"name":"Timor-Leste","flag":"🇹🇱","timezone":"Asia/Dili"},
  {"name":"Togo","flag":"🇹🇬","timezone":"Africa/Lome"},
  {"name":"Tonga","flag":"🇹🇴","timezone":"Pacific/Tongatapu"},
  {"name":"Trinidad and Tobago","flag":"🇹🇹","timezone":"America/Port_of_Spain"},
  {"name":"Tunisia","flag":"🇹🇳","timezone":"Africa/Tunis"},
  {"name":"Turkey","flag":"🇹🇷","timezone":"Europe/Istanbul"},
  {"name":"Turkmenistan","flag":"🇹🇲","timezone":"Asia/Ashgabat"},
  {"name":"Tuvalu","flag":"🇹🇻","timezone":"Pacific/Funafuti"},
  {"name":"Uganda","flag":"🇺🇬","timezone":"Africa/Kampala"},
  {"name":"Ukraine","flag":"🇺🇦","timezone":"Europe/Kiev"},
  {"name":"United Arab Emirates","flag":"🇦🇪","timezone":"Asia/Dubai"},
  {"name":"United Kingdom","flag":"🇬🇧","timezone":"Europe/London"},
  {"name":"United States","flag":"🇺🇸","timezone":"America/New_York"},
  {"name":"Uruguay","flag":"🇺🇾","timezone":"America/Montevideo"},
  {"name":"Uzbekistan","flag":"🇺🇿","timezone":"Asia/Tashkent"},
  {"name":"Vanuatu","flag":"🇻🇺","timezone":"Pacific/Efate"},
  {"name":"Vatican City","flag":"🇻🇦","timezone":"Europe/Vatican"},
  {"name":"Venezuela","flag":"🇻🇪","timezone":"America/Caracas"},
  {"name":"Vietnam","flag":"🇻🇳","timezone":"Asia/Ho_Chi_Minh"},
  {"name":"Yemen","flag":"🇾🇪","timezone":"Asia/Aden"},
  {"name":"Zambia","flag":"🇿🇲","timezone":"Africa/Lusaka"},
  {"name":"Zimbabwe","flag":"🇿🇼","timezone":"Africa/Harare"}
    ];

    const country = countries.find(c => c.name.toLowerCase() === countryName);
    if (!country) return api.sendMessage("❌ Country not found!", event.threadID, event.messageID);

    const tz = country.timezone || "UTC";

    const loadingMsg = await api.sendMessage("[⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜] 0%", event.threadID, event.messageID);
    const colors = ["🟥","🟧","🟨","🟩","🟦","🟪","🟫","🟩","🟨","🟦"];
    const percentages = [70, 80, 100];
    let step = 0;

    const interval = setInterval(async () => {
      if (step >= percentages.length) {
        clearInterval(interval);
        const now = moment().tz(tz);
        const currentTime = now.format("h:mm:ss A");
        const currentDate = now.format("MMMM Do YYYY");
        const msg = `
╔═══════════════🌏
║ 🌟 Country: ${country.name}
║ 🏳️ Flag: ${country.flag}
║ 🕒 Current Time: ${currentTime}
║ 📅 Date: ${currentDate}
║ ⏱ Time Zone: (${tz})
╚═══════════════✨
        `;
        return api.editMessage(msg.trim(), loadingMsg.messageID, event.threadID);
      }

      const percent = percentages[step];
      const totalBlocks = 10;
      const filled = Math.round((percent / 100) * totalBlocks);
      let bar = "";
      for (let i = 0; i < totalBlocks; i++) {
        bar += i < filled ? colors[i % colors.length] : "⬜";
      }
      await api.editMessage(`[${bar}] ${percent}%`, loadingMsg.messageID, event.threadID);
      step++;
    }, 250);
  }
};
