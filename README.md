# 🚢 Multi-Agent 기반 선사 부킹 지원 시스템

> **찾는 시간은 줄이고, 판단의 품질은 높이고, 경험은 회사에 남깁니다.**

**물류 AI 아이디어 구현 해커톤 CHALLENGE 2026**  
주최: 국토교통부 · 물류진흥재단

---

## 🌊 Overview

포워더의 선사 부킹 업무에서는 하나의 견적 요청을 처리하기 위해서도  
**선사 스케줄, 선복, 운임, 시장 상황, 항만·기상 리스크, 과거 계약 이력** 등 여러 정보를 함께 검토해야 합니다.

그리고 가장 저렴한 선사가 항상 최선의 선택인 것도 아닙니다.

> **비용을 아낄 것인가?**  
> **조금 더 지불하더라도 빠르게 보낼 것인가?**  
> **비용과 일정 사이에서 안정적인 선택을 할 것인가?**

본 프로젝트는 이러한 포워더의 의사결정을 지원하기 위해 개발한  
**Generative AI 기반 Multi-Agent 해상운송 의사결정 지원 시스템**입니다.

각 AI Agent가 시장 환경, 선사 스케줄, 운송 조건, 과거 계약 정보를 역할별로 분석하고, 이를 종합하여 담당자에게 다음 세 가지 전략을 제안합니다.

- 💰 **LOWEST COST** — 비용 우선
- ⚡ **FASTEST ARRIVAL** — 도착 속도 우선
- ⚖️ **BALANCED** — 비용·일정·리스크 균형

각 대안에는 단순한 추천 결과뿐만 아니라 **선정 이유와 trade-off**가 함께 제공됩니다.

최종 결정은 AI가 아닌 **실무 담당자**가 내립니다.  
담당자는 추천안을 승인하거나 거절할 수 있으며, 자연어로 조건을 변경해 새로운 대안을 다시 탐색할 수도 있습니다.

---

## ✨ Why This Matters

### ⚡ 여러 자료를 찾는 대신, 바로 판단합니다

선사별 스케줄과 운임, 시장 지표와 리스크를 각각 찾아 비교하는 과정을 Multi-Agent가 대신 수행합니다.

담당자는 **정보를 찾고 정리하는 데 사용하는 시간을 줄이고 실제 의사결정에 집중**할 수 있습니다.

### 💡 "어느 선사?"뿐 아니라 "왜 이 선사?"까지

AI는 단순히 하나의 선사를 추천하지 않습니다.

비용, ETA, 운송기간, 선복, 리스크, 시장 상황과 과거 계약 정보를 함께 고려하여 **각 대안이 선정된 이유와 다른 선택지와의 trade-off**를 제공합니다.

이를 통해 담당자는 AI의 결론을 그대로 받아들이는 것이 아니라 **근거를 확인하고 판단**할 수 있습니다.

### 🔄 조건이 바뀌어도 처음부터 다시 찾지 않습니다

> "9월 15일 이전에 도착할 수 있는 선사를 찾아줘."  
> "조금 비싸더라도 더 빠른 일정으로 찾아줘."  
> "이 선사는 제외하고 다시 확인해줘."

최초 견적 이후 조건이 변경되어도 기존 의사결정 맥락을 유지하면서 **재평가(Re-evaluation)**하거나 필요한 경우 선사 스케줄을 **재탐색(Re-search)**합니다.

### 🧠 오늘의 선택이 내일 회사의 노하우가 됩니다

AI의 추천만 저장하는 것이 아닙니다.

**어떤 상황에서 → 어떤 대안이 제시되었고 → 담당자가 무엇을 선택했으며 → 왜 승인하거나 거절했는지**를 의사결정 맥락과 함께 축적합니다.

이를 통해 개인에게 의존하던 실무 경험을 장기적으로 **조직의 의사결정 자산**으로 전환하는 것을 목표로 합니다.

---

## 🎬 MVP

> 실제 견적 요청부터 Multi-Agent 분석, 전략 추천, 담당자 피드백 및 재계획까지 하나의 workflow로 구성했습니다.

- 🎥 **시연 영상 (YouTube)**  

<!-- 🎥 시연 영상 (YouTube) Demo -->
<section class="demo-video">
  <h2>🎥 시연 영상 (YouTube)</h2>
  <p>Coming Soon</p>

  <div class="video-container">
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="Demo Video"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  </div>
</section>

<!-- 🌐 웹 페이지 Demo -->
<section class="demo-page">
  <h2>🌐 웹 페이지 Demo</h2>
  <p>Coming Soon</p>

  <a
    href="https://hyundai-glovis-maritime-logistics-agent.ai.studio/"
    target="_blank"
    rel="noopener noreferrer"
    class="demo-link"
  >
    웹 페이지 바로가기 →
  </a>
</section>

---

## 🧭 How It Works

