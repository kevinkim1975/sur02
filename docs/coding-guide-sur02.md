# 코딩 가이드 — sur02 바이럴 마케팅 컨설팅 사전 설문

## 개요
sur01(모니터링 요원 선발)을 기반으로 sur02(바이럴 마케팅 컨설팅)를 구축한다.
디자인은 "Editorial Atelier" 테마로, sur01의 "Modern Light"와 완전히 다르다.
디자인 원본: `docs/Survey-Standalone.html`, `docs/design-thank-you.html`

## 실행 순서 (Boris Cherny)
1. 프로젝트 설정 (폴더 복사 + 정리)
2. Types (lib/types.ts 수정)
3. Data (config/viral.ts 생성)
4. CSS (globals.css 전면 교체)
5. Components (4개 컴포넌트 전면 재작성)
6. Pages (layout.tsx, page.tsx, thank-you/page.tsx 재작성)
7. 빌드 검증

---

## Step 1: 프로젝트 설정

### 1-1. sur01에서 소스만 복사
sur01의 다음 파일/폴더만 sur02로 복사한다. (.git, .next, node_modules, docs 제외)
- app/, components/, config/, lib/, public/
- .gitignore, .gitattributes, eslint.config.mjs, next-env.d.ts, next.config.ts
- package.json, package-lock.json, postcss.config.mjs, tsconfig.json, README.md

### 1-2. package.json의 "name"을 "sur02"로 변경

### 1-3. 불필요 파일 삭제: config/monitoring.ts, CLAUDE.md, HANDOVER.md, task.md

### 1-4. npm install --include=dev

---

## Step 2: Types (lib/types.ts) — 전체 덮어쓰기

```typescript
// ===== lib/types.ts =====
export type QuestionType = 'radio' | 'text' | 'textarea' | 'radio+textarea' | 'display+radio+text' | 'identity' | 'priceTable' | 'checkbox';
export type SectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface QuestionConfig {
  id: string;
  section: SectionId;
  sectionTitle: string;
  label: string;
  type: QuestionType;
  hint?: string;
  subLabel?: string;
  required: boolean;
  rows?: number;
  options?: string[];
  placeholder?: string;
  tableRows?: number;
  maxSelections?: number;
  procedures?: string[];
  priceLevels?: { id: string; label: string }[];
}

export interface SurveyConfig {
  clinicName: string;
  brandName: string;
  surveyTitle: string;
  formspreeId: string;
  thankYouMessage: string;
  headerDescription: string;
  subjectPrefix?: string;
  footerNotice?: string;
  metaDescription?: string;
  editionLabel?: string;
  mastheadSubtitle?: string;
  estimatedMinutes?: number;
  questions: QuestionConfig[];
}
```

---

## Step 3: Data

### 3-1. config/viral.ts 생성
Survey-Standalone.html의 SECTIONS + PROCEDURES + PRICE_LEVELS 데이터를 SurveyConfig 형식으로 변환한다.

핵심 값:
- clinicName: '' (Q01에서 직접 입력)
- brandName: '호원앤컴퍼니'
- surveyTitle: '바이럴 마케팅 분석 사전 설문'
- formspreeId: 'xeollevk'
- subjectPrefix: '바이럴 마케팅 컨설팅 사전 설문'
- editionLabel: 'No. 026 · Medical Marketing Intake'
- mastheadSubtitle: 'For Dermatology Clinics'
- estimatedMinutes: 8

14문항 구조:
- Section A (기본 정보): Q01 identity (병원명+직급+성명)
- Section B (진료 포트폴리오): Q02 textarea(시술항목), Q03 textarea(타겟고객층)
- Section C (바이럴 현황): Q04 text(블로그), Q05 textarea(SNS), Q06 textarea(발행빈도)
- Section D (바이럴 목표): Q07 textarea(키워드), Q08 textarea(레퍼런스), Q09 textarea(어려움)
- Section E (경쟁&예산): Q10 textarea(경쟁병원), Q11 text(예산), Q12 textarea(대행사)
- Section F (추가 분석): Q13 textarea(광고계정), Q14 priceTable(시술가격)

