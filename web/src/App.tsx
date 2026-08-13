import React, { useState } from "react";
import { AppStage, ChatMessage, QuotationFormData } from "./types";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ChatPanel } from "./components/ChatPanel";
import { QuotationInputView } from "./components/QuotationInputView";
import { AgentPipelineView } from "./components/AgentPipelineView";
import { StrategySelectionView } from "./components/StrategySelectionView";
import { ContractSearchView } from "./components/ContractSearchView";

export default function App() {
  // Stage state machine ("input" | "pipeline" | "strategy" | "contracts")
  const [currentStage, setCurrentStage] = useState<AppStage>("input");
  const [currentRequestId, setCurrentRequestId] = useState<string>("REQ-001");
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState<QuotationFormData | null>(null);

  // Screen-specific chat message histories (Rule #13)
  const [inputChatMessages, setInputChatMessages] = useState<ChatMessage[]>([
    {
      id: "init-input",
      role: "agent",
      agentName: "네비게이터",
      text: "안녕하세요! 해상 견적 요청 정보를 입력하시면 AI 에이전트들이 최적의 라우팅 전략을 수립합니다.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [pipelineChatMessages, setPipelineChatMessages] = useState<ChatMessage[]>([
    {
      id: "init-pipeline-1",
      role: "agent",
      agentName: "에이전트 #1 (시장)",
      text: "운임 지수(SCFI) 상승 위험이 감지되었습니다. 시장 리스크 정보를 실시간 분석 중입니다.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [strategyChatMessages, setStrategyChatMessages] = useState<ChatMessage[]>([
    {
      id: "init-strat-1",
      role: "agent",
      agentName: "에이전트 #6 (리스크)",
      text: "도착 예정 시간 동안 부산 환적 허브에서 65% 확률의 혼잡 가능성으로 인해 옵션 B (속도 최적화)에 경고를 표시했습니다.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "init-strat-2",
      role: "agent",
      agentName: "에이전트 #2 (비용/라우팅)",
      text: "이해했습니다만, 옵션 B는 부산을 완전히 우회하는 직항 노선을 이용합니다. 혼잡도 지표는 MSC OSCAR의 예정된 노선에 적용되지 않아야 합니다.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "init-strat-3",
      role: "user",
      text: "왜 처음에 부산 옵션이 거부되었나요?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "init-strat-4",
      role: "agent",
      agentName: "코디네이터 AI",
      text: "에이전트 #6은 부산항 분석에 오래된 터미널 일정을 사용하고 있습니다. 옵션 B에 대한 경고를 무시하도록 처리했습니다. 최신 직항 라우팅 확인을 바탕으로 옵션 B가 여전히 추천 전략입니다.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [contractsChatMessages, setContractsChatMessages] = useState<ChatMessage[]>([
    {
      id: "init-contracts",
      role: "agent",
      agentName: "코디네이터 AI",
      text: "사내 계약 및 운항 실적 데이터베이스에서 조건별로 조회하실 수 있습니다. 특정 계약의 지연 원인 및 AI 검토 의견을 확인하세요.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Handler when quotation request is submitted
  const handleQuotationSubmitted = (requestId: string, formData: QuotationFormData) => {
    setCurrentRequestId(requestId);
    setLastSubmittedFormData(formData);
    // Stage transition to pipeline
    setCurrentStage("pipeline");

    // Add notification to pipeline chat
    setPipelineChatMessages((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}`,
        role: "agent",
        agentName: "네비게이터",
        text: `견적 요청 [${requestId}]이 접수되어 3개의 에이전트 분석 파이프라인이 가동되었습니다.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Handler when agent pipeline auto-completes
  const handlePipelineCompleted = (requestId: string) => {
    setCurrentStage("strategy");

    setStrategyChatMessages((prev) => [
      ...prev,
      {
        id: `comp-${Date.now()}`,
        role: "agent",
        agentName: "코디네이터 AI",
        text: `요청건 [${requestId}]에 대한 멀티 에이전트 분석이 완료되었습니다. 추천 전략안(옵션 B)을 검토하세요.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Get active chat messages & context string for chat panel
  const getActiveChatProps = () => {
    switch (currentStage) {
      case "input":
        return {
          messages: inputChatMessages,
          setMessages: setInputChatMessages,
          contextInfo: "견적 요청 입력",
        };
      case "pipeline":
        return {
          messages: pipelineChatMessages,
          setMessages: setPipelineChatMessages,
          contextInfo: `Agent Pipeline [${currentRequestId}]`,
        };
      case "strategy":
        return {
          messages: strategyChatMessages,
          setMessages: setStrategyChatMessages,
          contextInfo: `전략안 선택 [${currentRequestId}]`,
        };
      case "contracts":
        return {
          messages: contractsChatMessages,
          setMessages: setContractsChatMessages,
          contextInfo: "계약 자료 검색",
        };
    }
  };

  const activeChat = getActiveChatProps();

  return (
    <div className="h-screen w-full flex flex-col bg-background text-on-background overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left Sidebar Menu */}
        <Sidebar
          currentStage={currentStage}
          onSelectStage={(stage) => setCurrentStage(stage)}
        />

        {/* Center Dynamic Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background relative min-w-0">
          {currentStage === "input" && (
            <QuotationInputView onSubmitSuccess={handleQuotationSubmitted} />
          )}

          {currentStage === "pipeline" && (
            <AgentPipelineView
              requestId={currentRequestId}
              onNavigateToStrategy={handlePipelineCompleted}
            />
          )}

          {currentStage === "strategy" && (
            <StrategySelectionView requestId={currentRequestId} />
          )}

          {currentStage === "contracts" && <ContractSearchView />}
        </main>

        {/* Right Discussion / Chat Panel - ONLY displayed in Strategy Selection View */}
        {currentStage === "strategy" && (
          <ChatPanel
            messages={activeChat.messages}
            setMessages={activeChat.setMessages}
            contextInfo={activeChat.contextInfo}
          />
        )}
      </div>
    </div>
  );
}
