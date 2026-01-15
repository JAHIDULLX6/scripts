const axios = require("axios");
const { URL } = require("url");

module.exports.config = {
    name: "siteinfo",
    aliases: [],
    version: "1.0.0",
    role: 0,
    author: "SaGor",
    shortDescription: { en: "VirusTotal siteinfo with Good/Bad" },
    longDescription: { en: "Fetch VirusTotal report for a given URL and show domain info." },
    category: "info",
    guide: { en: "{pn} <url>" },
    cooldown: 5
};

module.exports.onStart = async function ({ api, event, args }) {
    const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
    if (!args[0]) return send("Usage: siteinfo <url>");

    const API_KEY = "b85fa407cbe407e87c0f5fc8482599de15dc55e14333bba35324eb9f7578f042";
    if (!API_KEY) return send("VT API key missing.");

    let target = args.join(" ").trim();
    try {
        if (!/^https?:\/\//i.test(target)) target = "http://" + target;
        new URL(target);
    } catch {
        return send("Invalid URL.");
    }

    const headers = { "x-apikey": API_KEY };

    try {
        const submitResp = await axios.post(
            "https://www.virustotal.com/api/v3/urls",
            `url=${encodeURIComponent(target)}`,
            { headers: { ...headers, "Content-Type": "application/x-www-form-urlencoded" }, timeout: 20000 }
        );

        const analysisId = submitResp?.data?.data?.id;
        if (!analysisId) return send("Failed to submit URL.");
        await send("Fetching report...");

        const pollAnalysis = async (id, maxSeconds = 40) => {
            const start = Date.now();
            while ((Date.now() - start) / 1000 < maxSeconds) {
                const r = await axios.get(`https://www.virustotal.com/api/v3/analyses/${id}`, { headers, timeout: 20000 });
                const st = r?.data?.data?.attributes?.status;
                if (st && st !== "queued" && st !== "in_progress") return r.data;
                await new Promise(res => setTimeout(res, 2000));
            }
            return null;
        };

        const analysisData = await pollAnalysis(analysisId, 45);
        let msg = `🖥️ ── VirusTotal Report ──\n\n🌐 URL: ${target}\n\n`;

        if (analysisData) {
            const stats = analysisData.data?.attributes?.stats || analysisData.data?.attributes?.last_analysis_stats || {};
            msg += `🟢 Good: ${stats.harmless || 0}\n`;
            msg += `🔴 Bad: ${stats.malicious || 0}\n`;
            msg += `⚠️ Suspicious: ${stats.suspicious || 0}\n`;
            msg += `❓ Undetected: ${stats.undetected || 0}\n\n`;
        } else {
            msg += `⚠️ Analysis still processing or timed out.\n\n`;
        }

        const domain = new URL(target).hostname.replace(/^www\./i, "");
        const domainResp = await axios.get(`https://www.virustotal.com/api/v3/domains/${domain}`, { headers, timeout: 20000 });
        const d = domainResp.data?.data?.attributes || {};

        msg += `🏷️ Domain Info:\n`;
        msg += `• Name: ${domain}\n`;
        if (d.reputation !== undefined) msg += `• Reputation: ${d.reputation}\n`;
        if (d.categories && Object.keys(d.categories).length) {
            const cats = Object.entries(d.categories).map(([k, v]) => `${v}`).join(", ");
            msg += `• Categories: ${cats}\n`;
        }
        if (d.last_analysis_stats) {
            const s = d.last_analysis_stats;
            msg += `• Last scan: 🟢${s.harmless||0} 🔴${s.malicious||0} ⚠️${s.suspicious||0}\n`;
        }
        if (d.last_https_certificate) {
            const cert = d.last_https_certificate;
            const issuer = cert?.issuer?.name || cert?.issuer_name || "n/a";
            msg += `• Cert issuer: ${issuer}\n`;
        }

        return send(msg);

    } catch (err) {
        const em = err?.response?.data?.error || err?.response?.data || err?.message || String(err);
        return send("❌ Error fetching site info: " + (typeof em === "string" ? em.slice(0,500) : JSON.stringify(em).slice(0,500)));
    }
};
