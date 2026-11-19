// usage: node tools/mpatch.js patch.json   (patch = [[pillar, qNo, slot(1..4 options; 5 explanation), "text"], ...])
const fs=require("fs"),path=require("path");const Q=path.join(__dirname,"../src/questions/");global.QB={};for(const i of [1,2,3,4,5])eval(fs.readFileSync(Q+"p"+i+".js","utf8"));
const P=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));for(const [p,n,slot,t] of P){const q=QB[p][n-1];if(!q)throw "no "+p+"-"+n;q[slot]=t;}
for(const i of [1,2,3,4,5])fs.writeFileSync(Q+"p"+i+".js","QB["+i+"]=[\n"+QB[i].map(q=>JSON.stringify(q)).join(",\n")+"\n];\n");console.log("patched",P.length);
