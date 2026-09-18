# web-menu — 가게 모바일 메뉴판 (Claude Code 스킬)

식당·카페·바의 **QR 메뉴판 겸 가게 소개**를 HTML 파일 하나로 만든다.

- 메뉴 데이터 배열 하나 → 분류 탭·검색·태그 필터·품절 표시·상세 시트
- 가게마다 다른 "주문 도구": 인원 계산, 보울 조립, 코스 레일, 세트 자동할인, 굽는 시간표, 버거 분해도 …
- 실제 제작본 7종(진 바·오마카세·포케·분식·한우·베이커리·버거) 설계표와 후보 8종
- 사장님이 직접 품절·가격을 고치는 DB 버전으로 넓히는 방법
- 예시 사이트(을지로 진 바, 사진 포함)와 playwright 검증 스크립트

## 설치 (한 줄)
```bash
curl -fsSL https://raw.githubusercontent.com/manabout-town/web-menu-skill/main/install.sh | bash
```
`~/.claude/skills/web-menu` 에 설치된다. Claude Code를 새로 열고 "마라탕집 메뉴판 만들어줘"처럼 말하면 된다.
설치 위치를 바꾸려면 `CLAUDE_SKILLS_DIR=... curl ... | bash`.

<details><summary>레포를 통째로 받고 싶다면</summary>

```bash
git clone https://github.com/manabout-town/web-menu-skill.git
cd web-menu-skill && ./install.sh
```
</details>

## 구성
```
skill/web-menu/
├── SKILL.md                 네 가지 결정 → 데이터 → 화면 → 관리형 → 디자인 기준 → 검증 → 배포
├── assets/example/          Still No.7 (index.html + img/)
├── references/
│   ├── catalog.md           제작 7종 + 후보
│   ├── production.md        사진 · 레포 · 배포
│   └── pitfalls.md          실제로 밟은 함정 12개
└── scripts/verify.mjs       폭별 진입·가로넘침·상세 시트 열고 닫기 검사
```
자매 스킬: 사람 소개 `web-card`, 쇼핑몰 `web-market`.

예시의 가게·주소·사진(AI 생성)은 전부 가상이다. MIT.
