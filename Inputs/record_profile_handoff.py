import json
from pathlib import Path

p=Path('My Projects/Native_One_File_Pilot')
r=p/'data/component-registry.json'
d=json.loads(r.read_text(encoding='utf-8'))
new=[
 {'name':'Avatar','group':'Data Display','page':'➜ Avatar','tier':'Atom','variants':{},'properties':{'Initials':'TEXT'},'defaults':{'Initials':'AS'},'variant_count':1,'use':'Initials identity fallback next to an account name.','nests':[],'issues':['Avatar size aliases need user approval; see profile audit.']},
 {'name':'Profile Header','group':'Data Display','page':'➜ Profile Header','tier':'Organism','variants':{},'properties':{'Display name':'TEXT','Email':'TEXT'},'defaults':{'Display name':'Abdul Salah','Email':'abdul@example.com'},'variant_count':1,'use':'Account identity with Edit profile action.','nests':['Avatar','Button'],'issues':['Android Button expanded touch area pending token approval.']},
 {'name':'Pattern/Profile Screen','group':'Patterns','page':'➜ Profile','tier':'Pattern','variants':{},'properties':{'Personal section title':'TEXT','Account section title':'TEXT'},'defaults':{'Personal section title':'Personal information','Account section title':'Account'},'variant_count':1,'use':'Native account profile with eight OS/Color/Language previews.','nests':['Top App Bar','Profile Header','List Item','Button'],'issues':['Two profile audit decisions pending; user review pending.']}
]
d['components']=[x for x in d['components'] if x['name'] not in {x['name'] for x in new}]+new
d['meta']['source']['extracted_at']='2026-10-05'
d['meta']['source']['method']='Claude pilot extraction + Codex scoped Profile update from FigCli Yolo'
r.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
s=p/'status.json';d=json.loads(s.read_text(encoding='utf-8'))
d['figma']['design_system'].update({'url':'https://www.figma.com/design/a2EAdCeKeaXN679TMNlIev','file_key':'a2EAdCeKeaXN679TMNlIev','tool':'figcli'})
d['profile']={'status':'Ready for review','page':'➜ Profile','audit':'audits/2026-10-05-profile-audit.md','pending':['Avatar semantic size aliases','Android expanded button touch area','User review','Library publish','Storybook sync']}
s.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
entry='''## 2026-10-05 - Quick task: Profile pattern and reusable identity components (Codex)
- Storybook synced: no
- Tool: Codex (FigCli Yolo)
- Changed: Avatar, Profile Header, Pattern/Profile Screen; new Avatar, Profile Header and Profile pages; eight OS x Color x Language screen previews; eight Profile Header previews on Platform Preview; registry, component docs, screen spec and scoped audit. Existing components and Abdul's Settings sections preserved.
- Figma file: Native One File Pilot Design System (a2EAdCeKeaXN679TMNlIev)
- Library published: no
- Design files updated (Accept updates): none linked
- Design file audit: in-library pattern scope; 8 screens, check_screens 0 issues, 140 visible texts checked with 0 contrast failures, raw paints/spacing/radius 0, missing main components 0. Report: audits/2026-10-05-profile-audit.md.
- Screenshot: audits/2026-10-05-profile-modes-final.png
- Pending: user review; Avatar width/height bind directly to Number/64 (semantic aliases proposed); existing Android Button height is 40px (expanded 48px touch area proposed). No new token added without approval. Library publish and Storybook sync pending.
- Handoff: Inputs/profile-*.figma.js contains scoped creation/finalization/audit scripts; initialize DS and PF helpers before reuse. No external screenshot source; original design from the approved spec.

'''
f=p/'CHANGELOG.md';t=f.read_text(encoding='utf-8');at=t.index('## 2026-10-05 - Pilot build:');f.write_text(t[:at]+entry+t[at:],encoding='utf-8')
f=p/'Project_Brief.md';t=f.read_text(encoding='utf-8');t=t.replace('| Screens | | |','| Screens (Profile quick task) | Ready for review; audit decisions pending | 2026-10-05 |')
t=t.replace('- Phase: Intake','- Phase: Profile quick task - Ready for review').replace('- Next step (the next session starts here, Intake section 0c): ','- Next step (the next session starts here, Intake section 0c): Review Profile on ➜ Profile; resolve two audit decisions, then publish and sync Storybook. ')
t+='\n## Codex Profile handoff (2026-10-05)\n\nApproved plan: audits/2026-10-05-screen-spec-profile.md (Abdul: execute). Result and pending decisions: audits/2026-10-05-profile-audit.md. Pattern and all eight previews are in the DS file, matching the pilot Settings convention. Final screenshot: audits/2026-10-05-profile-modes-final.png. No linked Design files. No new variables or styles. User approval of the built result is still pending.\n'
f.write_text(t,encoding='utf-8')
f=p/'Component_Skills/Data_Display_Skill/SKILL.md';t=f.read_text(encoding='utf-8');t+='\n## Profile additions (Codex, 2026-10-05)\n\nAvatar and Profile Header are implemented and Ready for review. See `references/profile.md` for their actual properties, atomic maps and pending audit decisions. The earlier template sections remain unfilled.\n';f.write_text(t,encoding='utf-8')
