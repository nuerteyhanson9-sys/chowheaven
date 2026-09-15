const https = require("https");
function get(url) {
  return new Promise((res, rej) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
      let d = "";
      r.on("data", (c) => (d += c));
      r.on("end", () => res(d));
    }).on("error", rej);
  });
}
(async () => {
  const html = await get("https://chowheaven.vercel.app/our-story");
  const srcs = [...new Set([...html.matchAll(/src="([^"]+)"/g)].map((m) => m[1]))];
  console.log("OUR-STORY images:");
  for (const s of srcs) console.log(" -", s.slice(0, 140));
  const eg = (html.match(/Pot_of_Egusi_soup/g) || []).length;
  const suy = (html.match(/Suya_with_pepper_sauce/g) || []).length;
  const jol = (html.match(/jollof_rice_and_chicken/g) || []).length;
  console.log("egusi:", eg, "suya:", suy, "jollof:", jol);
  const pj = (html.match(/party-jollof/g) || []).length;
  console.log("party-jollof refs:", pj);
})();