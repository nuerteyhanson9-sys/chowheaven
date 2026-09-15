#!/usr/bin/env bash
# Validate remaining Commons files in batched requests; print upload.wikimedia thumb URLs.
set -u
API="https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|size&iiurlwidth=960&format=json"

batch1=(
  "File:Okro soup.jpg"
  "File:Banga Soup.jpg"
  "File:Plates of Egusi Soup with vegetables and wrapped Pounded Yam.jpg"
  "File:Afang soup and pounded yam 03.jpg"
  "File:Jollof rice.jpg"
  "File:Jollof rice with boiled egg and fried chicken.jpg"
  "File:Ghana Jollof Rice with Chicken.jpg"
  "File:Jollof rice with vegetable.jpg"
)
batch2=(
  "File:Jollof Rice and fried plantain with diced-beef sauce and cucumber.jpg"
  "File:A plate of jollof rice and chicken.jpg"
  "File:Jollof rice and tomato stew.jpg"
  "File:Fried rice with chicken (17234644521).jpg"
  "File:Vegetable Fried Rice.jpg"
  "File:Yangzhou fried rice and drinks 06-09-2019.jpg"
  "File:Dodo fried.jpg"
  "File:Plantain chips.jpg"
)
batch3=(
  "File:Fresh-mango-smoothie_01.jpg"
  "File:Batido de piña.jpg"
  "File:Banana and strawberry smoothie.jpg"
  "File:Brownie_IMG_001.jpg"
  "File:BROWNIE_SUNDAE.jpg"
  "File:Puff Puff.jpg"
  "File:Chin-chin.jpg"
  "File:Nigerian-puff-puff-recipe cropped.jpg"
)

check() {
  local joined=""
  for t in "$@"; do
    joined+="$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$t")|"
  done
  joined=${joined%|}
  curl -s --max-time 30 "$API&titles=$joined" | node -e "
    let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
      const j=JSON.parse(d);
      for (const k of Object.keys(j.query.pages)) {
        const p=j.query.pages[k];
        const info=(p.imageinfo&&p.imageinfo[0])||null;
        if (!info) { console.log('MISS\t'+(p.title||k)); continue; }
        const w=info.width>=1200?1200:(info.width>800?960:(info.width>520?800:480));
        const turl=info.thumburl||'';
        const match=turl.match(/\/commons\/thumb\/([^/]+)\/([^/]+)\/([^/]+)$/);
        if (match) {
          const [,h1,h2,f]=match;
          const name=f.replace(/\?.*/,'');
          console.log('OK\t'+h1+'/'+h2+'/'+name+'/'+w+'px-'+name);
        } else { console.log('RAW\t'+turl.replace(/\?.*/,'')); }
      }
    });
  "
}

echo "=== BATCH 1 ==="
check "${batch1[@]}"
sleep 2
echo "=== BATCH 2 ==="
check "${batch2[@]}"
sleep 2
echo "=== BATCH 3 ==="
check "${batch3[@]}"