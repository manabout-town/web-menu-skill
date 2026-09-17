#!/usr/bin/env bash
# web-menu 스킬 설치 → ~/.claude/skills/web-menu
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p ~/.claude/skills
rm -rf ~/.claude/skills/web-menu
cp -R skill/web-menu ~/.claude/skills/
echo "✓ 설치 끝: ~/.claude/skills/web-menu"
