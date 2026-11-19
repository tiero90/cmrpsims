// Build index.html from src/app.html + src/questions/p1..p5.js
// Usage: node tools/build.js            -> writes index.html (standalone site) and dist/artifact.html
const fs=require("fs"),path=require("path");const root=path.join(__dirname,"..");
const data="var QB={};\n"+[1,2,3,4,5].map(i=>fs.readFileSync(path.join(root,"src/questions/p"+i+".js"),"utf8")).join("\n");
const page=fs.readFileSync(path.join(root,"src/app.html"),"utf8").replace("/*QB*/",()=>data);
fs.mkdirSync(path.join(root,"dist"),{recursive:true});fs.writeFileSync(path.join(root,"dist/artifact.html"),page);
const i=page.indexOf("</style>")+8;
const reset=`<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>\n`;
fs.writeFileSync(path.join(root,"index.html"),`<!doctype html>\n<html lang="id">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="description" content="Simulator latihan ujian CMRP: 600 soal pilihan ganda dari lima pilar SMRP, mode ujian 110 soal / 150 menit, latihan per pilar dan pencarian topik.">\n`+reset+page.slice(0,i)+`\n</head>\n<body>\n`+page.slice(i)+`\n</body>\n</html>\n`);
console.log("built index.html",fs.statSync(path.join(root,"index.html")).size,"bytes");
