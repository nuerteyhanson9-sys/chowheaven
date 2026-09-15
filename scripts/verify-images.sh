#!/usr/bin/env bash
# Resolve official thumb URLs for a curated list of Commons files, and check Unsplash IDs.
set -u
API="https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json"

titles=(
  "File:Suya with pepper sauce.jpg"
  "File:Suya preparation for grilling 5.jpg"
  "File:Chicken Grills (Suya) in Northern Nigeria (7).jpg"
  "File:Grilled Catfish.jpg"
  "File:Fried chicken in Northern Nigeria.jpg"
  "File:Pot of Egusi soup.jpg"
  "File:Egusi soup in a plate.jpg"
  "File:Egusi soup with pounded yam and assorted meats.jpg"
  "File:Chicken pepper soup.jpg"
  "File:Cat fish pepper soup with 5Alive drink.jpg"
  "File:Okro soup.jpg"
  "File:Banga Soup.jpg"
  "File:Plates of Egusi Soup with vegetables and wrapped Pounded Yam.jpg"
  "File:Afang soup and pounded yam 03.jpg"
  "File:Jollof rice.jpg"
  "File:Jollof rice with boiled egg and fried chicken.jpg"
  "File:Ghana Jollof Rice with Chicken.jpg"
  "File:Jollof rice with vegetable.jpg"
  "File:Jollof Rice and fried plantain with diced-beef sauce and cucumber.jpg"
  "File:A plate of jollof rice and chicken.jpg"
  "File:Jollof rice and tomato stew.jpg"
  "File:Fried rice with chicken (17234644521).jpg"
  "File:Vegetable Fried Rice.jpg"
  "File:Yangzhou fried rice and drinks 06-09-2019.jpg"
  "File:Dodo fried.jpg"
  "File:Plantain chips.jpg"
  "File:Fresh-mango-smoothie_01.jpg"
  "File:Batido de piña.jpg"
  "File:Banana and strawberry smoothie.jpg"
  "File:Brownie_IMG_001.jpg"
  "File:BROWNIE_SUNDAE.jpg"
  "File:Puff Puff.jpg"
  "File:Chin-chin.jpg"
  "File:Nigerian-puff-puff-recipe cropped.jpg"
)

echo "=== COMMONS ==="
for t in "${titles[@]}"; do
  enc=$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$t")
  curl -s --max-time 20 "$API&titles=$enc" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d);const p=j.query.pages;const k=Object.keys(p)[0];const tp=p[k].imageinfo&&p[k].imageinfo[0]&&p[k].imageinfo[0].thumburl;console.log((tp||'MISS')+'\t'+p[k].title)}catch(e){console.log('ERR\t$t')}})" || echo "ERR\t$t"
done

echo "=== UNSPLASH CHECK ==="
ids=(
  photo-1517248135467-4c7edcad34c4
  photo-1556910103-1c02745aae4d
  photo-1466978913421-dad2ebd01d17
  photo-1414235077428-338989a2e8c0
  photo-1559339352-11d035aa65de
  photo-1552566626-014f6c1568c6
  photo-1592861956120-e524fc739696
  photo-1551218808-94e220e084d2
  photo-1504674900247-0877df9cc836
  photo-1546069901-ba9599a7e63c
  photo-1577219491135-ce391730fb2c
  photo-1581299894007-aaa50297cf16
)
for id in "${ids[@]}"; do
  code=$(curl -sI --max-time 20 -o /dev/null -w "%{http_code}" "https://images.unsplash.com/$id?w=50&q=10")
  echo "$code\t$id"
done