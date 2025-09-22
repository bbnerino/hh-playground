# LLM Playground

OpenAI Playground를 따라 만들어보며 LLM과 AI 기술을 학습하는 프로젝트입니다.

## 프로젝트 소개

이 프로젝트는 OpenAI Playground의 핵심 기능들을 직접 구현해보며 다음과 같은 AI/LLM 개념들을 학습하기 위해 만든 개인 학습용 프로젝트입니다:

## 프로젝트 이미지

메인화면
<img width="1492" height="844" alt="image" src="https://github.com/user-attachments/assets/7e4d198e-9b64-45f9-b86d-d554b066fb5d" />

벡터 스토어 업로드 / 선택 
<img width="593" height="472" alt="image" src="https://github.com/user-attachments/assets/4b713542-f2d7-4838-9aeb-248e194fbb92" />

리뷰 데이터 리스트
<img width="1394" height="824" alt="image" src="https://github.com/user-attachments/assets/d126d94a-8034-431c-aa49-4a658afdf0f0" />

리뷰 데이터 기반 질문 질문 - ReAct 기반 답변 
<img width="749" height="753" alt="image" src="https://github.com/user-attachments/assets/26f60ef0-b49c-4d10-afdc-16b595044006" />


### 학습 목표

1. **LLM의 흐름** - 대화형 AI의 요청/응답 처리 과정 이해
2. **ReAct 기법** - Reasoning과 Acting을 결합한 AI 사고 과정 구현
3. **Tool 사용법** - AI가 외부 도구를 호출하고 결과를 활용하는 방법
4. **RAG (Retrieval-Augmented Generation)** - 검색 기반 정보 증강 생성 이해
5. **벡터 스토어** - 임베딩과 유사도 검색의 원리와 활용

## 기술 스택

- **Frontend**: Next.js 15.3.2, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI/LLM**: OpenAI GPT API
- **벡터 데이터베이스**: Qdrant Cloud
- **일반 데이터베이스**: SQLite3

## 주요 기능

### 1. 대화형 AI 인터페이스 (`/prompts`)

- 다양한 OpenAI 모델 선택 및 테스트
- 시스템 프롬프트 설정
- ReAct 모드 토글 (체계적 사고 과정 시연)
- 실시간 채팅 인터페이스

### 2. Tool 시스템

- **날씨 조회** (`getWeather`): 외부 API 연동 예시
- **리뷰 검색** (`getReviews`): 데이터베이스 쿼리 도구
- **문서 검색** (`searchDocuments`): RAG 기반 벡터 검색

### 3. RAG 시스템

- 리뷰 데이터 임베딩 생성 및 벡터 스토어 저장
- 유사도 기반 문서 검색
- 컨텍스트 기반 답변 생성

### 4. 데이터 관리 (`/vectorStore`)

- Excel 파일을 SQLite DB로 자동 변환
- 상품별 리뷰 데이터 조회 및 필터링
- 벡터 스토어 컬렉션 생성 및 관리

## 시작하기

### 환경 변수 설정

`.env` 파일을 생성하고 다음 키들을 설정하세요:

```env
OPENAI_API_KEY=your_openai_api_key
QDRANT_API_KEY=your_qdrant_api_key
WEATHER_API_KEY=your_weather_api_key
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 데이터베이스 생성 (Excel 파일이 있는 경우)
npm run db:create
```

[http://localhost:3000](http://localhost:3000)을 열어 확인

## 학습 포인트

### ReAct 구현 (`src/utils/prompts/reactPrompt.ts`)

```
Thought → Action → Observation → Answer
```

체계적인 사고 과정을 통해 AI가 단계별로 문제를 해결하는 방법을 학습할 수 있습니다.

### Tool 시스템 (`src/utils/tools/`)

AI가 외부 함수를 호출하고 결과를 받아 활용하는 전체 흐름을 이해할 수 있습니다.

### 벡터 검색 (`src/app/api/vectorStore/`)

텍스트 임베딩과 유사도 계산을 통한 의미적 검색의 원리를 실습할 수 있습니다.

## 사용법

1. **Playground 체험**: `/prompts`에서 다양한 모델과 설정으로 AI와 대화
2. **Tool 활용**: 날씨, 리뷰 검색 등의 도구를 선택하여 AI의 도구 사용 관찰
3. **RAG 체험**: `/vectorStore`에서 데이터를 벡터화하고 검색 기능 테스트
4. **ReAct 모드**: 체계적 사고 과정을 통한 AI의 문제 해결 방식 학습

## 코드 탐색 가이드

- **LLM 플로우**: `src/app/api/gpt/route.ts`에서 OpenAI API 연동 확인
- **Tool 구현**: `src/utils/tools/index.ts`에서 도구 등록 및 실행 로직 확인
- **ReAct 로직**: `src/utils/prompts/reactPrompt.ts`에서 프롬프트 엔지니어링 확인
- **벡터 검색**: `src/app/api/vectorStore/`에서 Qdrant 연동 및 검색 로직 확인

이 프로젝트를 통해 AI/LLM의 핵심 개념들을 실제 코드로 구현해보며 개인적으로 깊이 있는 이해를 얻을 수 있습니다.