Q14 priceTable:
- procedures: 10개 (보톡스, 필러, 피코레이저, 스킨부스터, 리프팅, 슈링크/인모드, 레이저제모, 여드름/흉터, 실리프팅, 미백/색소)
- priceLevels: [{id:'high',label:'매우높음'}, {id:'avg',label:'평균수준'}, {id:'low',label:'매우낮음'}, {id:'unk',label:'모름'}]

각 질문의 label, hint, placeholder, required, rows 값은 Survey-Standalone.html의 SECTIONS 배열에서 그대로 가져온다.

### 3-2. config/index.ts 수정
```typescript
import { viralConfig } from './viral';
export const surveyConfig = viralConfig;
```

---

## Step 4: CSS (app/globals.css 전면 교체)

Survey-Standalone.html의 <style> 블록을 그대로 가져온다.
파일 시작: `@import "tailwindcss";`
그 다음: Google Fonts @import (Fraunces + Cormorant Garamond)
그 다음: Survey-Standalone.html의 전체 CSS (:root부터 @keyframes rise까지)

**제외할 것:** TweaksPanel CSS (.twk-로 시작하는 모든 스타일)
**삭제할 것:** SUIT Variable @import (layout.tsx <link>에서 로드하므로 중복)

핵심 CSS 변수:
- --paper: #f1ede3 (배경)
- --card: #faf7ef (카드)
- --ink: #1a2422 (텍스트)
- --accent: #1f3a30 (딥포레스트)
- --gilt: #9a7e4f (브라스)
- --serif: 'Fraunces', 'Cormorant Garamond', serif

---

## Step 5: Components (4개)

### 5-1. components/TopBar.tsx (신규, 'use client')
Survey-Standalone.html의 .topbar 영역 변환.
- 스티키 상단 바 (sticky top-0)
- 좌: "Howon&Company" (config.brandName은 한글이므로 영문 하드코딩 허용)
- 우: config.editionLabel + 오늘 날짜 (YYYY.MM.DD, 동적)
- 하단: 스크롤 프로그레스 바 (1px, --ink 색상)
- 스크롤 이벤트로 progress % 계산

### 5-2. components/Masthead.tsx (SurveyHeader 대체, 서버 컴포넌트)
Survey-Standalone.html의 .masthead 영역 변환.
- .masthead-rule: mastheadSubtitle + 수평선 + "Confidential" (세리프 이탤릭)
- h1: surveyTitle에서 파싱 ("바이럴 마케팅\n분석 사전 설문", "사전 설문"에 .accent)
- .lede: headerDescription (::first-letter 드롭캡은 CSS로 처리)
- .meta-grid: 3칸 (06 섹션 / 14 문항 / N 분 내외) — config.estimatedMinutes
- ::before 워터마크 '01'은 CSS로 처리

### 5-3. components/SurveyForm.tsx (전면 재작성, 'use client')

**데이터 흐름은 sur01과 동일:** formData state → validate → buildPayload → Formspree POST → /thank-you

**구조 변경:**
A) 섹션 렌더링:
   - 로마 숫자 (I~VI): const ROMAN = ['I','II','III','IV','V','VI']
   - .section-head: 숫자 + eyebrow("Section 01") + 타이틀 + 문항수
   - CSS 클래스는 디자인 원본과 동일하게 사용

B) 질문 렌더링:
   - .q-num: serif "№ 01" ~ "№ 14"
   - .q-label: label + 필수 마크(* gilt 세리프)
   - .q-hint: hint (::before 6px gilt 대시는 CSS로)
   - .q-body: 입력 필드 (padding-left: 76px, 모바일 0)

C) identity 타입 (Q01):
   - .identity-card (코너 장식 ::before/::after는 CSS)
   - .identity-grid 2열: 병원명 / 응답자 성명
   - .segmented 역할 선택 (원장/실장, 슬라이딩 pill)
   - formData 키: q01_hospital, q01_role (기본값 '원장'), q01_name

D) text/textarea 입력:
   - .field 래퍼 + .input/.textarea
   - focus 시 .is-focused 클래스 토글 → 하단 accent 라인 (CSS ::after)
   - textarea에 char-count 표시 (포커스 시)

