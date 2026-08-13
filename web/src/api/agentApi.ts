import {
  QuotationFormData,
  AgentPipelineStatus,
  ContractHistoryItem,
  StrategyOption,
  ChatMessage,
  ContractSearchFilters,
  AgentStatusType,
  MarketResult,
} from "../types";

// 연세대 고려대 ㄷㄷ

// N8N Webhook Endpoint (Placeholder for future backend integration)
// export const N8N_WEBHOOK_URL = "https://donguri.app.n8n.cloud/webhook/shipping-request";
export const N8N_WEBHOOK_URL = "https://jeongeul.app.n8n.cloud/webhook-test/shipping-request";
export const N8N_STATUS_WEBHOOK_URL =
  "https://jeongeul.app.n8n.cloud/webhook/shipping-status";

export const N8N_STRATEGY_WEBHOOK_URL =
  "https://jeongeul.app.n8n.cloud/webhook/recommendation";

interface N8nSubmitResponse {
  requestID?: string;
  requestId?: string;
  message?: string;
}

interface N8nPipelineStatusResponse {
  requestID?: string;
  requestId?: string;
  marketStatus?: string;
  carrierStatus?: string;
  strategyStatus?: string;
  marketResult?: MarketResult | string | null;
}

function toN8nQuotationPayload(formData: QuotationFormData) {
  return {
    POL: formData.pol,
    POD: formData.pod,
    Name: formData.name,
    Company: formData.company,
    Country: formData.country,
    TEL: formData.phone,
    "E-mail": formData.email,
    Incoterms: formData.incoterms,
    Dangerous_Goods: formData.unNumber?.trim() ? "Yes" : "No",
    Request_Departure_Date_Time: formData.requestDepartureDateTime,
    Departure_Flexibility_Days: 14,
    Shipping_Type: formData.shippingType.toUpperCase(),
    Movement_Type: "Port-to-Port",
    Commodity_Description: formData.cargoDescription,
    "Weight (kg)": Number(formData.weightKg || 0),
    "Dimension (CBM)": Number(formData.cbm || 0),
    "Container 40": Number(formData.containerQty || 0),
    Details: formData.cargoDescription,
  };
}

// Helper delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 1. Submit Quotation Request
 * Returns generated requestId
 */

export async function submitQuotationRequest(
  formData: QuotationFormData
): Promise<{ requestId: string; message: string }> {
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toN8nQuotationPayload(formData)),
  });

  if (!response.ok) {
    throw new Error("요청 접수 중 오류가 발생했습니다.");
  }

  const data: N8nSubmitResponse = await response.json();
  const requestId = data.requestId ?? data.requestID;

  if (!requestId) {
    throw new Error("n8n 응답에 requestID가 없습니다.");
  }

  return {
    requestId,
    message: data.message ?? "해상 견적 요청이 성공적으로 접수되었습니다.",
  };
}

/**
 * 2. Get Agent Status
 * Reads the actual agent states recorded by n8n in Google Sheets.
 */
export async function getAgentStatus(
  requestId: string
): Promise<AgentPipelineStatus> {
  const url = new URL(N8N_STATUS_WEBHOOK_URL);
  url.searchParams.set("requestID", requestId);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`상태 조회 실패 (${response.status})`);
  }

  const data: N8nPipelineStatusResponse = await response.json();
  let marketResult: MarketResult | null = null;

  if (typeof data.marketResult === "string" && data.marketResult.trim()) {
    try {
      marketResult = JSON.parse(data.marketResult) as MarketResult;
    } catch {
      console.warn("marketResult JSON을 해석하지 못했습니다.");
    }
  } else if (data.marketResult && typeof data.marketResult === "object") {
    marketResult = data.marketResult;
  }
  const toUiStatus = (value?: string): AgentStatusType => {
    switch (value?.toUpperCase()) {
      case "COMPLETED":
        return "완료";
      case "RUNNING":
        return "처리중";
      default:
        return "대기중";
    }
  };

  return {
    requestId: data.requestId ?? data.requestID ?? requestId,
    market: toUiStatus(data.marketStatus),
    carrier: toUiStatus(data.carrierStatus),
    contract: toUiStatus(data.strategyStatus),
    marketResult,
  };
}

/**
 * 3. Search Contracts
 * Returns list matching search filters or full mock list
 */
