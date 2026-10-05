#!/usr/bin/env bash
# Usage: figma/shot.sh "<page name>" <out name> [scale]  -> shots/<out>.png of the page's first frame
cd /d/Tools/figma-cli-main && export FIGMA_FILE="Native One File Pilot Design System"
ID=$(node src/index.js eval "const p=figma.root.children.find(x=>x.name==='$1'); await p.loadAsync(); return p.children[0].id" | tail -1 | tr -d '"')
node src/index.js verify "$ID" -s ${3:-1} --save "D:/Work/Design systems Ai Ready/My Projects/Native_One_File_Pilot/shots/$2.png" 2>&1 | tail -1
