#!/usr/bin/env bash
# Search Wikimedia Commons for real dish photos and print candidate file names.
mkdir -p /tmp/chw
for term in suya "egusi soup" "pepper soup" "pounded yam" "grilled fish" "jollof rice" "banga soup" "okra soup" "fried plantain" "chapman" "zobo drink" "nigerian food" "asun"; do
  safe=$(echo "$term" | tr ' ' '_')
  curl -s --max-time 15 "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${safe}&srnamespace=6&srlimit=6&format=json" \
    | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d);const titles=(j.query&&j.query.search||[]).map(s=>s.title);console.log('## '+'$term');titles.forEach(t=>console.log('  '+t))}catch(e){console.log('ERR $term')}})" 
done