export async function searchContracts(
  filters: ContractSearchFilters = {}
): Promise<ContractHistoryItem[]> {
  await delay(1000);

  const mockContracts: ContractHistoryItem[] = [
    {
      contractId: "CTR-001",
      carrier: "HMM",
      pol: "BUSAN",
      pod: "LOS ANGELES",
      contractDate: "24.12 - 24.12",
      containerQty: 4,
      onTimeArrival: "No",
      departureDelayDays: 0,
      arrivalDelayDays: 3,
      delayReason: "Port congestion(항만 혼잡)",
      finalCostUsd: "$13,280",
      claimFlag: "No",
      customerSatisfaction: 3.0,
      aiReview:
        "이 계약은 항만 혼잡으로 도착이 3일 지연되었으나, 클레임 없이 완료되었습니다. 고객 만족도는 3.0점으로 보통 수준이었습니다.",
    },
    {
      contractId: "CTR-002",
      carrier: "HMM",
      pol: "BUSAN",
      pod: "LOS ANGELES",
      contractDate: "25.02 - 25.02",
      containerQty: 2,
      onTimeArrival: "Yes",
      departureDelayDays: 0,
      arrivalDelayDays: 0,
      delayReason: "None(없음)",
      finalCostUsd: "$9,500",
      claimFlag: "No",
      customerSatisfaction: 5.0,
      aiReview:
        "정시 운항이 완벽하게 이루어진 우수 계약 건입니다. 클레임이 없고 고객 만족도 최고점(5.0)을 기록했습니다.",
    },
    {
      contractId: "CTR-003",
      carrier: "MAERSK",
      pol: "BUSAN",
      pod: "LOS ANGELES",
      contractDate: "25.04 - 25.05",
      containerQty: 2,
      onTimeArrival: "Yes",
      departureDelayDays: 0,
      arrivalDelayDays: 0,
      delayReason: "None(없음)",
      finalCostUsd: "$11,100",
      claimFlag: "No",
      customerSatisfaction: 4.5,
      aiReview:
        "지연 없이 성공적으로 마무리된 계약입니다. 고객 만족도 역시 4.5점으로 매우 양호합니다.",
    },
    {
      contractId: "CTR-004",
      carrier: "MAERSK",
      pol: "BUSAN",
      pod: "LOS ANGELES",
      contractDate: "25.01 - 25.01",
      containerQty: 4,
      onTimeArrival: "No",
      departureDelayDays: 2,
      arrivalDelayDays: 5,
      delayReason: "Severe weather(악천후)",
      finalCostUsd: "$15,400",
      claimFlag: "Yes",
      customerSatisfaction: 1.5,
      aiReview:
        "악천후로 인해 출발과 도착 모두 상당한 지연이 발생했으며, 이로 인해 클레임이 제기되었습니다. 향후 유사 경로에 대한 기상 리스크 관리가 필요합니다.",
    },
  ];

  if (!filters.carrier && !filters.pol && !filters.pod) {
    return mockContracts;
  }

  return mockContracts.filter((item) => {
    let match = true;
    if (filters.carrier && filters.carrier !== "전체 (All)") {
      match = match && item.carrier.toUpperCase() === filters.carrier.toUpperCase();
    }
    if (filters.pol) {
      match = match && item.pol.toUpperCase().includes(filters.pol.toUpperCase());
    }
    if (filters.pod) {
      match = match && item.pod.toUpperCase().includes(filters.pod.toUpperCase());
    }
    return match;
  });
}

/**
 * 4. Fetch Strategy Options
 * Returns options A, B, C for strategy selection screen
 */
export async function fetchStrategyOptions(
  requestId: string
): Promise<StrategyOption[]> {

  const MAX_RETRIES = 10;
  const RETRY_DELAY = 3000; // 3초

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

    const url = new URL(N8N_STRATEGY_WEBHOOK_URL);
    url.searchParams.set("requestID", requestId);

    console.log(
      `[Recommendation] 조회 시도 ${attempt}/${MAX_RETRIES}`
    );

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `전략 결과 조회 실패 (${response.status})`
        );
      }

      const data = await response.json();

      console.log(
        "[Recommendation] n8n response:",
        data
      );

      // recommendation이 실제로 준비됨
      if (
        Array.isArray(data.options) &&
        data.options.length > 0
      ) {
        console.log(
          "[Recommendation] 전략 결과 준비 완료"
        );

        return data.options as StrategyOption[];
      }

      // 아직 Data가 저장되지 않음
      console.log(
        `[Recommendation] 아직 결과 없음. ${RETRY_DELAY / 1000}초 후 재시도`
      );

    } catch (error) {
      console.error(
        `[Recommendation] ${attempt}번째 조회 실패:`,
        error
      );
    }

    // 마지막 시도가 아니라면 3초 기다림
    if (attempt < MAX_RETRIES) {
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY)
      );
    }
  }

  throw new Error(
    "전략 분석은 완료되었지만 recommendation 결과를 아직 불러오지 못했습니다."
  );
}

/**
 * 5. Send Chat Message
 * Responds in 1s with context-aware mock reply
 */
export async function sendChatMessage({
  message,
  history,
  context,
}: {
  message: string;
  history: ChatMessage[];
  context?: string;
}): Promise<ChatMessage> {
  await delay(1000);

  let replyText = "네, 확인하겠습니다. 최신 리스크 데이터를 기반으로 해당 건을 검토 중입니다.";

  const msgLower = message.toLowerCase();
  if (msgLower.includes("왜") || msgLower.includes("부산") || msgLower.includes("거부")) {
    replyText =
      "에이전트 #6은 부산항 분석에 최근 터미널 혼잡 일정을 반영했습니다. 하지만 옵션 B는 부산을 직항 우회하므로 경고를 무시하도록 코디네이터 AI가 검토 완료했습니다. 옵션 B가 여전히 추천 전략입니다.";
  } else if (msgLower.includes("옵션 c") || msgLower.includes("리스크")) {
    replyText =
      "옵션 C는 보조 항구(BEANR)를 경유하여 환적 정체를 피하는 전략입니다. 리스크 점수는 28(낮음)로 우수한 안정성을 가지고 있습니다.";
  } else if (msgLower.includes("이력") || msgLower.includes("계약")) {
    replyText =
      "사내 계약 데이터베이스에 최근 유사 구간(BUSAN-LA) 실적이 4건 등록되어 있습니다. '계약 자료 검색' 메뉴에서 실적별 지연 사유 및 운임 변동을 확인하실 수 있습니다.";
  } else if (context) {
    replyText = `[컨텍스트: ${context}] 전달해주신 문의 사항을 확인했습니다. 추가 세부 데이터 분석 결과를 바탕으로 답변해 드리겠습니다.`;
  }

  return {
    id: `msg-${Date.now()}`,
    role: "agent",
    text: replyText,
    agentName: "코디네이터 AI",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}
