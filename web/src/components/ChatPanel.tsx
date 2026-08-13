import React, { useState } from "react";
import { ChatMessage } from "../types";
import { sendChatMessage } from "../api/agentApi";

interface ChatPanelProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  contextInfo?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  setMessages,
  contextInfo,
}) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // 1. Append user message immediately
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsLoading(true);

    try {
      // 2. Call API
      const reply = await sendChatMessage({
        message: query,
        history: [...messages, userMsg],
        context: contextInfo,
      });

      // 3. Append agent response
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "agent",
          agentName: "네비게이터 System",
          text: "메시지 전송 중 오류가 발생했습니다. 다시 시도해 주세요.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="w-80 bg-surface-container-low border-l border-outline-variant flex flex-col h-full shrink-0 z-30">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant bg-surface-container flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-sm">smart_toy</span>
          </div>
          <div>
            <h3 className="font-title-lg text-title-lg text-on-background leading-tight">
              네비게이터
            </h3>
            <span className="font-label-caps text-label-caps text-success flex items-center mt-0.5">
              <span className="w-2 h-2 rounded-full bg-success mr-1.5 animate-pulse"></span>
              활성
            </span>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-body-sm text-body-sm">
        <div className="text-center">
          <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full font-label-caps text-label-caps text-[10px]">
            세션 시작: {contextInfo || "분석 준비 완료"}
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user"
                ? "items-end self-end ml-auto max-w-[85%]"
                : "items-start max-w-[85%]"
            }`}
          >
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-1 px-1">
              {msg.role === "user" ? "나" : msg.agentName || "코디네이터 AI"}
            </span>
            <div
              className={`px-4 py-2.5 rounded-2xl shadow-sm border ${
                msg.role === "user"
                  ? "bg-primary text-on-primary border-primary rounded-tr-sm"
                  : msg.agentName?.includes("리스크")
                  ? "bg-surface border-outline-variant text-on-background rounded-tl-sm"
                  : "bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim rounded-tl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
            {msg.timestamp && (
              <span className="text-[10px] text-outline mt-1 px-1">
                {msg.timestamp}
              </span>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start max-w-[85%]">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-1 px-1">
              코디네이터 AI
            </span>
            <div className="bg-primary-fixed border border-primary-fixed-dim rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm animate-spin text-primary">
                progress_activity
              </span>
              <span className="text-xs text-on-primary-fixed">답변 작성 중...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-outline-variant bg-surface">
        {/* Quick Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            type="button"
            onClick={() => handleSend("옵션 C 리스크 상세 설명해줘")}
            className="shrink-0 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface-variant font-body-sm text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
          >
            옵션 C 리스크 상세 설명
          </button>
          <button
            type="button"
            onClick={() => handleSend("과거 계약 이력 보기")}
            className="shrink-0 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface-variant font-body-sm text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
          >
            이력 보기
          </button>
        </div>

        <div className="relative mt-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-3 pr-10 py-2 font-body-sm text-body-sm text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            placeholder="에이전트에게 문의..."
            rows={2}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 bottom-3 text-primary hover:text-primary-container disabled:opacity-40 p-1 rounded-full transition-colors"
            aria-label="Send message"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
