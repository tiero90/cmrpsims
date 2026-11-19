global.QB={};const fs=require("fs");for(const i of [1,2,3,4,5])eval(fs.readFileSync((process.argv[2]||require("path").join(__dirname,"../src/questions/"))+"p"+i+".js","utf8"));
let tot=0,longest=0,outlier=0;const out=[];
for(const k in QB){let l=0,o=0;QB[k].forEach((q,i)=>{const L=q.slice(1,5).map(s=>s.length);const c=L[0],others=L.slice(1);const mx=Math.max(...others);
 if(c>mx)l++; if(c>1.5*mx&&c-mx>15)o++;});console.log("P"+k,QB[k].length,"correct longest:",l+"%","  outlier (>1.5x):",o);tot+=QB[k].length;longest+=l;outlier+=o}
console.log("ALL correct-longest",(longest/tot*100).toFixed(1)+"% (chance≈25%), outliers",outlier);
