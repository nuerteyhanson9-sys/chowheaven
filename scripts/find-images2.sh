#!/usr/bin/env bash
for term in "grilled chicken nigerian" "catfish grill" "peppered chicken" "fried chicken nigerian" "chin chin" "puff puff" "plantain chips" "nigerian cocktail" "meat skewers" "beef skewers" "roasted chicken nigerian" "small chops"; do
  safe=$(echo "$term" | tr ' ' '_')
  curl -s --max-time 15 "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${safe}&srnamespace=6&srlimit=6&format=json" \
    | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d);const titles=(j.query&&j.query.search||[]).map(s=>s.title);console.log('## '+'$term');titles.forEach(t=>console.log('  '+t))}catch(e){console.log('ERR $term')}})"
done