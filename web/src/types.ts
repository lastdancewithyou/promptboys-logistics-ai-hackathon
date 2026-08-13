export type AppStage = "input" | "pipeline" | "strategy" | "contracts";

export interface QuotationFormData {
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  incoterms: string;
  shippingType: string;
  pol: string;
  pod: string;
  requestDepartureDateTime: string;
  cargoDescription: string;
  containerQty: number | string;
  weightKg?: number | string;
  cbm?: number | string;
  hsCode?: string;
  unNumber?: string;
}

export type AgentStatusType = "대기중" | "처리중" | "완료";

export interface MarketNewsItem {
  Title?: string;
  Date?: string;
  Risk_Level?: string;
  Summary?: string;
  Source_URL?: string;
}

export interface MarketAgentResult {
  market_context?: Record<string, unknown>;
  SCFI_analysis?: Record<string, unknown>;
  fuel_analysis?: Record<string, unknown>;
  weather_analysis?: Record<string, unknown>;
  maritime_news?: MarketNewsItem[];
  market_summary?: Record<string, unknown>;
}

export interface MarketResult {
  Market_agent?: MarketAgentResult;
}

export interface AgentPipelineStatus {
  requestId: string;
  market: AgentStatusType;
  carrier: AgentStatusType;
  contract: AgentStatusType;
  marketResult?: MarketResult | null;
}

export interface ContractHistoryItem {
  contractId: string;
  carrier: string;
  pol: string;
  pod: string;
  contractDate: string;
  containerQty: number;
  onTimeArrival: "Yes" | "No";
  departureDelayDays: number;
  arrivalDelayDays: number;
  delayReason: string;
  finalCostUsd: string;
  claimFlag: "Yes" | "No";
  customerSatisfaction: number;
  aiReview: string;
}

export interface StrategyOption {
  optionId: "A" | "B" | "C";
  title: string;
  subtitle: string;
  icon: string;
  costUsd: string;
  costPerUnit: string;
  leadTimeDays: number;
  riskScoreLabel: string;
  riskScoreValue: number;
  recommendationQuote: string;
  agent6Status: "approved" | "warning";
  agent6Tooltip: string;
  isRecommended?: boolean;
  vesselName: string;
  portPair: string;
  eta: string;
}

export interface ChatMessage {
  id: string;
  role: "agent" | "user";
  text: string;
  agentName?: string;
  timestamp?: string;
}

export interface ContractSearchFilters {
  carrier?: string;
  pol?: string;
  pod?: string;
  period?: string;
}
