// Read-only contrast and instance checks for the eight Profile previews.
await PF.page('➜ Profile');
const board=figma.currentPage.findOne(n=>n.name==='Profile mode matrix');
const screens=board.findAll(n=>n.type==='INSTANCE'&&n.name.startsWith('Profile / '));
const lum=c=>{const v=[c.r,c.g,c.b].map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*v[0]+.7152*v[1]+.0722*v[2];};
const color=async(p,n)=>p.boundVariables?.color?(await figma.variables.getVariableByIdAsync(p.boundVariables.color.id)).resolveForConsumer(n).value:p.color;
const paint=n=>Array.isArray(n.fills)?n.fills.find(p=>p.type==='SOLID'&&p.visible!==false&&(p.opacity??1)>.99):null;
const visible=n=>{for(let p=n;p&&p.type!=='PAGE';p=p.parent)if(p.visible===false)return false;return true;};
const failures=[];let missingMain=0,rawOverrides=0,texts=0;
for(const screen of screens){
for(const i of screen.findAllWithCriteria({types:['INSTANCE']}))if(!(await i.getMainComponentAsync()))missingMain++;
for(const t of screen.findAllWithCriteria({types:['TEXT']})){
if(!visible(t)||!t.characters.trim())continue;const fgPaint=paint(t);if(!fgPaint)continue;
let bg=t.parent,bgPaint=null;while(bg&&!bgPaint){bgPaint=paint(bg);if(!bgPaint)bg=bg.parent;}if(!bgPaint)continue;
const fg=await color(fgPaint,t),back=await color(bgPaint,bg);const a=lum(fg),b=lum(back);const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
texts++;const threshold=t.fontSize>=24?3:4.5;if(ratio<threshold)failures.push({screen:screen.name,node:t.name,text:t.characters,ratio:Math.round(ratio*100)/100,threshold});
}
for(const n of screen.findAll(n=>'fills'in n))for(const p of n.fills)if(p.type==='SOLID'&&p.visible!==false&&!p.boundVariables?.color)rawOverrides++;
}
return {textsChecked:texts,contrastFailures:failures,missingMain,rawOverrides};
