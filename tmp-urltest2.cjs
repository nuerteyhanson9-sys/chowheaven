const https = require("https");
const urls = {
  suya: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Suya_with_pepper_sauce.jpg/1200px-Suya_with_pepper_sauce.jpg",
  jollof: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/A_plate_of_jollof_rice_and_chicken.jpg/1200px-A_plate_of_jollof_rice_and_chicken.jpg",
  egusi: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Pot_of_Egusi_soup.jpg/960px-Pot_of_Egusi_soup.jpg",
  puff: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Puff_Puff.jpg/960px-Puff_Puff.jpg",
};
function head(url) {
  return new Promise((res) => {
    const req = https.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36", "Accept-Encoding": "identity" },
    }, (r) => { res(r.statusCode + " " + (r.headers["content-type"] || "")); r.resume(); });
    req.on("error", (e) => res("ERR " + e.message));
    req.setTimeout(20000, () => { req.destroy(new Error("timeout")); });
  });
}
(async () => {
  for (const [k, u] of Object.entries(urls)) {
    const c = await head(u);
    console.log(k.padEnd(6), c);
  }
})();