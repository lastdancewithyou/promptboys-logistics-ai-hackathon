import React, { useEffect, useState } from "react";
import { ContractHistoryItem, ContractSearchFilters } from "../types";
import { searchContracts } from "../api/agentApi";

export const ContractSearchView: React.FC = () => {
  const [contracts, setContracts] = useState<ContractHistoryItem[]>([]);
  const [filters, setFilters] = useState<ContractSearchFilters>({
    carrier: "전체 (All)",
    pol: "BUSAN",
    pod: "LOS ANGELES",
    period: "2022-01 ~ 2023-12",
  });

  // CRITICAL RULE #3: Single selectedId state controls BOTH table highlight and details pane!
  const [selectedId, setSelectedId] = useState<string>("CTR-001");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await searchContracts(filters);
      setContracts(data);
      if (data.length > 0 && !data.some((item) => item.contractId === selectedId)) {
        setSelectedId(data[0].contractId);
      }
    } catch (err: any) {
      console.error(err);
      setError("계약 자료를 검색하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContracts();
  };

  const selectedContract = contracts.find((item) => item.contractId === selectedId) || contracts[0];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-primary text-[18px] fill">
            star
          </span>
        );
      } else if (i - 0.5 === rating) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-primary text-[18px] fill">
            star_half
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-outline text-[18px]">
            star
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 flex flex-col md:flex-row gap-8 h-full bg-surface">
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        {/* Page Header & Filter Form */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8 shadow-sm shrink-0">
          <form onSubmit={handleSearch}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined fill">manage_search</span>
                </div>
                <div>
                  <h2 className="font-display-sm text-display-sm text-on-surface">
                    계약 자료 검색
                  </h2>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-on-primary font-body-sm text-body-sm px-4 py-2 rounded-lg hover:bg-primary-container transition-colors shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">
                    search
                  </span>
                )}
                <span>검색 실행</span>
              </button>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  선사 지정 (Carrier)
                </label>
                <div className="relative">
                  <select
                    value={filters.carrier || "전체 (All)"}
                    onChange={(e) => setFilters({ ...filters, carrier: e.target.value })}
                    className="w-full h-10 pl-3 pr-8 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option>전체 (All)</option>
                    <option>HMM</option>
                    <option>Maersk</option>
                    <option>MSC</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  출발지 (POL)
                </label>
                <input
                  value={filters.pol || ""}
                  onChange={(e) => setFilters({ ...filters, pol: e.target.value })}
                  className="w-full h-10 px-3 bg-surface border border-outline-variant rounded-lg font-label-numeric text-label-numeric text-on-surface focus:border-primary focus:ring-1 focus:ring-primary uppercase outline-none"
                  placeholder="BUSAN"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  도착지 (POD)
                </label>
                <input
                  value={filters.pod || ""}
                  onChange={(e) => setFilters({ ...filters, pod: e.target.value })}
                  className="w-full h-10 px-3 bg-surface border border-outline-variant rounded-lg font-label-numeric text-label-numeric text-on-surface focus:border-primary focus:ring-1 focus:ring-primary uppercase outline-none"
                  placeholder="LOS ANGELES"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  계약 기간 (Period)
                </label>
                <div className="relative">
                  <input
                    value={filters.period || ""}
                    onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                    className="w-full h-10 pl-9 pr-3 bg-surface border border-outline-variant rounded-lg font-label-numeric text-label-numeric text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="2022-01 ~ 2023-12"
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                    calendar_month
                  </span>
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* Error message with retry */}
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error">warning</span>
              <span className="font-body-sm">{error}</span>
            </div>
            <button
              onClick={fetchContracts}
              className="px-3 py-1 bg-error text-on-error rounded font-body-sm text-xs font-semibold"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Data Table */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex-1 flex flex-col min-h-[260px] overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low shrink-0">
            <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">
                table_chart
              </span>
              <span>검색 결과</span>
              <span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full font-label-numeric text-[12px]">
                {contracts.length}
              </span>
            </h3>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => alert("CSV로 다운로드 되었습니다.")}
                title="Export CSV"
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors border border-outline-variant bg-surface"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
              <button
                type="button"
                title="Filter Columns"
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors border border-outline-variant bg-surface"
              >
                <span className="material-symbols-outlined text-[18px]">view_column</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-2xl animate-spin mr-2 text-primary">
                  progress_activity
                </span>
                <span>계약 자료 검색 중...</span>
              </div>
            ) : contracts.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                검색 조건에 해당되는 계약 자료가 없습니다.
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="sticky top-0 bg-surface-container-low shadow-sm z-10">
                  <tr>
                    <th className="p-3 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">
                      계약 번호
                    </th>
                    <th className="p-3 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">
                      선사
                    </th>
                    <th className="p-3 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">
                      구간 (POL - POD)
                    </th>
                    <th className="p-3 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">
                      기간
                    </th>
                    <th className="p-3 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant text-right pr-6">
                      컨테이너 수량
                    </th>
                    <th className="p-3 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">
                      정시 도착
                    </th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant/50 cursor-pointer">
                  {contracts.map((item) => {
                    const isSelected = item.contractId === selectedId;

                    return (
                      <tr
                        key={item.contractId}
                        onClick={() => setSelectedId(item.contractId)}
                        className={`hover:bg-surface-container-high transition-colors relative border-l-4 ${
                          isSelected
                            ? "bg-primary-fixed/20 border-primary font-medium"
                            : "border-transparent"
                        }`}
                      >
                        <td className="p-3 font-label-numeric text-label-numeric text-on-surface font-semibold">
                          {item.contractId}
                        </td>
                        <td className="p-3 font-medium text-on-surface">
                          {item.carrier}
                        </td>
                        <td className="p-3">
                          {item.pol}{" "}
                          <span className="material-symbols-outlined text-[14px] align-middle text-outline mx-1">
                            arrow_right_alt
                          </span>{" "}
                          {item.pod}
                        </td>
                        <td className="p-3 font-label-numeric text-label-numeric text-on-surface-variant">
                          {item.contractDate}
                        </td>
                        <td className="p-3 font-label-numeric text-label-numeric text-right pr-6">
                          {item.containerQty}
                        </td>
                        <td className="p-3">
                          {item.onTimeArrival === "Yes" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32] font-label-caps text-[10px]">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-error font-label-caps text-[10px]">
                              No
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Detail View (Controlled strictly by selectedId) */}
        {selectedContract && (
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex-1 min-h-[220px] flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="px-4 py-3 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">
                  description
                </span>
                <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
                  {selectedContract.contractId} 상세 조항 요약
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  alert(`${selectedContract.contractId} 원본 계약서 PDF 열기`)
                }
                className="text-primary hover:bg-primary-fixed-dim/20 px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-medium transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">
                  picture_as_pdf
                </span>{" "}
                원본 보기
              </button>
            </div>

            <div className="p-4 flex gap-6 h-full overflow-y-auto items-stretch">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch w-full">
                {/* Left: Core Terms */}
                <div className="flex flex-col gap-4">
                  <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/50">
                    <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2">
                      최종 운임 (Final Cost)
                    </h4>
                    <div className="flex items-end gap-2">
                      <span className="font-label-numeric text-[24px] font-bold text-on-surface">
                        {selectedContract.finalCostUsd}
                      </span>
                      <span className="font-body-sm text-on-surface-variant mb-1">
                        / FEU
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/50 flex flex-col justify-start items-start">
                      <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-1">
                        지연 일수
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        <p className="font-label-numeric text-[12px] text-on-surface">
                          출발 지연: {selectedContract.departureDelayDays}일
                        </p>
                        <p className="font-label-numeric text-[12px] text-on-surface">
                          도착 지연: {selectedContract.arrivalDelayDays}일
                        </p>
                      </div>
                    </div>

                    <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/50 flex flex-col justify-start items-start">
                      <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-1">
                        클레임 여부
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-[10px] w-fit ${
                          selectedContract.claimFlag === "Yes"
                            ? "bg-error-container text-error"
                            : "bg-[#e8f5e9] text-[#2e7d32]"
                        }`}
                      >
                        {selectedContract.claimFlag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Delay Reason Card */}
                <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/50 flex flex-col justify-between">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-label-caps text-label-caps text-on-surface-variant">
                      지연 사유
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface font-medium">
                      {selectedContract.delayReason}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 mt-4">
                    <h4 className="font-label-caps text-label-caps text-on-surface-variant">
                      고객 만족도 (5점 만점)
                    </h4>
                    <div className="flex items-center gap-1">
                      {renderStars(selectedContract.customerSatisfaction)}
                      <span className="ml-2 font-label-numeric text-on-surface font-semibold">
                        {selectedContract.customerSatisfaction.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: AI Insight Card */}
                <div className="bg-inverse-on-surface rounded-xl p-4 border border-outline-variant flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container rounded-full blur-3xl opacity-40"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-secondary fill">
                        psychology
                      </span>
                      <h4 className="font-title-lg text-title-lg font-bold text-on-surface">
                        AI 검토 의견
                      </h4>
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      <p>{selectedContract.aiReview}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
