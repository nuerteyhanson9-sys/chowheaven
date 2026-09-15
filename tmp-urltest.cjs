const urls = {
  suya_wikimedia: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Suya_with_pepper_sauce.jpg/1200px-Suya_with_pepper_sauce.jpg",
  egusi_wikimedia: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Pot_of_Egusi_soup.jpg/960px-Pot_of_Egusi_soup.jpg",
  chef_unsplash: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=70",
  jollof_wikimedia: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/A_plate_of_jollof_rice_and_chicken.jpg/1200px-A_plate_of_jollof_rice_and_chicken.jpg",
  puff_wikimedia: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Puff_Puff.jpg/960px-Puff_Puff.jpg",
  interior_unsplash: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=70",
};
const http = require("http");
const https = require("https");
for (const [name, url] of Object.entries(urls)) {
  const lib = url.startsWith("https") ? https : http;
  const req = lib.get(url, { headers: { "User-Agent": "curl/8" } }, (res) => {
    console.log(name, res.statusCode, res.headers.location || "");
    res.resume();
  });
  req.on("error", (e) => console.log(name, "ERR", e.message));
  req.setTimeout(15000, () => { req.destroy(new Error("timeout")); });
}