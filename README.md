## 프로젝트 이미지

<img width="2560" height="1664" alt="image" src="https://github.com/user-attachments/assets/b4de93c9-25d2-439d-933e-4fe7a4591633" />

## 프로젝트 소개

이 프로젝트는 OpenAI Playground의 핵심 기능들을 직접 구현해보며 다음과 같은 AI/LLM 개념들을 학습하기 위해 만든 개인 학습용 프로젝트입니다:
리뷰 데이터 분석 기능이 포함되어 있습니다. 

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
- Qdrant 벡터 데이터베이스에 저장
- 유사도 기반 문서 검색
- 컨텍스트 기반 답변 생성

### 4. 리뷰 데이터 관리 
- 스크립트 실행시 Excel 파일을 SQLite DB로 자동 변환 
- getReviews 툴 사용시, 상품번호 AI가 특정 상품의 리뷰를 검색할 때 사용 
- RAG 시스템으로 활용
- 특정 상품의 리뷰들을 선택하여 벡터화


```js
getReviewsFunctionData = {
  type: "function",
  function: {
    name: "getReviews",
    description: "Get reviews in my location",
    parameters: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "The product id of the reviews"
        }
      },
      required: ["productId"]
    }
  }
};

```

```js
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10000", 10);
  const offset = (page - 1) * limit;

  try {
    const db = new sqlite3.Database("src/app/db/mydb.sqlite");
    let sql = "SELECT * FROM review_data";
    const params: string[] = [];

    if (productId) {
      sql += " WHERE 상품번호 = ?";
      params.push(productId);
    }

    // 전체 개수 쿼리
    const total = await new Promise<number>((resolve, reject) => {
      let countSql = "SELECT COUNT(*) as count FROM review_data";
      const countParams: string[] = [];
      if (productId) {
        countSql += " WHERE 상품번호 = ?";
        countParams.push(productId);
      }
      db.get(countSql, countParams, (err, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    // LIMIT/OFFSET 추가
    sql += " LIMIT ? OFFSET ?";
    params.push(limit.toString(), offset.toString());

    // 데이터 쿼리
    const rows = await new Promise<any[]>((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        db.close();
        if (err) reject(err);
        else resolve(rows);
      });
    });

    return NextResponse.json({ total, page, limit, rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "REVIEW API error" }, { status: 500 });
  }
}
```


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
프롬프트 
```
당신은 체계적으로 사고하고 행동하는 AI입니다. 사용자 질문에 대해 다음 절차를 따르세요:

1. 질문을 분석하고 무엇을 해야 하는지 "생각(Thought)"합니다.

2. 질문에 답변하기 위해 외부 도구가 **필요한 경우에만**, "Action"으로 도구 사용 여부를 사용자에게 먼저 물어봅니다.

   - 도구 호출이 필요하다면, 사용자의 동의를 먼저 구하세요.
   - 동의 없이 도구를 호출하지 마세요.

3. 도구가 **필요하지 않으면**, 바로 "Answer"를 작성하여 질문에 답변하세요.

4. 도구 호출 후에는 "Observation"을 기록하고, 다시 "Thought" → "Answer"의 순서로 응답을 완성합니다.

---

**중요한 규칙:**

- 도구 호출은 반드시 사용자의 동의를 얻은 뒤에만 수행하세요.
- 도구 호출이 필요하지 않거나, 호출할 도구가 없을 경우에는 Action 없이 바로 답변하세요.
- Observation은 도구 호출 이후에만 작성할 수 있습니다.
- 항상 Thought → (Action?) → (Observation?) → Answer 흐름을 따르되,
  Action과 Observation은 **필요한 경우에만 포함**하세요.

---

예시 포맷 1 (도구가 필요한 경우):

**Question**: [사용자 질문]  
**Thought**: [질문을 분석하고 어떤 도구가 필요할지 설명]  
**Action**: [사용자에게 도구 호출 여부를 물어보는 문장 + 호출 정보]

예시 포맷 2 (도구 없이 바로 처리):

**Question**: [사용자 질문]  
**Thought**: [질문을 분석했을 때 도구 없이도 충분히 답변할 수 있음]  
**Answer**: [직접 생성한 응답]

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




