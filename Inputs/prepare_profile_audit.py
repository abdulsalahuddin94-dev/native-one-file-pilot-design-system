from pathlib import Path

p = Path('My Projects/Native_One_File_Pilot/Inputs')
s = Path('tools/check_screens.figma.js').read_text(encoding='utf-8')
s = s[:s.index('let screens = []')]
s += """
await PF.page('➜ Profile');
const board=figma.currentPage.findOne(n=>n.name==='Profile mode matrix');
const screens=board.findAll(n=>n.type==='INSTANCE'&&n.name.startsWith('Profile / '));
const results=[]; for(const n of screens)results.push(await checkScreen(n));
return {screens:results.length,totalIssues:results.reduce((a,r)=>a+r.issues,0),results};
"""
(p/'profile-check-screens.figma.js').write_text(s,encoding='utf-8')
s=Path('tools/check_bindings.figma.js').read_text(encoding='utf-8')
s=s[:s.index('await figma.loadAllPagesAsync();')]
s += """
await DS.ready(); const components=[];
for(const name of ['Avatar','Profile Header','Pattern/Profile Screen']){
const c=await DS.comp(name);const props=c.componentPropertyDefinitions; const used=new Set();
walk(c,n=>{for(const v of Object.values(n.componentPropertyReferences||{}))used.add(v)});
components.push({name,id:c.id,unbound:unboundIn(c),unwired:Object.keys(props).filter(k=>props[k].type!=='VARIANT'&&!used.has(k)),exposed:c.findAll(n=>n.type==='INSTANCE'&&n.isExposedInstance).length});
} return {components};
"""
(p/'profile-audit.figma.js').write_text(s,encoding='utf-8')
