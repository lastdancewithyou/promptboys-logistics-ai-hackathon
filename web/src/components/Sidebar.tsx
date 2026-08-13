import React from "react";
import { AppStage } from "../types";

interface SidebarProps {
  currentStage: AppStage;
  onSelectStage: (stage: AppStage) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStage,
  onSelectStage,
}) => {
  return (
    <nav className="docked h-full w-64 bg-surface-container dark:bg-surface-container-low flex flex-col p-2 space-y-1 border-r border-outline-variant shrink-0 z-30 transition-transform md:flex">
      <div className="px-4 py-4 mb-2">
        <h2 className="font-title-lg text-title-lg text-on-surface">
          의사결정 작업
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          <br />
        </p>
      </div>

      {/* 1. 견적 요청 입력 */}
      <button
        type="button"
        onClick={() => onSelectStage("input")}
        aria-current={currentStage === "input" ? "page" : undefined}
        aria-label="견적 요청 입력"
        className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all ${
          currentStage === "input"
            ? "bg-surface-bright dark:bg-surface-variant text-primary font-bold shadow-sm scale-98"
            : "text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high scale-98 active:scale-95"
        }`}
      >
        <span
          className={`material-symbols-outlined mr-3 ${
            currentStage === "input" ? "fill" : ""
          }`}
        >
          edit_document
        </span>
        <span className="font-body-sm text-body-sm">견적 요청 입력</span>
      </button>

      {/* 2. 에이전트 (Agent Pipeline) */}
      <button
        type="button"
        onClick={() => onSelectStage("pipeline")}
        aria-current={currentStage === "pipeline" ? "page" : undefined}
        aria-label="에이전트"
        className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all ${
          currentStage === "pipeline"
            ? "bg-surface-bright dark:bg-surface-variant text-primary font-bold shadow-sm scale-98"
            : "text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high scale-98 active:scale-95"
        }`}
      >
        <span
          className={`material-symbols-outlined mr-3 ${
            currentStage === "pipeline" ? "fill" : ""
          }`}
        >
          smart_toy
        </span>
        <span className="font-body-sm text-body-sm">에이전트</span>
      </button>

      {/* 3. 전략안 선택 */}
      <button
        type="button"
        onClick={() => onSelectStage("strategy")}
        aria-current={currentStage === "strategy" ? "page" : undefined}
        aria-label="전략안 선택"
        className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all ${
          currentStage === "strategy"
            ? "bg-surface-bright dark:bg-surface-variant text-primary font-bold shadow-sm scale-98"
            : "text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high scale-98 active:scale-95"
        }`}
      >
        <span
          className={`material-symbols-outlined mr-3 ${
            currentStage === "strategy" ? "fill" : ""
          }`}
        >
          ads_click
        </span>
        <span className="font-body-sm text-body-sm">전략안 선택</span>
      </button>

      <div className="mx-4 my-2 border-t border-dashed border-outline-variant"></div>

      {/* 4. 계약 자료 검색 */}
      <button
        type="button"
        onClick={() => onSelectStage("contracts")}
        aria-current={currentStage === "contracts" ? "page" : undefined}
        aria-label="계약 자료 검색"
        className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all ${
          currentStage === "contracts"
            ? "bg-surface-bright dark:bg-surface-variant text-primary font-bold shadow-sm scale-98"
            : "text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high scale-98 active:scale-95"
        }`}
      >
        <span
          className={`material-symbols-outlined mr-3 ${
            currentStage === "contracts" ? "fill" : ""
          }`}
        >
          search
        </span>
        <span className="font-body-sm text-body-sm">계약 자료 검색</span>
      </button>
    </nav>
  );
};
