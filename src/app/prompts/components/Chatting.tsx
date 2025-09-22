import { Message } from "@/types/prompts/chat";
import React, { useEffect, useRef } from "react";

const Chatting = ({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Scroll 영역
  return (
    <div className="chat-scroll w-full h-[calc(100vh-300px)] overflow-y-auto">
      <div className="flex flex-col gap-2 items-start" id="chatting-area">
        {messages.map((message, index) => {
          return (
            <div key={index} className="w-full">
              <ChattingMessage role={message.role} message={message.content} />
            </div>
          );
        })}
        {isLoading && <LoadingMessage />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

const ChattingMessage = ({
  role = "user",
  message = "",
}: {
  role?: "user" | "assistant" | "system";
  message?: string;
}) => {
  const mapRole = {
    user: "User",
    assistant: "Assistant",
    system: "System",
    function_call: "Function Call",
    function_call_output: "Function Call Output",
  };

  //    ``` ``` 영역 background 컬러 변경
  let processedMessage = message?.replace(/\n/g, "<br />");

  processedMessage = processedMessage?.replace(
    /```(.*?)```/g,
    `<div class="bg-gray-100 p-2 rounded-md"><p class="text-sm text-gray-500">Code</p>$1</div>`
  );

  processedMessage = processedMessage?.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  if (role === "system") return null;
  return (
    <div className="flex flex-col border-gray-300 border-1 rounded-md p-2 gap-2 cursor-pointer hover:border hover:border-gray-300 hover:rounded-md max-w-xl break-words">
      <div
        className={`text-sm ${
          role === "assistant" ? "text-green-700" : "text-blue-700"
        } font-bold`}
      >
        {mapRole[role]}
      </div>
      <div
        className="text-sm break-words whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: processedMessage }}
      />
    </div>
  );
};

const LoadingMessage = () => {
  return (
    <div
      className="w-full h-10 rounded-md bg-gray-100 relative overflow-hidden"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute top-0 left-0 h-full w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(200,200,200,0.2), transparent)",
          animation: "shimmer 1.5s infinite",
          transform: "translateX(-100%)",
        }}
      />
      <style>
        {`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}
      </style>
    </div>
  );
};

export default Chatting;
