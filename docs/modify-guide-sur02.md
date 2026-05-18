# 수정 가이드 — sur02 동물의료기관 마케팅 분석 사전 설문

## 개요
sur02를 피부과 바이럴 마케팅 → 동물의료기관 마케팅으로 변경한다.
수정 대상: config/viral.ts 1개 파일만 수정.
컴포넌트/CSS/Pages는 config 기반이므로 변경 불필요.

## 수정 내용

### 1. 상단 메타 정보 변경
- surveyTitle: '바이럴 마케팅\n분석 사전 설문' → '동물의료기관 마케팅\n분석 사전 설문'
- subjectPrefix: '바이럴 마케팅 컨설팅 사전 설문' → '동물의료기관 마케팅 분석 사전 설문'
- footerNotice: '바이럴 마케팅 컨설팅 목적' → '동물의료기관 마케팅 컨설팅 목적'
- metaDescription: '호원앤컴퍼니 바이럴 마케팅 컨설팅 사전 설문' → '호원앤컴퍼니 동물의료기관 마케팅 분석 사전 설문'
- mastheadSubtitle: 'For Dermatology Clinics' → 'For Veterinary Clinics'

### 2. PROCEDURES 배열 교체 (피부과 → 동물병원)
```typescript
const PROCEDURES = [
  '예방접종/건강검진',
  '중성화 수술',
  '슬개골 탈구 수술',
  '치과(스케일링/발치)',
  '피부과(아토피/외이염)',
  '내과(혈액/영상검사)',
  '안과',
  '정형외과',
  '응급/입원',
  '미용(목욕/미용)',
];
```

### 3. questions 배열 교체 (14문항 → 16문항)
기존 questions 배열을 아래로 전체 교체한다.