사용자가 출발항·도착항, 희망 출항일, 화물 정보, 컨테이너 수량 등의 견적 요청을 입력하면 다음 workflow가 시작됩니다.

<p align="center">
  <img src="./image/.png" alt="Demo" width="800">
</p>

---



## 🤖 Multi-Agent Architecture

### 🌐 Market Intelligence Agent

현재 운송 시장 환경을 분석합니다.

- SCFI 기반 해상운임 추세
- WTI 기반 연료비 압력
- 출발지·도착지 기상 위험
- 최신 해운 관련 뉴스
- 과거 계절적 시장 환경

시장 정보를 특정 운임으로 임의 환산하지 않고, **의사결정을 위한 시장 Context와 Risk Signal**로 제공합니다.

---

### 🚢 Carrier Evaluation Agent

선사별 실제 운항 후보를 탐색하고 견적 요청 조건을 만족할 수 있는 일정을 검증합니다.

현재 데모에서는 다음 선사의 스케줄을 비교합니다.

- HMM
- MSC
- MAERSK

주요 검증 조건은 다음과 같습니다.

`POL / POD` · `ETD / ETA` · `Available Capacity` · `Payload` · `CBM` · `Dangerous Goods` · `Freight Cost`

조건을 만족하지 못하는 후보를 제거한 뒤 **실행 가능한(Feasible) 스케줄**을 Strategy Agent에 전달합니다.

---

### 🧠 Strategy Agent

Carrier Agent의 실행 가능한 후보, Market Agent의 시장 분석과 과거 계약 이력을 종합하여 최종 의사결정 대안을 생성합니다.

| Strategy | Objective |
| --- | --- |
| 💰 `LOWEST_COST` | 실행 가능한 후보 중 비용 최소화 |
| ⚡ `FASTEST_ARRIVAL` | 가장 빠른 도착 일정 우선 |
| ⚖️ `BALANCED` | 비용·일정·시장 및 운송 리스크의 균형 |

또한 모든 후보의 평가 결과와 선정·미선정 근거를 보존하여 **왜 특정 대안이 추천되었는지 추적할 수 있도록 설계**했습니다.

---

### 🔄 Replan / Re-search Agent

실제 업무에서는 최초 견적 이후에도 고객의 요구사항이 계속 변경됩니다.

시스템은 담당자의 자연어 요청에서 변경된 조건을 파악하여 두 가지 방식으로 대응합니다.

**Re-evaluation**

기존에 확보한 후보만으로 답할 수 있다면 불필요하게 데이터를 다시 검색하지 않고 기존 Decision Context를 재평가합니다.

**Re-search**

기존 후보만으로 새로운 조건을 충족할 수 없다면 HMM, MSC, MAERSK의 스케줄을 다시 탐색하여 새로운 후보를 찾습니다.

이를 통해 단발성 질의응답이 아닌 **대화형 의사결정 과정**을 지원합니다.

---

## 👤 Human-in-the-loop

> **AI recommends. Humans decide.**

본 시스템의 목적은 AI가 선사 부킹을 자동으로 결정하는 것이 아닙니다.

AI가 정보를 수집하고 대안을 비교하여 의사결정을 지원하되, **최종 선택과 책임은 실무 담당자에게 유지**합니다.

현재 프로토타입에서는 Telegram을 통해 다음 workflow를 구현했습니다.

```text
AI Strategy Recommendation
          │
          ▼
   📱 Telegram Review
          │
     ┌────┴────┐
     ▼         ▼
 ✅ Approve   ❌ Reject
     │         │
     │         ▼
     │    💬 Feedback
     │         │
     │         ▼
     │    🔄 Re-planning
     │
     └─────────┬─────────
               ▼
        Decision Context DB
```

현재는 Telegram 기반 Human Feedback을 사용하며, 향후 웹 서비스 내 **AI Navigator**로 통합하는 것을 목표로 합니다.

---

## 🧠 From Decision Support to Organizational Intelligence

본 프로젝트가 궁극적으로 지향하는 것은 단순한 **AI 선사 추천 시스템**이 아닙니다.

각 의사결정에서 다음 정보를 함께 축적합니다.

```text
Quotation Request
       ↓
Available Alternatives
       ↓
AI Recommendation + Reason
       ↓
Human Decision
       ↓
Approve / Reject Reason
       ↓
Decision Context
```

이를 통해 시간이 지날수록

> **"어떤 상황에서 어떤 선택을 했고, 왜 그렇게 판단했는가?"**

라는 회사 고유의 의사결정 경험을 축적할 수 있습니다.

장기적으로는 이를 신규 담당자 교육, 업무 인수인계, 유사 부킹 사례 검색 및 조직 차원의 의사결정 기준 정립에 활용하는 것을 목표로 합니다.

---

## 🛡️ Reliability by Design

