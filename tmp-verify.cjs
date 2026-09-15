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
  for (const path of ["/our-story", "/experience"]) {
    const html = await get("https://chowheaven.vercel.app" + path);
    const mk = (re) => (html.match(re) || []).length;
    console.log("== " + path + " ==");
    console.log(" chef-in-kitchen:", mk(/chef-in-kitchen/g));
    console.log(" suya-platter:", mk(/suya-platter/g));
    console.log(" party-jollof:", mk(/party-jollof/g));
    console.log(" wikimedia suya:", mk(/Suya_with_pepper_sauce/g));
    console.log(" wikimedia jollof:", mk(/jollof_rice_and_chicken/g));
    console.log(" chef unsplash (1556910103):", mk(/1556910103/g));
  }
})();