# 🧩 마음쉼터 - 분쟁지역 청소년 심리 지원 플랫폼

분쟁지역 청소년의 감정 회복 지원을 위한 **AI 챗봇 기반 심리 지원 웹 플랫폼**입니다.

---

## 📁 프로젝트 구조

```
HUSS/
├── backend/                    # NestJS 백엔드
│   ├── src/
│   │   ├── database/entities/  # TypeORM 엔티티
│   │   ├── modules/
│   │   │   ├── user/           # 사용자 관리
│   │   │   ├── chat/           # AI 챗봇
│   │   │   ├── summary/        # 감정 요약
│   │   │   ├── counseling/     # 상담 세션
│   │   │   ├── webex/          # Webex 연동
│   │   │   └── admin/          # 관리자
│   │   └── services/ai/        # AI 서비스
│   └── .env                    # 환경변수
│
├── frontend/                   # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # 랜딩 페이지
│   │   │   ├── chat/           # 채팅 페이지
│   │   │   └── admin/          # 관리자 대시보드
│   │   ├── components/         # React 컴포넌트
│   │   └── lib/api.ts          # API 클라이언트
│
└── IMPLEMENTATION_PLAN.md      # 구현 계획서
```

---

## 🚀 실행 방법

### 1. 백엔드 실행

```bash
cd ~\MK\HUSS\backend
npm install
npm run start:dev
```

> 백엔드는 `http://localhost:4000`에서 실행됩니다

### 2. 프론트엔드 실행

```bash
cd ~\MK\HUSS\frontend
npm install
npm run dev
```

> 프론트엔드는 `http://localhost:3000`에서 실행됩니다

---

## 🔑 환경 변수 설정

### Backend (.env)

| 변수 | 설명 |
|------|------|
| `PORT` | 서버 포트 (기본: 4000) |
| `DB_HOST` | PostgreSQL 호스트 |
| `DB_PORT` | PostgreSQL 포트 |
| `DB_USERNAME` | 데이터베이스 사용자명 |
| `DB_PASSWORD` | 데이터베이스 비밀번호 |
| `DB_NAME` | 데이터베이스 이름 |
| `OPENAI_API_KEY` | OpenAI API 키 |
| `WEBEX_ACCESS_TOKEN` | Webex API 토큰 ✅ 설정됨 |

---

## 📡 API 엔드포인트

### 사용자
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/users` | 사용자 생성 |
| GET | `/api/users/:id` | 사용자 조회 |

### AI 챗봇
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/chat` | 메시지 전송 (저장 ❌) |

### 감정 요약
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/summary` | AI 요약 생성 |
| GET | `/api/summary/:id` | 요약 조회 |

### 상담
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/counseling/request` | Webex 상담 요청 |
| GET | `/api/counseling/:id` | 세션 조회 |

### Webex Webhook
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/webex/webhook` | 이벤트 수신 |

### 관리자
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/sessions` | 모든 세션 조회 |

---

## ✨ 주요 기능

### 1. 랜딩 페이지
- 프리미엄 다크 테마 디자인
- Glassmorphism 효과
- 그라데이션 애니메이션
- 반응형 레이아웃

### 2. AI 채팅
- 실시간 메시지 교환
- 타이핑 인디케이터
- 세션 기반 대화 (저장 안함)
- 따뜻한 AI 응답

### 3. 감정 분석
- emotion_tags: 감정 태그 배열
- dominant_emotion: 주요 감정
- repeated_topics: 반복 주제
- risk_flag: 위험 여부
- intensity_score: 강도 점수

### 4. Webex 상담 연결
- 자동 화상회의 생성
- 상담사 대시보드
- Webhook 상태 업데이트

---

## 🔒 프라이버시 설계

> [!IMPORTANT]
> **대화 원문은 저장되지 않습니다**

- 대화는 세션 메모리에만 존재
- 요약 생성 후 세션 삭제
- 비식별화된 구조적 데이터만 저장
- 상담 효율 향상 목적으로만 사용

---

## ✅ 빌드 검증

```
✅ Frontend build: 성공
✅ Backend build: 성공
```

---

## 📚 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 15, React 19, TailwindCSS |
| Backend | NestJS, TypeORM, PostgreSQL |
| AI | OpenAI GPT-4 |
| Video | Cisco Webex Meetings API |

---

## 🎨 디자인 특징

- **다크 모드**: 눈의 피로를 줄이는 프리미엄 다크 테마
- **글래스모피즘**: 현대적인 반투명 유리 효과
- **그라데이션**: 부드러운 색상 전환
- **마이크로 애니메이션**: 자연스러운 인터랙션
- **반응형**: 모바일 우선 설계
