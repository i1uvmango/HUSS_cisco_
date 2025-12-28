# 🌉 Bridge-X - Refugee Youth Mental Health Platform

AI-powered psychological support platform for refugee youth in conflict zones, powered by **Google Gemini** and **Cisco Webex**.

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
| `OPENAI_API_KEY` | (사용안함) 기존 OpenAI 키 |
| `GEMINI_API_KEY` | **Google Gemini API 키** (필수) ✅ 설정됨 |
| `WEBEX_ACCESS_TOKEN` | Webex Meeting 생성용 User Token ✅ 설정됨 |

---

## 📡 API 엔드포인트

### 사용자
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/users` | 사용자 생성 |
| GET | `/api/users/:id` | 사용자 조회 |

### AI 챗봇 (Gemini)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/chat` | 메시지 전송 (Gemini Pro/Flash 연동) |

### 감정 요약
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/summary` | Gemini 감정 분석 요약 생성 |
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

### 1. 랜딩 페이지 (Healing Design)
- **파스텔 힐링 테마**: 심리적 안정을 주는 Blue(#6B9BD2) & Green(#A8D5BA) 컬러 팔레트
- **Glassmorphism**: 투명하고 깨끗한 느낌의 현대적 UI
- **인터랙티브 애니메이션**: 부드러운 플로팅(Floating) 효과와 페이드인
- **Mobile First**: 모든 기기에서 최적화된 반응형 레이아웃

### 2. AI 채팅 (Advanced AI)
- **모델**: **Google Gemini 2.5 Flash** (High-Performance Custom Config)
- **감성 지능**: 내담자의 감정을 읽고 공감하는 페르소나 적용
- **다국어 지원**: 한국어/영어 등 입력 언어 자동 감지 및 응답
- **실시간 반응**: 타이핑 인디케이터와 자연스러운 딜레이

### 3. 지능형 위기 개입 (Smart Intervention)
- **실시간 위험 감지**: 대화 중 자해/자살 위험 징후 포착 시 `[RISK_DETECTED]` 트리거
- **Zero-Click 구조**: 위험 감지 즉시 백엔드에서 Webex 미팅룸 자동 생성
- **골든타임 확보 UI**: 채팅창 내 **[🚨 긴급 상담 입장]** 버튼 즉시 노출 (Red Alert Badge)

### 4. 데이터 및 프라이버시
- **휘발성 세션**: 상담 종료 시 대화 내용은 즉시 파기 (DB 저장 X)
- **비식별 분석**: 상담 개선을 위한 감정/주제 데이터만 익명화하여 저장

---

## 🔷 Cisco Webex Bot 역할

Bridge-X는 **Cisco Webex Bot**을 활용하여 AI와 전문 상담사를 실시간으로 연결합니다.

### 핵심 기능

| Icon | Role |
|:----:|------|
| 🤖 → 🔷 | AI triggers Webex Bot upon crisis detection |
| 📱 | Real-time notification to counselors |
| 🎥 | Auto video meeting room creation |
| ⚡ | Instant professional intervention |

### 상담 유형별 알림

| 상황 | Webex 미팅 제목 | 알림 유형 |
|------|----------------|----------|
| 자살/자해 언급 감지 | `[긴급] 심리 상담 세션` | 🚨 위기 알림 |
| 감정 분석 후 risk_flag | `[긴급] 심리 상담 세션` | ⚠️ 리스크 알림 |
| 사용자 자발적 요청 | `[상담 요청] 심리 상담 세션` | 👤 일반 알림 |

### 워크플로우

```
청소년 → AI 채팅 → 위기 감지 → Webex Bot → 자동 미팅 생성 → 상담사 알림 → 화상 상담
```

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
| AI | **Google Gemini API** (Gemini 2.5 Flash / Pro) |
| Video | **Cisco Webex Meetings API** |
| Bot | **Cisco Webex Bot** (Auto Meeting & Push Notification) |

---

## 🎨 디자인 특징

- **다크 모드**: 눈의 피로를 줄이는 프리미엄 다크 테마
- **글래스모피즘**: 현대적인 반투명 유리 효과
- **그라데이션**: 부드러운 색상 전환
- **마이크로 애니메이션**: 자연스러운 인터랙션
- **반응형**: 모바일 우선 설계

---

## 📄 License

MIT License © 2025 Bridge-X Team
