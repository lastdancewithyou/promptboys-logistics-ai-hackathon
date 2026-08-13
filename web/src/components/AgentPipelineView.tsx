import React, { useEffect, useState, useRef } from "react";
import { AgentPipelineStatus, AgentStatusType } from "../types";
import { getAgentStatus } from "../api/agentApi";

interface AgentPipelineViewProps {
  requestId: string;
  onNavigateToStrategy: (requestId: string) => void;
}

type AgentProgress = Record<"market" | "carrier" | "contract", number>;

const PROGRESS_PER_SECOND: AgentProgress = {
  market: 2.2,
  carrier: 1.6,
  contract: 1.0,
};

const valueOf = (source: Record<string, unknown> | undefined, key: string) => {
  const value = source?.[key];
  return value === null || value === undefined || value === ""
    ? null
    : String(value);
};

const levelLabel = (value: string | null) => {
  const labels: Record<string, string> = {
    LOW: "낮음",
    MEDIUM: "중간",
    HIGH: "높음",
    RISING: "상승",
    FALLING: "하락",
    STABLE: "안정",
    MIXED: "혼조",
    POSSIBLE_INCREASE: "인상 가능",
    POSSIBLE_DECREASE: "인하 가능",
    STABLE_PRESSURE: "안정",
  };
  return value ? `${labels[value] ?? value}(${value})` : "분석 중";
};

const levelClass = (value: string | null) => {
  if (value === "HIGH" || value === "RISING" || value === "POSSIBLE_INCREASE") {
    return "text-error";
  }
  if (value === "LOW" || value === "FALLING" || value === "POSSIBLE_DECREASE") {
    return "text-success";
  }
  return "text-primary-container";
};

const recommendationFor = (cost: string | null, risk: string | null) => {
  if (cost === "HIGH" || risk === "HIGH") return "권고: 조기 견적·리스크 검토";
  if (cost === "MEDIUM" || risk === "MEDIUM") return "권고: 운임 변동 모니터링";
  return "권고: 계획 일정대로 검토";
};

