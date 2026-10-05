#!/usr/bin/env bash
# Usage: figma/run.sh <script.figma.js>   (prepends _prelude.js, runs through FigCli Yolo on the pilot file)
DIR="$(cd "$(dirname "$0")" && pwd)"
TMP="$DIR/.last_run.js"
cat "$DIR/_prelude.js" "$1" > "$TMP"
cd /d/Tools/figma-cli-main && FIGMA_FILE="Native One File Pilot Design System" timeout 100 node src/index.js eval -f "$(cygpath -w "$TMP")" 2>&1 | tail -${2:-8}
