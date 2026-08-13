import React, { useEffect, useState } from "react";
import { StrategyOption } from "../types";
import { fetchStrategyOptions } from "../api/agentApi";

interface StrategySelectionViewProps {
  requestId: string;
  onSelectOption?: (option: StrategyOption) => void;
}

export const StrategySelectionView: React.FC<StrategySelectionViewProps> = ({
  requestId,
  onSelectOption,
}) => {
  const [options, setOptions] = useState<StrategyOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string>("B"); // Option B default
  const [confirmedOptionId, setConfirmedOptionId] = useState<string | null>("B"); // Default confirmed option B
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmedMessage, setConfirmedMessage] = useState<string | null>(null);

  const loadOptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchStrategyOptions(requestId || "REQ-001");
      setOptions(data);
    } catch (err: any) {
      console.error(err);
      setError("전략안 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, [requestId]);

  const handleConfirm = (option: StrategyOption) => {
    setSelectedOptionId(option.optionId);
    setConfirmedOptionId(option.optionId);
    setConfirmedMessage(`옵션 ${option.optionId} (${option.title})이 최종 의사결정 전략안으로 확정 등록되었습니다.`);
    if (onSelectOption) onSelectOption(option);
    setTimeout(() => {
      setConfirmedMessage(null);
    }, 4000);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-surface">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin mb-4">
          progress_activity
        </span>
        <p className="font-title-lg text-on-surface text-center">
          요청 건 [{requestId || "REQ-001"}]에 대한 AI 생성 라우팅 옵션을
          분석 중입니다...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-surface">
        <div className="bg-error-container text-on-error-container p-8 rounded-xl max-w-md w-full border border-error/30 text-center shadow-md">
          <span className="material-symbols-outlined text-error text-4xl mb-3">
            error
          </span>
          <p className="font-title-lg font-bold mb-2">데이터 로드 실패</p>
          <p className="font-body-sm mb-6">{error}</p>
          <button
            onClick={loadOptions}
            className="px-5 py-2.5 bg-error text-on-error rounded-lg font-semibold text-sm hover:bg-error/90 transition-colors shadow-sm"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 bg-surface flex flex-col space-y-8 relative">
      {/* Page Header */}
      <div className="flex justify-between items-end pb-6 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display-sm text-display-sm text-on-background">
              전략안 선택
            </h1>
            <span className="font-label-numeric text-xs px-3 py-1 bg-primary-fixed text-on-primary-fixed font-semibold rounded-full">
              선적 건 #{requestId || "CTR-001"}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            선적 건 #{requestId || "CTR-001"}에 대한 AI 생성 라우팅 옵션 비교 및 최종 확정
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => alert("비교 내역 보고서가 내보내기 되었습니다 (PDF).")}
            className="px-4 py-2.5 border border-outline text-primary rounded-lg font-body-sm hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            <span>비교 내역 내보내기</span>
          </button>
        </div>
      </div>

      {confirmedMessage && (
        <div className="bg-success/10 border border-success text-success p-4 rounded-xl flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-success text-2xl">
              check_circle
            </span>
            <span className="font-body-sm font-semibold">
              {confirmedMessage}
            </span>
          </div>
        </div>
      )}

      {/* Strategy Cards (Bento Grid) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {options.map((opt) => {
          const isConfirmed = confirmedOptionId === opt.optionId;
          const isSelected = selectedOptionId === opt.optionId;
          const isRec = opt.isRecommended;

          return (
            <div
              key={opt.optionId}
              className={`bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden ${
                isConfirmed
                  ? "border-2 border-success ring-2 ring-success/20 transform xl:-translate-y-1"
                  : isRec
                  ? "border-2 border-primary"
                  : isSelected
                  ? "border-2 border-secondary"
                  : "border border-outline-variant"
              }`}
            >
              {/* Recommendation or Confirmed Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                {isConfirmed && (
                  <div className="bg-success text-on-primary px-3 py-1 rounded-full font-label-caps text-label-caps shadow-sm whitespace-nowrap flex items-center gap-1 font-bold text-xs">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                    최종 확정됨
                  </div>
                )}
                {isRec && !isConfirmed && (
                  <div className="bg-primary text-on-primary px-3.5 py-1 rounded-full font-label-caps text-label-caps shadow-sm whitespace-nowrap flex items-center gap-1 font-bold text-xs">
                    <span className="material-symbols-outlined text-xs fill">
                      star
                    </span>
                    추천 전략
                  </div>
                )}
              </div>

              {/* Card Header */}
              <div
                className={`p-6 border-b border-outline-variant flex justify-between items-center rounded-t-xl ${
                  isConfirmed
                    ? "bg-success/10"
                    : isRec
                    ? "bg-primary-fixed/40"
                    : "bg-surface-container-low"
                }`}
              >
                <div>
                  <span
                    className={`font-label-caps text-label-caps block mb-1 font-semibold ${
                      isConfirmed
                        ? "text-success"
                        : isRec
                        ? "text-primary"
                        : "text-on-surface-variant"
                    }`}
                  >
                    옵션 {opt.optionId}
                  </span>
                  <h3 className="font-title-lg text-title-lg font-bold text-on-background">
                    {opt.title}
                  </h3>
                </div>
                <span className="material-symbols-outlined text-secondary text-3xl">
                  {opt.icon}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col space-y-6">
                {/* Cost */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      운임
                    </span>
                    <span className="font-label-numeric text-label-numeric text-primary text-2xl font-bold">
                      {opt.costUsd}
                      <span className="font-normal text-sm text-on-surface-variant ml-1">
                        {opt.costPerUnit}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2 mt-2">
                    <div
                      className="bg-secondary h-2 rounded-full"
                      style={{
                        width:
                          opt.optionId === "A"
                            ? "25%"
                            : opt.optionId === "B"
                            ? "75%"
                            : "45%",
                      }}
                    />
                  </div>
                </div>

                {/* Lead time */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      리드타임
                    </span>
                    <span className="font-label-numeric text-label-numeric text-on-background font-bold text-xl">
                      {opt.leadTimeDays} 일
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2 mt-2">
                    <div
                      className="bg-outline h-2 rounded-full"
                      style={{
                        width:
                          opt.optionId === "A"
                            ? "85%"
                            : opt.optionId === "B"
                            ? "30%"
                            : "55%",
                      }}
                    />
                  </div>
                </div>

                {/* Risk score */}
                <div className="flex justify-between items-end pt-1">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    리스크 점수
                  </span>
                  <span className="font-label-numeric text-label-numeric text-on-background font-semibold text-base">
                    {opt.riskScoreLabel} ({opt.riskScoreValue})
                  </span>
                </div>

                {/* Quote */}
                <div className="mt-2 p-4 bg-surface-container rounded-lg border border-surface-variant">
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic leading-relaxed">
                    {opt.recommendationQuote}
                  </p>
                </div>

                {/* Agent #6 Indicator */}
                
              </div>

              {/* Card Footer: If confirmed, button is hidden and replaced by confirmation badge */}
              <div className="p-5 border-t border-outline-variant bg-surface-container-lowest rounded-b-xl">
                {isConfirmed ? (
                  <div className="w-full py-3 rounded-lg font-title-lg text-body-md bg-success/15 text-success border border-success/40 flex items-center justify-center gap-2 font-bold shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">
                      check_circle
                    </span>
                    <span>선택 확정 완료됨</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleConfirm(opt)}
                    className="w-full py-3 rounded-lg font-title-lg text-body-md bg-surface text-primary border border-primary hover:bg-primary hover:text-on-primary transition-all shadow-sm font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>이 전략으로 선택 확정</span>
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Comparison Table */}
      <div className="mt-10 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant">
          <h3 className="font-title-lg text-title-lg text-on-background font-bold">
            상세 물류 지표 비교
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface font-label-caps text-label-caps text-on-surface-variant">
                <th className="py-4 px-6 font-semibold">지표</th>
                <th className="py-4 px-6 font-semibold border-l border-outline-variant">
                  옵션 A (비용)
                </th>
                <th className="py-4 px-6 font-semibold border-l border-outline-variant bg-primary-fixed/30 text-on-primary-fixed-variant">
                  옵션 B (속도) - 추천
                </th>
                <th className="py-4 px-6 font-semibold border-l border-outline-variant">
                  옵션 C (균형)
                </th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-background">
              <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-6 font-medium text-on-surface-variant">
                  선박명
                </td>
                <td className="py-4 px-6 border-l border-outline-variant">
                  EVER GIVEN
                </td>
                <td className="py-4 px-6 border-l border-outline-variant bg-primary-fixed/10 font-semibold">
                  MSC OSCAR
                </td>
                <td className="py-4 px-6 border-l border-outline-variant">
                  CMA CGM BENJAMIN FRANKLIN
                </td>
              </tr>
              <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-6 font-medium text-on-surface-variant">
                  항구 쌍
                </td>
                <td className="py-4 px-6 border-l border-outline-variant">
                  CNSHG -&gt; NLRTM
                </td>
                <td className="py-4 px-6 border-l border-outline-variant bg-primary-fixed/10 font-semibold">
                  CNSHG -&gt; NLRTM (직항)
                </td>
                <td className="py-4 px-6 border-l border-outline-variant">
                  CNHKG -&gt; BEANR
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-6 font-medium text-on-surface-variant">
                  예상 도착일
                </td>
                <td className="py-4 px-6 border-l border-outline-variant font-label-numeric">
                  2026-10-15
                </td>
                <td className="py-4 px-6 border-l border-outline-variant bg-primary-fixed/10 font-label-numeric font-bold text-primary">
                  2026-09-26
                </td>
                <td className="py-4 px-6 border-l border-outline-variant font-label-numeric">
                  2026-10-04
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="h-8"></div>
    </div>
  );
};