export const AgentPipelineView: React.FC<AgentPipelineViewProps> = ({
  requestId,
  onNavigateToStrategy,
}) => {
  const [status, setStatus] = useState<AgentPipelineStatus>({
    requestId: requestId || "REQ-001",
    market: "대기중",
    carrier: "대기중",
    contract: "대기중",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [progress, setProgress] = useState<AgentProgress>({
    market: 0,
    carrier: 0,
    contract: 0,
  });

  const intervalRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());

  const fetchStatus = async () => {
    try {
      setError(null);
      const res = await getAgentStatus(requestId || "REQ-001");
      setStatus(res);

      // Show the slow-processing notice after 6 minutes.
      if (Date.now() - startTimeRef.current > 360000 && !allCompleted(res)) {
        setIsTimedOut(true);
      }
    } catch (err: any) {
      console.error(err);
      setError("에이전트 상태를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const allCompleted = (s: AgentPipelineStatus) =>
    s.market === "완료" && s.carrier === "완료" && s.contract === "완료";

  // Polling effect
  useEffect(() => {
    startTimeRef.current = Date.now();
    setIsTimedOut(false);
    setProgress({ market: 0, carrier: 0, contract: 0 });

    // Initial fetch
    fetchStatus();

    // 2-second interval simulation/polling
    intervalRef.current = setInterval(() => {
      fetchStatus();
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [requestId]);

  // RUNNING 상태에서는 일정하게 최대 90%까지 올리고,
  // 실제 COMPLETED 응답을 받는 순간 100%로 맞춘다.
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((current) => {
        const next = { ...current };

        (["market", "carrier", "contract"] as const).forEach((key) => {
          const agentStatus = status[key];

          if (agentStatus === "완료") {
            next[key] = 100;
          } else if (agentStatus === "처리중") {
            next[key] = Math.min(
              90,
              Math.max(5, current[key] + PROGRESS_PER_SECOND[key])
            );
          } else {
            next[key] = 0;
          }
        });

        return next;
      });
    }, 1000);

    return () => clearInterval(progressTimer);
  }, [status]);

  // Status and result can reach Google Sheets a moment apart. Keep polling
  // until both all agents and the Market result have arrived.
  useEffect(() => {
    if (allCompleted(status) && status.marketResult?.Market_agent) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [status]);

  const handleManualRefresh = () => {
    startTimeRef.current = Date.now();
    setIsTimedOut(false);
    fetchStatus();
  };

  const isAllDone = allCompleted(status);
  const market = status.marketResult?.Market_agent;
  const isResultReady = isAllDone && Boolean(market);
  const scfi = market?.SCFI_analysis;
  const fuel = market?.fuel_analysis;
  const weather = market?.weather_analysis;
  const summary = market?.market_summary;
  const news = [...(market?.maritime_news ?? [])].sort((a, b) => {
    const rank: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return (rank[b.Risk_Level ?? ""] ?? 0) - (rank[a.Risk_Level ?? ""] ?? 0);
  })[0];

  const scfiTrend = valueOf(scfi, "Trend");
  const fuelTrend = valueOf(fuel, "Trend");
  const bafPressure = valueOf(fuel, "BAF_Pressure");
  const weatherRisk = valueOf(weather, "Overall_Risk");
  const costPressure = valueOf(summary, "Overall_Cost_Pressure");
  const marketRisk = valueOf(summary, "Overall_Market_Risk");

  // Helper for status badge & styling per agent
  const renderAgentCard = (
    title: string,
    sub: string,
    agentStatus: AgentStatusType,
    progressValue: number
  ) => {
    const isDone = agentStatus === "완료";
    const isProcessing = agentStatus === "처리중";

    let borderClass = "border-outline-variant opacity-75";
    let topBarClass = "bg-outline";
    let iconName = "schedule";
    let iconClass = "text-outline";
    let badgeBg = "bg-surface-variant text-on-surface-variant";

    if (isDone) {
      borderClass = "border-outline-variant opacity-100";
      topBarClass = "bg-success";
      iconName = "check_circle";
      iconClass = "text-success";
      badgeBg = "bg-success/10 text-success";
    } else if (isProcessing) {
      borderClass =
        "border-primary shadow-[0_0_12px_rgba(0,45,114,0.12)] opacity-100";
      topBarClass = "bg-primary-container";
      iconName = "sync";
      iconClass = "text-primary-container animate-spin";
      badgeBg = "bg-primary-container/10 text-primary-container";
    }

    return (
      <div
        className={`bg-surface-container-lowest rounded-lg border ${borderClass} p-4 flex flex-col gap-2 relative overflow-hidden transition-all duration-500`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-1 ${topBarClass} transition-all duration-500`}
        />
        <div className="flex justify-between items-center">
          <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
            {title}
          </h3>
          <span className={`material-symbols-outlined ${iconClass}`}>
            {iconName}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant">{sub}</p>

        <div className="mt-2 text-sm">
          <span
            className={`inline-block px-2.5 py-1 ${badgeBg} rounded-full text-xs font-bold transition-all duration-500`}
          >
            {agentStatus === "완료"
              ? "분석 완료"
              : agentStatus === "처리중"
              ? "데이터 처리 중"
              : "입력 대기 중"}
          </span>
        </div>

        {/* Progress Bar Animation */}
        <div className="w-full bg-surface-variant h-1 rounded mt-2 overflow-hidden">
          <div
            className={`h-1 rounded transition-[width] duration-700 ease-linear ${
              isDone ? "bg-success" : "bg-primary-container"
            }`}
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6 md:p-8 lg:p-10 flex flex-col gap-8 relative">
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        {/* Header & Quick Action */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display-sm text-display-sm text-primary mb-1">
                Agent Pipeline
              </h1>
              <span className="font-label-numeric text-xs px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded">
                [{status.requestId}]
              </span>
            </div>
            <p className="font-body-md text-on-surface-variant">
              Multi Agent를 기반한 최상의 전략안 도출
            </p>
          </div>

          {/* Secondary Action Button (Rule 8) */}
          <button
            type="button"
            disabled={!isResultReady}
            onClick={() => onNavigateToStrategy(status.requestId)}
            className={`px-4 py-2 rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-2 transition-all ${
              isResultReady
                ? "bg-primary text-on-primary hover:bg-primary-container cursor-pointer shadow-sm active:scale-95"
                : "bg-surface-variant text-outline cursor-not-allowed opacity-60"
            }`}
          >
            <span>{isResultReady ? "전략안 확인하기" : "분석 결과 수신 중"}</span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Timeout / Slow Loading Banner (Rule 19) */}
        {isTimedOut && !isAllDone && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-600 text-2xl">
                hourglass_bottom
              </span>
              <div>
                <p className="font-semibold text-sm">
                  예상보다 시간이 걸리고 있습니다.
                </p>
                <p className="text-xs opacity-80">
                  외부 데이터 수집량이 많거나 네트워크 지연이 발생할 수
                  있습니다.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleManualRefresh}
              className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">
                refresh
              </span>
              수동 새로고침
            </button>
          </div>
        )}

        {/* Error Banner with Retry (Rule 20) */}
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error">
                warning
              </span>
              <span className="font-body-sm">{error}</span>
            </div>
            <button
              type="button"
              onClick={fetchStatus}
              className="px-3 py-1.5 bg-error text-on-error rounded-lg font-body-sm text-xs font-semibold hover:bg-error/90 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Agent Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-sm">
          {renderAgentCard(
            "Market Intelligence Agent",
            "에이전트 1",
            status.market,
            progress.market
          )}
          {renderAgentCard(
            "Carrier Evaluation Agent",
            "에이전트 2",
            status.carrier,
            progress.carrier
          )}
          {renderAgentCard(
            "Strategy Agent",
            "에이전트 3",
            status.contract,
            progress.contract
          )}
        </div>

        {/* Risk Alerts Feed */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm flex-1 flex flex-col">
          <h2 className="font-title-lg text-title-lg border-b border-outline-variant pb-2 mb-4 flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-error">
              warning
            </span>
            시장 정보 리스크 알림
          </h2>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            {!market ? (
              <div className="flex-1 min-h-44 flex flex-col items-center justify-center text-on-surface-variant gap-2">
                <span className="material-symbols-outlined animate-pulse text-3xl text-primary">
                  monitoring
                </span>
                <p className="text-sm font-semibold">Market Agent 분석 결과를 기다리는 중입니다</p>
                <p className="text-xs">분석이 완료되면 시장 지표가 자동으로 표시됩니다.</p>
              </div>
            ) : (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: SCFI */}
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="text-primary mt-1">
                      <span className="material-symbols-outlined">
                        crisis_alert
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-on-surface">
                        해상 운임 지수 (SCFI)
                      </h4>
                      <p className="text-sm text-on-surface-variant mt-1">
                        <span className="font-label-numeric font-bold">
                          {valueOf(scfi, "Current_Level") ?? "값 없음"}
                        </span>
                        {valueOf(scfi, "Four_Week_Average") && (
                          <> · 4주 평균 {valueOf(scfi, "Four_Week_Average")}</>
                        )}
                        {" · "}추세{" "}
                        <span className={`${levelClass(scfiTrend)} font-bold`}>
                          {levelLabel(scfiTrend)}
                        </span>
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                        {valueOf(scfi, "Assessment") ?? "SCFI 분석 설명이 없습니다."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-2 border-t border-outline-variant/30">
                  <p className="text-[11px] text-on-surface-variant opacity-70">
                    SCFI는 상하이 출발 기준 참고지표이며 실제 견적과 다를 수 있습니다
                  </p>
                </div>
              </div>

              {/* Card 2: Fuel Price */}
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="text-primary-container mt-1">
                      <span className="material-symbols-outlined">info</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-on-surface">
                        연료비 압력 (WTI 기준)
                      </h4>
                      <p className="text-sm text-on-surface-variant mt-1">
                        <span className="font-label-numeric font-bold">
                          {valueOf(fuel, "Latest_WTI_Price") ?? "값 없음"}
                        </span>
                        {" · "}추세{" "}
                        <span className={`${levelClass(fuelTrend)} font-bold`}>
                          {levelLabel(fuelTrend)}
                        </span>
                        {" · BAF "}
                        <span className={`${levelClass(bafPressure)} font-bold`}>
                          {levelLabel(bafPressure)}
                        </span>
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                        {valueOf(fuel, "Assessment") ?? "연료비 분석 설명이 없습니다."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-2 border-t border-outline-variant/30">
                  <p className="text-[11px] text-on-surface-variant opacity-70">
                    WTI는 육상 원유 가격으로, 실제 선박용 벙커유 가격과는 별도
                    지표입니다
                  </p>
                </div>
              </div>

              {/* Card 3: Weather Risk */}
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="text-outline mt-1">
                      <span className="material-symbols-outlined">cloud</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-on-surface">
                        기상 리스크 평가
                      </h4>
                      <p className="text-sm text-on-surface-variant mt-1">
                        출발항 {levelLabel(valueOf(weather, "POL_Risk"))} · 도착항{" "}
                        {levelLabel(valueOf(weather, "POD_Risk"))} · 종합{" "}
                        <span className={`${levelClass(weatherRisk)} font-bold`}>
                          {levelLabel(weatherRisk)}
                        </span>
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                        {valueOf(weather, "Assessment") ?? "기상 분석 설명이 없습니다."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Shipping News */}
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="text-outline mt-1">
                      <span className="material-symbols-outlined">
                        newspaper
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-on-surface">
                        해운 뉴스 모니터링
                      </h4>
                      <p className="text-sm text-on-surface-variant mt-1">
                        {news?.Title ?? "현재 표시할 주요 해운 뉴스가 없습니다."}
                      </p>
                      {news?.Summary && (
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                          {news.Summary}
                        </p>
                      )}
                      {news?.Source_URL && (
                        <a
                          href={news.Source_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block text-[11px] text-primary mt-1 hover:underline"
                        >
                          원문 보기
                        </a>
                      )}
                    </div>
                  </div>
                  {news?.Risk_Level && (
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`px-1.5 py-0.5 bg-surface-variant ${levelClass(news.Risk_Level)} text-[10px] font-bold rounded`}>
                        {news.Risk_Level}
                      </span>
                      <span className="text-[10px] text-outline">{news.Date ?? ""}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Banner */}
            <div className="bg-surface-container-high border border-outline-variant rounded-lg p-4 flex flex-col gap-2 mt-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-on-surface">종합 시장 판단</h3>
                  <p className="text-sm font-bold text-on-surface mt-1">
                    전체 비용 압력:{" "}
                    <span className={levelClass(costPressure)}>{levelLabel(costPressure)}</span>
                    <span className="mx-2 text-outline">·</span>
                    시장 리스크:{" "}
                    <span className={levelClass(marketRisk)}>{levelLabel(marketRisk)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-primary text-on-primary rounded-full text-sm font-bold">
                    {recommendationFor(costPressure, marketRisk)}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant opacity-70 border-t border-outline-variant pt-2 mt-2">
                이 판단은 선사 평가 에이전트로 전달되어 파이프라인에
                반영됩니다
              </p>
            </div>
            </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