E) priceTable (Q14):
   데스크톱 (>720px): <table class="price-table">
   - thead: Procedures | 매우높음 | 평균수준 | 매우낮음 | 모름 | 비고
   - tbody: procedures 배열 순회, .cell-radio + .cell-note
   - formData 키: q14_level_N (priceLevels의 id값), q14_note_N
   모바일 (<=720px): .price-cards
   - 각 시술별 카드, 2x2 .price-card-option 칩 + 비고

F) 제출 영역 (.submit-area):
   - 오너먼트: — ❦ —
   - eyebrow: "Final Step"
   - 헤드라인: "모든 응답을 검토하신 후\n제출해 주시기 바랍니다."
   - .submit-summary pill: 필수항목 카운터 (N/M), .complete 클래스 토글
   - .btn-submit: disabled={필수 미완료}, 화살표 →

**validate() 변경:**
- identity: q01_hospital + q01_role + q01_name 필수
- priceTable: required=false이므로 검증 불필요
- 나머지: sur01과 동일 (trim 체크)

**buildPayload() 변경:**
- identity → [Q01] 병원명, [Q01] 직급, [Q01] 성명
- priceTable → procedures[i]를 item으로 사용, level+note 조합
- 나머지: sur01과 동일

### 5-4. components/SurveyFooter.tsx (재작성)
Survey-Standalone.html의 .foot 영역 변환.
- .foot-inner 2열 그리드
- 좌: 실드 SVG(16x16) + footerNotice (config)
- 우: "Howon & Company" 세리프 + © 2026 호원앤컴퍼니
- 모바일 640px: 1열

---

## Step 6: Pages

### 6-1. app/layout.tsx
```typescript
import type { Metadata } from 'next';
import { surveyConfig } from '@/config';
import './globals.css';

export const metadata: Metadata = {
  title: surveyConfig.surveyTitle,
  description: surveyConfig.metaDescription || surveyConfig.surveyTitle,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 6-2. app/page.tsx
```typescript
import TopBar from '@/components/TopBar';
import Masthead from '@/components/Masthead';
import SurveyForm from '@/components/SurveyForm';
import SurveyFooter from '@/components/SurveyFooter';

export default function SurveyPage() {
  return (
    <>
      <TopBar />
      <div className="page">
        <Masthead />
        <SurveyForm />
      </div>
      <SurveyFooter />
    </>
  );
}
```

### 6-3. app/thank-you/page.tsx ('use client')
design-thank-you.html을 Next.js로 변환.
- 중앙 정렬 (display:grid, place-items:center, min-height:100vh)
- 브랜드라인: .brandmark "H" + 호원앤컴퍼니
- .checkmark: SVG 체크 + draw 애니메이션 (stroke-dasharray/dashoffset)
- h1: "설문이 성공적으로\n제출되었습니다."
- .msg: config.thankYouMessage
- .countdown: 10초 카운트다운 + SVG 링 (stroke-dashoffset 애니메이션)
- .signature: "Howon & Company · Medical Consulting"
- useEffect로 setInterval 1초마다 카운트 감소, 0 도달 시 window.close()
- CSS: design-thank-you.html의 <style> 블록을 컴포넌트 내부 <style jsx>로 포함하거나 globals.css에 추가

---

## Step 7: 빌드 검증

```bash
npx tsc --noEmit && npm run build
```

---

## 핵심 주의사항

1. **font-weight 최대 500** — 600, 700 사용 금지
2. **Tailwind 최소화** — 디자인 CSS 클래스 직접 사용, Tailwind는 flex/hidden 등 유틸리티에만
3. **모든 텍스트 config에서 읽기** — 하드코딩 금지 (템플릿 경계 위반 방지)
4. **CSS 클래스명 디자인 원본과 동일** — .topbar, .masthead, .section, .q, .identity-card, .price-table 등
5. **Google Fonts** — Fraunces + Cormorant Garamond는 globals.css @import로 로드
6. **반응형 브레이크포인트** — 600px(섹션헤더), 640px(푸터), 720px(priceTable)
7. **priceTable formData 키** — q14_level_N + q14_note_N (item은 config procedures에서 자동)
8. **디자인 원본 참조** — CSS와 JSX 구조는 Survey-Standalone.html에서 직접 가져올 것