생성형 AI를 실제 의사결정 지원에 활용하기 위해 **LLM이 확인되지 않은 정보를 임의로 생성하지 않도록 하는 것**을 중요한 설계 원칙으로 두었습니다.

### Structured Output

Agent 간 데이터 전달은 가능한 한 자유 텍스트가 아닌 **구조화된 JSON Schema**를 사용합니다.

### Data Preservation

Carrier Schedule 처리 과정에서는 원본 Schedule ID와 주요 운송 정보를 유지하고, Agent가 임의로 후보를 누락하거나 변형하지 않도록 후처리 규칙을 적용합니다.

### No Arbitrary Cost Estimation

SCFI, WTI와 같은 시장 지표는 의사결정을 위한 Context로 활용하며, 근거 없이 특정 선사의 실제 운임으로 환산하지 않습니다.

### Human Validation

AI의 추천 결과는 최종 결정이 아닙니다. 실제 담당자가 대안을 확인하고 승인 또는 거절하도록 설계했습니다.

---

## 🖥️ Web Dashboard

웹에서는 전체 Multi-Agent pipeline의 진행 상황을 실시간으로 확인할 수 있습니다.

```text
Quotation Submitted
        ↓
Market Agent       → PENDING / RUNNING / COMPLETED
Carrier Agent      → PENDING / RUNNING / COMPLETED
Strategy Agent     → PENDING / RUNNING / COMPLETED
        ↓
Strategy Comparison
        ↓
Human Decision
```

시장 분석 결과와 최종 세 가지 전략 역시 웹 화면에서 비교할 수 있도록 구성했습니다.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19 · TypeScript · Vite · Tailwind CSS |
| **Agent Orchestration** | n8n |
| **Generative AI** | OpenAI Chat Model |
| **Agent Interface** | Structured Output Parser · JSON Schema |
| **Operational Data** | Google Sheets |
| **Market Intelligence** | SCFI · WTI API · Weather API · Maritime News RSS |
| **Backend Communication** | Webhook |
| **Human Feedback** | Telegram |
| **State Tracking** | Request ID · Progress Sheet · Decision Context |

---

## 📁 Project Structure

```text
src/
├── api/
│   └── agentApi.ts
│       └── n8n Webhook 및 Pipeline Status 연동
│
├── components/
│   ├── QuotationInputView.tsx
│   │   └── 해상운송 견적 요청
│   │
│   ├── AgentPipelineView.tsx
│   │   └── Multi-Agent 진행 상태 및 시장 분석
│   │
│   ├── StrategySelectionView.tsx
│   │   └── LOWEST / FASTEST / BALANCED 전략 비교
│   │
│   └── ContractSearchView.tsx
│       └── 과거 계약 이력 조회
│
├── App.tsx
│   └── Application Flow 및 State 관리
│
└── types.ts
    └── 공통 데이터 타입
```

---

## 🚀 Getting Started

### 1. Install

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Production Build

```bash
npm run build
```

> 실제 Multi-Agent workflow를 실행하려면 n8n Webhook 및 Google Sheets, 외부 시장 데이터 소스 등의 연결 설정이 필요합니다.

---

## 🗺️ Roadmap

현재 프로토타입에서 구현한 기능을 기반으로 다음과 같은 확장을 목표로 합니다.

- [x] Multi-Agent 기반 시장·선사 정보 분석
- [x] 비용 / 속도 / 균형형 전략 생성
- [x] 웹 기반 Agent 진행 상태 확인
- [x] Telegram Human-in-the-loop
- [x] 자연어 기반 조건 변경 및 Re-planning
- [x] 기존 후보 재평가 / Carrier Schedule Re-search
- [ ] Telegram Feedback → Web AI Navigator 통합
- [ ] 실제 운영 데이터 소스 및 선사 API 연동 확대
- [ ] Decision Context 기반 유사 과거 의사결정 검색
- [ ] 담당자 Feedback을 활용한 추천 개인화 및 고도화
- [ ] 축적된 의사결정 이력을 활용한 Organizational Intelligence 구축

---

## 👥 Team — 프롬프트보이즈

| Name | Position | Contribution |
| :--- | :---: | :--- |
| **서동혁** | Team Leader | Multi-Agent Workflow · n8n |
| **권정을** | Team Member | Multi-Agent Workflow · n8n |
| **김종훈** | Team Member | Service Planning |
| **정강민** | Team Member | UI/UX Design · Frontend · Backend |
| **최지웅** | Team Member | Multi-Agent Workflow · n8n |

---

## 🏆 Challenge

**물류 AI 아이디어 구현 해커톤 CHALLENGE 2026**

국토교통부 · 물류진흥재단

---

<p align="center">
  <b>🚢 From scattered logistics data to explainable decisions.</b>
  <br/>
  <sub>Multi-Agent Decision Support for Ocean Freight Booking</sub>
</p>