```typescript
questions: [
  // Section A — 기본 정보
  {
    id: 'q01',
    section: 'A',
    sectionTitle: '기본 정보',
    label: '귀 의료기관의 정보를 확인합니다.',
    type: 'identity',
    required: true,
  },
  // Section B — 진료 포트폴리오
  {
    id: 'q02',
    section: 'B',
    sectionTitle: '진료 포트폴리오',
    label: '귀 의료기관의 주력 시술 및 진료 항목을 알려주세요.',
    type: 'textarea',
    hint: '예: 예방접종, 중성화 수술, 슬개골 탈구, 치과, 피부과, 내과 등',
    required: true,
    rows: 6,
  },
  {
    id: 'q03',
    section: 'B',
    sectionTitle: '진료 포트폴리오',
    label: '주요 타겟 고객층은 어떻게 되시나요?',
    type: 'textarea',
    hint: '반려견/반려묘 비율, 보호자 연령대, 지역, 주요 내원 경로 등',
    required: true,
    rows: 4,
  },
  // Section C — 바이럴 현황
  {
    id: 'q04',
    section: 'C',
    sectionTitle: '바이럴 현황',
    label: '보유하고 계신 네이버 블로그 계정명이 어떻게 되시나요?',
    type: 'text',
    hint: '블로그 URL 또는 계정명을 적어주세요. 없으시면 \'없음\'이라고 적어주세요.',
    placeholder: '예: blog.naver.com/hospital-name',
    required: true,
  },
  {
    id: 'q05',
    section: 'C',
    sectionTitle: '바이럴 현황',
    label: '현재 운영 중인 SNS 계정이나 바이럴 채널의 URL을 알려주세요.',
    type: 'textarea',
    hint: '인스타그램, 유튜브, 네이버 블로그, 카카오 채널 등\n의료기관 계정인지 대행사 계정인지 분류해주시고, 월간 포스팅 건수도 알려주세요.',
    required: true,
    rows: 6,
  },
  {
    id: 'q06',
    section: 'C',
    sectionTitle: '바이럴 현황',
    label: '월간 콘텐츠 발행 빈도와 관리 주체를 알려주세요.',
    type: 'textarea',
    hint: '직접 관리 / 대행사 위탁 / 혼합, 월 몇 건 발행 등',
    required: false,
    rows: 4,
  },
  // Section D — 마케팅 목표
  {
    id: 'q07',
    section: 'D',
    sectionTitle: '마케팅 목표',
    label: '이번 마케팅의 목적이 어떻게 되시는가요?',
    type: 'textarea',
    hint: '예: 신규 고객 유입, 블로그 상위노출, 브랜드 인지도, 특정 진료 홍보 등',
    required: true,
    rows: 6,
  },
  {
    id: 'q08',
    section: 'D',
    sectionTitle: '마케팅 목표',
    label: '귀 의료기관에서 경쟁 대상처로 여기는 곳을 알려주세요.',
    type: 'textarea',
    hint: '병원명, 지역, 경쟁 포인트 등 구체적으로 적어주세요.',
    required: false,
    rows: 4,
  },
  {
    id: 'q09',
    section: 'D',
    sectionTitle: '마케팅 목표',
    label: '현재 광고 대행사가 있다면 마케팅에서 가장 어렵거나 불만족스러운 점은 무엇인가요?',
    type: 'textarea',
    hint: '대행사가 없다면 원하는 것을 적어주시면 됩니다.',
    required: true,
    rows: 6,
  },
  // Section E — 경쟁 & 예산
  {
    id: 'q10',
    section: 'E',
    sectionTitle: '경쟁 & 예산',
    label: '월간 마케팅 예산은 어떻게 되시나요?',
    type: 'text',
    hint: '바이럴, 광고, 대행사 비용 등 전체 마케팅 예산',
    placeholder: '예: 월 300만원',
    required: true,
  },
  {
    id: 'q11',
    section: 'E',
    sectionTitle: '경쟁 & 예산',
    label: '현재 마케팅 대행사를 이용하고 계신가요? 이용 중이라면 만족도는 어떠신가요?',
    type: 'textarea',
    required: false,
    rows: 4,
  },
  {
    id: 'q12',
    section: 'E',
    sectionTitle: '경쟁 & 예산',
    label: '현재 운영 중인 광고 계정(네이버, 메타 등)의 수치나 설정을 직접 살펴볼 수 있다면 더욱 정밀한 분석과 전략 제안이 가능합니다. 혹시 조회 권한 부여가 가능한지 확인해 주세요.',
    type: 'textarea',
    hint: '어려우시다면 \'불가\'라고 적어주세요.',
    required: false,
    rows: 3,
  },
  {
    id: 'q13',
    section: 'E',
    sectionTitle: '경쟁 & 예산',
    label: '귀 의료기관의 시술 가격은 경쟁 의료기관 대비 어떤 수준인가요?',
    type: 'priceTable',
    hint: '특정 시술에서 가격 차이가 큰 항목이 있다면 적어주세요.',
    required: false,
    procedures: PROCEDURES,
    priceLevels: PRICE_LEVELS,
  },
  // Section F — 브랜드 & 차별화
  {
    id: 'q14',
    section: 'F',
    sectionTitle: '브랜드 & 차별화',
    label: '경쟁 병원과 차별화하려고 하는 요소는 무엇인가요?',
    type: 'textarea',
    hint: '예: 24시간 응급, 특화 진료, 시설, 가격, 서비스 등',
    required: true,
    rows: 6,
  },
  {
    id: 'q15',
    section: 'F',
    sectionTitle: '브랜드 & 차별화',
    label: '지역 내 잠재 고객층의 특성에 대해서 알고 있는 부분을 설명하여 주십시오.',
    type: 'textarea',
    hint: '예: 주거 밀집 지역, 반려동물 등록 수, 경쟁 병원 밀도 등',
    required: true,
    rows: 6,
  },
  {
    id: 'q16',
    section: 'F',
    sectionTitle: '브랜드 & 차별화',
    label: '병원의 브랜드 컨셉과 지향점에 대해서 설명해 주십시오.',
    type: 'textarea',
    hint: '예: 전문성 강조, 친근한 이미지, 프리미엄 포지셔닝 등',
    required: true,
    rows: 6,
  },
],
```

### 4. 빌드 검증
```bash
npx tsc --noEmit && npm run build
```

## 주의사항
- config/viral.ts만 수정한다. 다른 파일 수정 금지.
- headerDescription은 변경하지 않는다 ("분석에 앞서 귀 의료기관의..." 그대로 유지).
- estimatedMinutes: 10으로 변경 (문항 수 증가 반영).
- editionLabel은 그대로 유지.
- formspreeId 변경 없음 (xeollevk 유지).
